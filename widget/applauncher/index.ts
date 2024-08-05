import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { archiveApps } from '../../lib/applauncher'
import { getClientIcon, ignoreAppsClass, focus } from "../../lib/client";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import Gtk from 'types/@girs/gtk-3.0/gtk-3.0';
import { Variable as VariableT } from 'types/variable';


interface eventVarProp {
  event: string
}
interface eventDataProp {
  searchKeyWord: string;
  scrollHoverIndex: number;
  archiveScrollHoverIndex?: number;
  scrollSelectUuid?: string;
  openArchiveName?: string;
  mouseIn?: boolean;
}



class Applauncher {
  mainWidget: Gtk.Window
  maxRows: number
  archiveMaxRows: number
  currentHover: number
  scrollHeight: number
  eventVar: VariableT<eventVarProp>
  eventData!: eventDataProp


  constructor(monitor = 1) {
    this.currentHover = 0
    this.maxRows = 15
    this.archiveMaxRows = 5
    this.scrollHeight = 42
    this.eventData = { searchKeyWord: "", scrollHoverIndex: 0, archiveScrollHoverIndex: 0, openArchiveName: "", mouseIn: false }


    //初始化event监听
    this.eventVar = Variable({ event: "" })
    this.mainWidget = this.init(monitor)
  }

  init(monitor: number) {
    return Widget.Window<Gtk.Widget>({
      monitor,
      name: `applauncher`,
      layer: 'top',
      anchor: ['bottom'],
      child: this.initApps(),
      visible: false,
      margins: [0, 0, 0, 0],
      keymode: "exclusive",
    }).on("key-press-event", (self, event) => {
      const keyval = event.get_keyval()[1];
      //Esc
      if (keyval == 65307) {
        this.closeHandle()
      }

      if (keyval == 104 || keyval == 65361) {
        this.emitEvent("moveLeft")
      }

      if (keyval == 108 || keyval == 65363) {
        this.emitEvent("moveRight")
      }

      if (keyval == 107 || keyval == 65362) {
        this.emitEvent("moveTop")
      }

      if (keyval == 106 || keyval == 65364) {
        this.emitEvent("moveBottom")
      }

      if (keyval == 65293) {
        this.emitEvent("activeApp")
      }
    }).on("button-press-event", () => {
      Utils.idle(() => {
        if (!this.eventData.mouseIn) {
          this.closeHandle()
        }
      })
    })
  }

  initApps() {
    return Widget.Overlay({
      passThrough: false,
      child: Widget.Box({
        css: `background-color:rgba(0,0,0,0.4);border-radius:1.75rem;padding:1rem`,
        vertical: true,
        children: [
          this.appEntry(),
          this.appScroll(),
        ],
      }),
      overlays: [
        this.archiveOverlay()
      ]
    })
  }

  appEntry() {
    return Widget.Box({
      vpack: "center",
      hpack: "center",
      className: "applauncher",
      setup: self => {
        Utils.idle(() => {
          const width = self.get_parent()?.get_allocated_width() || 600
          self.setCss(`min-width:${width * 0.6}px;`)
          self.child = Widget.Entry({
            hexpand: true,
            placeholder_text: ' search run windows',
            css:
              `min-height:2.5rem;
                margin:0.8rem 0;
                padding-left:0.5em;
                font-size:1rem;
                font-weight:700;
                border:none;
                background-color:#999;
                color:#fff;
                border-radius:0.5rem;`,
            onAccept: () => {
            },
            onChange: ({ text }) => {
              this.eventData.searchKeyWord = text || ""
              this.emitEvent("search")
            },
          }).hook(App, (self, win, visible) => {
            Utils.idle(() => {
              if (win !== "applauncher") {
                return
              }
              if (visible) {
                //clear search words
                self.text = ""
                self.grab_focus();
              }
            })
          }).hook(this.eventVar, self => {
            Utils.idle(() => {
              const { event } = this.eventVar.value
              if (event == "openArchive") {
                self.editable = false
              } else if (event == "closeArchive") {
                self.editable = true
              }
            })
          })

        })
      }
    })
  }

  archiveOverlay() {
    return Widget.Box({
      css: 'background-color:rgba(0,0,0,0.5);border-radius:1.75rem',
      homogeneous: true,
      child: Widget.Box({
        vertical: true,
        hpack: "center",
        vpack: "center",
        css: `
                padding:1rem;
                background:rgba(99,99,99,0.9);
                border-radius:1.75rem`,
        children: [
          Widget.Label({
            css: "color:#fff;font-size:1.5rem;font-weight:500;padding-bottom:0.5em;",
            label: "Soft",
          }).hook(this.eventVar, self => {
            if (this.eventVar.value.event == "openArchive") {
              self.label = this.eventData.openArchiveName || ""
            }
          }),

          this.appScroll(true)
        ]
      }),
      setup: self => {
        Utils.idle(() => {
          self.visible = false
        })
      }
    }).hook(this.eventVar, self => {
      const { event } = this.eventVar.value
      if (event == "openArchive") {
        self.visible = true
      } else if (event == "closeArchive") {
        self.visible = false
      }
    })

  }

  appScroll(isArchiveDialog = false) {
    const appListWidget = Widget.FlowBox({
      hpack: isArchiveDialog ? "center" : "start",
      vpack: "start",
      row_spacing: 20,
      column_spacing: 20,
      homogeneous: true,
      min_children_per_line: isArchiveDialog ? this.archiveMaxRows : this.maxRows,
      max_children_per_line: isArchiveDialog ? this.archiveMaxRows : this.maxRows,
      activateOnSingleClick: false,
      selectionMode: Gtk.SelectionMode.NONE, //manual handle select
      setup: (self: any) => {
        archiveApps.forEach(app => {
          self.add(this.archiveAppsWidget(app, 'archive'))
        })

        applications.list.forEach(app => {
          self.add(this.archiveAppsWidget(app, 'app'))
        })
      }
    })

    return Widget.Scrollable({
      hscroll: "never",
      vscroll: "always",
      attribute: {
        appsChild: appListWidget.get_children(),
      },
      child: appListWidget,
      setup: self => {
        Utils.timeout(100, () => {
          const width = appListWidget.get_allocated_width()
          let height = this.scrollHeight
          if (isArchiveDialog) {
            height = height * 0.6
          }
          self.setCss(`min-width:${width}px;min-height:${height}rem`)

          //set first app hover
          this.selectHover(appListWidget, isArchiveDialog)
        })
      }
    }).hook(this.eventVar, self => {
      Utils.idle(() => {
        const { event } = this.eventVar?.value || {}
        const { openArchiveName } = this.eventData
        if (openArchiveName && !isArchiveDialog) {
          return
        }
        if (!openArchiveName && isArchiveDialog) {
          return
        }
        //search 
        if (event == "search") {
          this.search(appListWidget, isArchiveDialog)
        } else if (event == "moveRight") {
          this.moveRight(appListWidget, self, isArchiveDialog)
        } else if (event == "moveLeft") {
          this.moveLeft(appListWidget, self, isArchiveDialog)
        } else if (event == "moveTop") {
          this.moveTop(appListWidget, self, isArchiveDialog)
        } else if (event == "moveBottom") {
          this.moveBottom(appListWidget, self, isArchiveDialog)
        } else if (event == "appClick") {
          this.appClick(appListWidget, self, isArchiveDialog)
        } else if (event == "activeApp") {
          this.activeApp(appListWidget, isArchiveDialog)
        } else if (event == "openArchive" && isArchiveDialog) {
          this.filterArchive(appListWidget, isArchiveDialog)
        }
      })
    }).on("enter-notify-event", () => {
      this.eventData.mouseIn = true
    }).on("leave-notify-event", () => {
      this.eventData.mouseIn = false
    })
  }


  archiveAppsWidget(appInfo, type = "app") {
    let css = type == "archive" ? "min-width:4.5rem;min-height:4.5rem;background:rgba(252,252,252,0.5);border-radius:0.75rem;margin:0.35rem;padding:0.2rem" :
      "min-width:4.5rem;min-height:4.5rem;margin:0.35rem;"

    return Widget.Box({
      vertical: true,
      vpack: "center",
      hpack: "center",
      attribute: {
        type,
        appsName: appInfo.name,
        appInfo,
        uuid: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      },
      children: [
        Widget.FlowBox({
          css,
          vexpand: true,
          hexpand: true,
          vpack: "fill",
          min_children_per_line: 2,
          max_children_per_line: 2,
          setup: self => {
            const list = type == "archive" ? applications.list.filter(item => appInfo.list.includes(item.name)).slice(0, 4) : [appInfo]
            const maxChild = type == "archive" ? 4 : 1
            new Array(maxChild).fill(1).forEach((_, key) => {
              self.add(Widget.Box({
                child: Widget.Icon({
                  setup: self => {
                    Utils.idle(() => {
                      self.icon = list[key] ? (list[key]['icon-name'] ? getClientIcon(list[key]['icon-name']) : "") : ""
                      self.size = self.get_allocated_height() || 56
                    })
                  }
                })
              }))
            })
          }
        }),
        Widget.Label({
          className: "appLable",
          vpack: "center",
          hpack: "center",
          maxWidthChars: 8,
          wrap: true,
          ellipsize: 3,
          label: appInfo.name || ""
        })
      ]
    }).on('button-press-event', (self, _) => {
      this.eventData.scrollSelectUuid = self.attribute.uuid
      this.emitEvent("appClick")
    })
  }

  search(appsWidget, fromeArchiveDialog) {
    let { searchKeyWord } = this.eventData

    if(searchKeyWord == "dd"){
      searchKeyWord = "dingtalk"
    }else if(searchKeyWord == "wx"){
      searchKeyWord = "wechat"
    }


    appsWidget.get_children().forEach((item: any) => {
      if (!searchKeyWord) {
        item.visible = item.child.attribute.type === "archive" ||
          !archiveApps.map(item => item.list).flat(1).includes(item.child.attribute.appsName)
      } else {
        item.visible = item.child.attribute.type === "app"
          && (item.child.attribute.appInfo.name.toLowerCase().includes(searchKeyWord)
            || item.child.attribute.appInfo.executable.toLowerCase().includes(searchKeyWord))
      }
    })

    //set first child select
    this.eventData.scrollHoverIndex = 0
    this.selectHover(appsWidget, fromeArchiveDialog)
  }

  filterArchive(appsWidget, fromeArchiveDialog) {
    const { openArchiveName } = this.eventData

    appsWidget.get_children().forEach((item: any) => {
      item.visible = item.child.attribute.type === "app" &&
        archiveApps.find(item => item.name == openArchiveName)?.list.includes(item.child.attribute.appsName)
    })

    this.eventData.archiveScrollHoverIndex = 0
    this.selectHover(appsWidget, fromeArchiveDialog)
  }


  scrollAppList(hoverWidget, scrollWidget) {
    const currentChildAre = hoverWidget.get_allocation()
    const visibleAre = scrollWidget.get_vadjustment()
    visibleAre.set_value(currentChildAre.y)
  }

  moveLeft(appsWidget, scrollWidget, fromeArchiveDialog) {
    const { scrollHoverIndex, archiveScrollHoverIndex } = this.eventData
    const index = fromeArchiveDialog ? archiveScrollHoverIndex : scrollHoverIndex
    if (index == 0) {
      return
    }

    const nextHoverIndex = appsWidget.get_children().filter(item => item.visible).findIndex((_, key: number) => key == index - 1)
    if (nextHoverIndex != -1) {
      this.handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog)
    }
  }

  moveRight(appsWidget, scrollWidget, fromeArchiveDialog) {
    const { scrollHoverIndex, archiveScrollHoverIndex } = this.eventData
    const index = fromeArchiveDialog ? archiveScrollHoverIndex : scrollHoverIndex
    const nextHoverIndex = appsWidget.get_children().filter(item => item.visible).findIndex((_, key) => key == index + 1)

    if (nextHoverIndex != -1) {
      this.handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog)
    }
  }

  moveTop(appsWidget, scrollWidget, fromeArchiveDialog) {
    const index: number = fromeArchiveDialog ? this.eventData.archiveScrollHoverIndex || 0 : this.eventData.scrollHoverIndex || 0
    const step: number = fromeArchiveDialog ? this.archiveMaxRows : this.maxRows
    if (index >= step) {
      const nextHoverIndex = appsWidget.get_children().filter(item => item.visible).findIndex((_, key) => key == index - step)
      if (nextHoverIndex != -1) {
        this.handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog)
      }
    }
  }

  moveBottom(appsWidget, scrollWidget, fromeArchiveDialog) {
    const index: number = fromeArchiveDialog ? this.eventData.archiveScrollHoverIndex || 0 : this.eventData.scrollHoverIndex || 0
    const step: number = fromeArchiveDialog ? this.archiveMaxRows : this.maxRows
    const nextHoverIndex = appsWidget.get_children().filter(item => item.visible).findIndex((_, key) => key == index + step)
    if (nextHoverIndex != -1) {
      this.handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog)
    }
  }


  appClick(appsWidget, scrollWidget, fromeArchiveDialog) {
    const { scrollSelectUuid } = this.eventData
    const nextHoverIndex = appsWidget.get_children().filter(item => item.visible).findIndex((item) => item.child.attribute.uuid == scrollSelectUuid)
    const index = fromeArchiveDialog ? this.eventData.archiveScrollHoverIndex : this.eventData.scrollHoverIndex

    if (nextHoverIndex != -1) {
      // if app had hover active app
      if (nextHoverIndex == index) {
        this.activeApp(appsWidget, fromeArchiveDialog)
      } else {
        //not need scroll
        this.handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog, false)
      }
    }
  }

  handleHoverAndScroll(appsWidget, scrollWidget, nextHoverIndex, fromeArchiveDialog, scroll = true) {
    if (fromeArchiveDialog) {
      this.eventData.archiveScrollHoverIndex = nextHoverIndex
    } else {
      this.eventData.scrollHoverIndex = nextHoverIndex
    }

    this.selectHover(appsWidget, fromeArchiveDialog)
    const nextHover = appsWidget.get_children().filter(item => item.visible).find((_, key) => key == nextHoverIndex)

    if (scroll) {
      this.scrollAppList(nextHover, scrollWidget)
    }
  }

  emitEvent(handle: string) {
    this.eventVar?.setValue({ event: handle })
  }

  selectHover(appListWidget, fromeArchiveDialog) {
    const { scrollHoverIndex, archiveScrollHoverIndex } = this.eventData
    const index = fromeArchiveDialog ? archiveScrollHoverIndex : scrollHoverIndex
    appListWidget.get_children().filter(item => item.visible).forEach((item: any, key) => {
      item.child.toggleClassName("hoverItem", key == index)
    })
  }

  activeApp(appsWidget, fromeArchiveDialog) {
    const { scrollHoverIndex, archiveScrollHoverIndex, openArchiveName } = this.eventData
    const index = fromeArchiveDialog ? archiveScrollHoverIndex : scrollHoverIndex
    const current = appsWidget.get_children().filter(item => item.visible).find((_, key) => key == index)

    if (!fromeArchiveDialog && current.child.attribute.type == "archive") {
      this.eventData.openArchiveName = current.child.attribute.appsName
      this.emitEvent("openArchive")
    }

    //run Exec
    if (current.child.attribute.appInfo && current.child.attribute.appInfo.launch) {
      current.child.attribute.appInfo.launch()
      App.closeWindow(`applauncher`)
    }
  }

  closeHandle() {
    if (this.eventData.openArchiveName) {
      this.eventData.openArchiveName = ""
      this.eventData.mouseIn = true
      this.emitEvent("closeArchive")
    } else {
      App.closeWindow(`applauncher`)
    }
  }
}


export default Applauncher
