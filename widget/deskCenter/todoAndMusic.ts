import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import GLib from 'gi://GLib'
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { setupCursorHover } from "../../lib/cursorhover"
import { hexToRgba, hexToRgb } from "../../lib/color"

const defaultCoverPath = `${App.configDir}/assets/cover.jpg`
let progressBarVal = 0

export const playerEvent = Variable({
  artists: "暂无播放",
  title: "",
  cover: defaultCoverPath,
  playStatus: "Stopped",
  length: 0,
  position: 0
})

export let playerInfo: any = undefined


class TodoAndMusic {
  mainWidget!: Gtk.Widget
  resetWidth: boolean

  constructor() {
    this.resetWidth = false
    this.mainWidget = this.init()
  }

  init() {
    return Widget.Box({
      className: "f-picSys",
      css: "min-width:1px;min-height:1px",
      spacing: 20,
      homogeneous: true,
    }).on("size-allocate", (self, allocation) => {
      const width = allocation.width || 200
      if (width < 100 || this.resetWidth) {
        return
      }
      this.resetWidth = true
      const height = (width - 20) / 3
      self.setCss(`min-width:${width}px;min-height:${height}px;`)

      //init child
      self.children = [
        this.todo(width, height),
        this.music(width, height)
      ]
    })
  }

  todo(width, height) {
    const widget = Widget.Box({
      hpack: "fill",
      vpack: "fill",
      vertical: true,
      css: `
          background-color:#fff;
          border-radius:2rem;
      `,
      children: [
        this.topTodoPart(height),
        this.bottomTodoPart(height),
      ],
    });
    return widget;
  }

  topTodoPart(height) {
    const widget = Widget.Box({
      vpack: "center",
      css: `
        min-height:${height * 1 / 4}px;
        background-color:#ebb800;
        border-top-left-radius:2rem;
        border-top-right-radius:1.5rem
      `,
      children: [
        Widget.Label({
          css: "color:#fff;font-size:1rem;font-weight:600;padding-left:1em",
          label: "备忘录",
        }),
      ],
    });

    return widget;
  }

  bottomTodoPart(height) {
    const widget = Widget.Box({
      vertical: true,
      children: [],
    });

    const todoLable = (content = "") => {
      const widget = Widget.Box({
        css: "border-bottom:1px dotted  #999;margin-left:10px;margin-right:10px;padding-bottom:5px",
        children: [
          Widget.Label({
            vpack: "center",
            css: "color:#000;font-size:0.9rem;padding-top:10px;",
            label: content,
          }),
        ],
      });

      return widget;
    };

    return widget;
  }

  music(width, height) {
    let debounceTaskId = 0
    let retryTime = 0
    const widget = Widget.Box({
      css: `
        background-color:rgba(0,0,0,0.6);
        border-radius:2rem;
      `,
      child: Widget.Box({
        css: `
        background-color:rgba(99,99,99,0.3);
        border-radius:2rem;
        `,
        hpack: "fill",
        vpack: "fill",
        vertical: true,
        children: [
          this.topMusicPart(width, height),
          this.bottomMusicPart(height),
        ]
      })
    }).hook(Mpris, () => {
      //debounce run
      if (debounceTaskId) {
        GLib.source_remove(debounceTaskId)
      }

      //delay 2s
      debounceTaskId = Utils.timeout(100, () => {
        this.handleMpris(retryTime)
        debounceTaskId = 0
      })
    }, "changed").hook(playerEvent, self => {
      const { cover } = playerEvent.value
      Utils.execAsync([`bash`, `-c`, `wal -i ${cover} -n -t -s -e -q && cat ~/.cache/wal/colors.json`]).then(tmpStr => {
        try {
          const colorScheme = JSON.parse(tmpStr)
          if (colorScheme.colors && colorScheme.colors.color1) {
            const bg = hexToRgba(colorScheme.colors.color1, 0.7)
            const bg2 = hexToRgba(colorScheme.colors.color2, 0.6)
            const bgCss = `background-image: radial-gradient(circle, ${bg} 0%, ${bg2} 100%);`
            self.setCss(`${bgCss};border-radius:2rem;`)
          }
        } catch (e) {
          console.error(e)
        }
      })

    }, "changed");

    return widget;
  }

  bottomMusicPart(height) {
    const progressBar = Widget.ProgressBar({
      className: 'osd-progress',
      setup: (self) => {
        setInterval(() => {
          self.value = progressBarVal
        }, 1000)
      }
    });

    const widget = Widget.Box({
      css: 'padding:0 1rem;',
      vexpand: true,
      hexpand: true,
      vpack: "center",
      vertical: true,
      children: [
        progressBar,
        this.progressTime()
      ],
    });

    return widget;
  }

  progressTime() {
    let taskId = 0
    const totalTime = Widget.Label({
      hpack: 'start',
      css: 'font-size:0.7rem;color:#fff;font-weight:800',
      label: playerEvent.bind().as(info => this.formatTime(info.length)),
    })

    const nowTime = Widget.Label({
      hpack: 'end',
      css: 'font-size:0.7rem;color:#fff;font-weight:800',
      label: "test"
    }).hook(playerEvent, (self) => {
      let { length: total, position: nowTimeStr, playStatus } = playerEvent.value
      self.label = this.formatTime(nowTimeStr)

      if (taskId) {
        GLib.source_remove(taskId)
      }

      taskId = Utils.interval(1000, () => {
        if (playStatus !== 'Playing') {
          return
        }
        if (total > 0) {
          nowTimeStr++
          progressBarVal = parseFloat((nowTimeStr / total).toFixed(3))
          progressBarVal = progressBarVal >= 1 ? 1 : progressBarVal
        } else {
          nowTimeStr = 0
          progressBarVal = 0
        }
        self.label = this.formatTime(nowTimeStr)
      })
    }, "changed");

    const statusTimeWidget = Widget.Box({
      css: 'min-height:0.3rem;margin-top:0.2rem',
      vpack: 'fill',
      hpack: 'fill',
      homogeneous: true,
      children: [
        totalTime,
        nowTime
      ]
    })
    return statusTimeWidget
  }

  topMusicPart(width, height) {
    width = (width - 20) / 2
    const widget = Widget.Box({
      hpack: "fill",
      vpack: "end",
      css: `
          padding:1rem;
      `,
      children: [
        this.leftPart(width),
        this.rightPart(width),
      ],
    });

    return widget;
  }

  rightPart(width) {
    const widget = Widget.Box({
      hpack: "center",
      vpack: "center",
      hexpand: true,
      vexpand: true,
      vertical: true,
      children: [
        this.author(),
        this.title(),
        this.handle(),
      ],
    });

    return widget;
  }

  author() {
    const authorLabel = Widget.Label({
      hpack: "center",
      maxWidthChars: 18,
      ellipsize: 3,
      wrap: true,
      css: `color:#fff;font-size:1.2rem;font-weight:800;margin-bottom:0.5rem`,
      label: playerEvent.bind().as(info => info.artists),
    })

    const widget = Widget.Box({
      hpack: "center",
      child: authorLabel,
    });

    return widget;
  }

  title() {
    const titleLabel = Widget.Label({
      hpack: "center",
      maxWidthChars: 25,
      ellipsize: 3,
      wrap: true,
      css: `color:#fff;font-size:0.9rem;margin-bottom:0.5rem`,
      label: playerEvent.bind().as(info => info.title),
    })

    const widget = Widget.Box({
      hpack: "center",
      child: titleLabel,
    });

    return widget;
  }

  handle() {
    const widget = Widget.Box({
      css: `
      `,
      hpack: "center",
      homogeneous: true,
      setup: self => {
        Utils.idle(() => {
          self.children = [
            this.preve(),
            this.playOrPause(),
            this.next()
          ]
        }, 100)
      }
    });
    return widget;
  }

  preve() {
    const iconWidget = Widget.Icon({
      size: 22,
      setup: self => {
        Utils.idle(() => {
          self.icon = `${App.configDir}/assets/prev.png`
        })
      }
    })

    return Widget.Button({
      css: 'background-color:transparent;background-image:none;border:0;box-shadow:none',
      child: iconWidget,
      onClicked: () => {
        if (playerInfo) {
          playerInfo.previous()
        }
      },
      setup: self => {
        setupCursorHover(self);
      },
    })
  }

  playOrPause() {
    //播放或者暂停
    let play_icon = `${App.configDir}/assets/play.png`;
    let pause_icon = `${App.configDir}/assets/pause.png`;

    const playOrPauseWidget = Widget.Icon({
      icon: playerEvent.bind().as(info => info.playStatus == 'Playing' ? pause_icon : play_icon),
      size: 28,
    })

    return Widget.Button({
      css: 'background-color:transparent;background-image:none;border:0;box-shadow:none',
      child: playOrPauseWidget,
      onClicked: () => {
        if (playerInfo && playerInfo['play-back-status'] === 'Playing') {
          playerInfo.playPause()
        } else {
          playerInfo.play()
        }
      },
      setup: (button) => {
        setupCursorHover(button);
      },
    })

  }

  next() {
    const next = Widget.Icon({
      size: 22,
      setup: self => {
        Utils.idle(() => {
          self.icon = `${App.configDir}/assets/next.png`
        })
      }
    });

    const widget = Widget.Button({
      css: 'background-color:transparent;background-image:none;border:0;box-shadow:none',
      child: next,
      onClicked: () => {
        if (playerInfo) {
          playerInfo.next()
        }
      },
      setup: (button) => {
        setupCursorHover(button);
      },
    })
    return widget
  }


  leftPart(width) {
    let css = `min-width:${width / 4}px;
               min-height:${width / 4}px;
               background-size:cover;
               border-radius:0.75rem;
              `;

    const widget = Widget.Box({
      homogeneous: true,
      vpack: "center",
      hpack: "end",
      css: playerEvent.bind().as(info => css + `background-image:url('${info.cover}');`),
    })
    return widget;
  }


  formatTime(seconds) {
    if (isNaN(seconds) || seconds <= 0) {
      return "00:00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = Math.floor(remainingSeconds) < 10 ? `0${Math.floor(remainingSeconds)}` : `${Math.floor(remainingSeconds)}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  handleMpris(retryTime) {
    //先尝试寻找状态为playing
    let tmp = Mpris.players.find((item) => {
      return item["can-play"] && (item['play-back-status'] == 'Playing') && item["length"] != -1;
    });

    if (!tmp) {
      tmp = Mpris.players.find((item) => {
        return item["can-play"] && item['play-back-status'] != 'Stopped' && item["length"] != -1;
      });
    }

    if (!tmp && retryTime < 10) {
      retryTime++
      return
    } else {
      retryTime = 0
      playerInfo = tmp
    }

    playerEvent.setValue({
      artists: playerInfo ? playerInfo['track-artists'].join("") : "暂无播放",
      title: playerInfo ? playerInfo['track-title'] : "",
      cover: playerInfo ? playerInfo['cover-path'] : defaultCoverPath,
      playStatus: playerInfo ? playerInfo['play-back-status'] : "Stopped",
      length: playerInfo ? playerInfo['length'] : 0,
      position: playerInfo ? playerInfo['position'] : 0
    })
  }
}

export default TodoAndMusic
