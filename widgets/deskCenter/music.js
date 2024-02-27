import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import {setupCursorHover} from "../../lib/cursorhover.js"

const defaultCoverPath = `${App.configDir}/assets/cover.jpg`
let progressBarVal = 0

const computeNowPlayer = (players) => {

  const defautPlayer={ "cover-path": defaultCoverPath }

  if (players.length === 1) {
    return players[0];
  } else if (players.length > 1) {
    //循环出can palyer的
    const player = players.find((item) => {
      return item["can-play"] && item['play-back-status'] !='Stopped' &&item['play-back-status'] !='Paused';
    });

    if(!player){
      return defautPlayer
    }

    return player;
  } else {
    return defautPlayer
  }
};

const musicCover = (cover_width) => {
  let css = `min-height:${cover_width * 4 / 5}px;min-width:${
    cover_width * 4 / 5
  }px;background-size:cover;border-radius:0.5rem;`;
  const widget = Widget.Box({
    vpack: "center",
    hpack: "end",
  });

  widget.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    const cover = player["cover-path"] || defaultCoverPath;
    css = css + `background-image:url('${cover}');`;
    self.css = css;
  }, "changed");

  return widget;
};

const leftPart = (avg_row_px, topPartHeight) => {
  const width = topPartHeight * 4 / 5;
  const widget = Widget.Box({
    homogeneous: true,
    css: `min-width:${width}px;min-height:${width}px;`,
    children: [
      musicCover(width),
    ],
  });

  return widget;
};

const author = () => {
  const authorLabel = Widget.Label({
    hpack: "center",
    maxWidthChars: 18,
    ellipsize: 3,
    wrap: true,
    css: `color:#fff;font-size:1.2rem;font-weight:800;margin-bottom:0.5rem`,
  });

  authorLabel.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    const title_txt = player["track-artists"]? player["track-artists"].join("") : "未播放";
    self.label = title_txt;
  }, "changed");

  const widget = Widget.Box({
    hpack: "center",
    children: [authorLabel],
  });

  return widget;
};

const title = () => {
  const titleLabel = Widget.Label({
    hpack: "center",
    // justify: Gtk.Justification.LEFT,
    maxWidthChars: 25,
    ellipsize: 3,
    wrap: true,
    css: `color:#fff;font-size:0.9rem;margin-bottom:0.5rem`,
  });

  titleLabel.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    const title_txt = player["track-title"]||"暂无";
    self.label = title_txt;
  }, "changed");

  const widget = Widget.Box({
    hpack: "center",
    children: [titleLabel],
  });

  return widget;
};

//播放或者暂停
const playOrPause = () =>{
  //播放或者暂停
  let play_icon = `${App.configDir}/assets/play.png`;
  let pause_icon= `${App.configDir}/assets/pause.png`;

  const playOrPauseWidget = Widget.Icon({
    icon: play_icon,
    size: 58,
  });
  
  playOrPauseWidget.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    if(!player){
      self.icon =play_icon
      return
    }

    if(player['play-back-status'] === 'Playing'){
      self.icon = pause_icon
    }else{
      self.icon =play_icon
    }
  }, "changed");

  const widget = Widget.Button({
    css:'background-color:transparent;background-image:none;border:0;box-shadow:none',
    child:playOrPauseWidget,
    onClicked:()=>{
      const player = computeNowPlayer(Mpris.players);
      if(player['play-back-status'] === 'Playing'){
        player.playPause()
      }else{
        player.play()
      }
    },
    setup: (button) => {
      setupCursorHover(button);
    },
  })
  return widget
}

const next  = () =>{
  const next = Widget.Icon({
    icon: `${App.configDir}/assets/next.png`,
    size: 42,
  });

  const widget = Widget.Button({
    css:'background-color:transparent;background-image:none;border:0;box-shadow:none',
    child:next,
    onClicked:()=>{
      const player = computeNowPlayer(Mpris.players);
      player.next()
    },
    setup: (button) => {
      setupCursorHover(button);
    },
  })
  return widget
}


const prev  = () =>{
  const prev = Widget.Icon({
    icon: `${App.configDir}/assets/prev.png`,
    size: 42,
  });

  const widget = Widget.Button({
    css:'background-color:transparent;background-image:none;border:0;box-shadow:none',
    child:prev,
    onClicked:()=>{
      const player = computeNowPlayer(Mpris.players);
      player.previous()
    },
    setup: (button) => {
      setupCursorHover(button);
    },
  })
  return widget
}


const handle = (avg_row_px) => {

  const widget = Widget.Box({
    // css:`background-color:#000`,
    css: `min-width:${avg_row_px}px`,
    hpack: "center",
    homogeneous: true,
    children: [
      prev(),
      playOrPause(),
      next(),
    ],
  });
  return widget;
};

const rightPart = (avg_row_px) => {
  const widget = Widget.Box({
    hpack: "center",
    vpack: "center",
    hexpand: true,
    vertical: true,
    children: [
      author(),
      title(),
      handle(avg_row_px),
    ],
  });

  return widget;
};

const topPart = (avg_row_px) => {
  const topPartHeight = avg_row_px * 4 / 5;
  const widget = Widget.Box({
    hpack: "fill",
    hpack: "fill",
    css: `min-width:${avg_row_px * 2}px;min-height:${topPartHeight}px`,
    children: [
      leftPart(avg_row_px, topPartHeight),
      rightPart(avg_row_px),
    ],
  });

  return widget;
};

function formatTime(seconds) {
    if (isNaN(seconds) || seconds <= 0) {
      return "00:00"
    }

  const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = Math.floor(remainingSeconds) < 10 ? `0${Math.floor(remainingSeconds)}` : `${Math.floor(remainingSeconds)}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}

const statusTime = ()=>{
  const totalTime = Widget.Label({
    hpack:'start',
    css:'font-size:0.7rem;color:#fff;font-weight:800',
  })


  totalTime.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    const totalStr = formatTime(player.length || 0)
    self.label = totalStr
  }, "changed");

  const nowTime = Widget.Label({
    hpack:'end',
    css:'font-size:0.7rem;color:#fff;font-weight:800',
    label:"test"
  })


  let timeTask = 0
  let nowTimeStr =null
  nowTime.hook(Mpris, (self) => {
    const player = computeNowPlayer(Mpris.players);
    const total = player.length || 0
    nowTimeStr =  player.position || 0 
    self.label = formatTime(nowTimeStr)
    if(timeTask){
      timeTask.destroy()
    }
    timeTask =setInterval(() => { 
      if(player['play-back-status'] !== 'Playing'){
        return
      }
      if(total >0 ){
        nowTimeStr++
        progressBarVal =   (nowTimeStr/total).toFixed(3)
      }else{
        nowTimeStr = 0 
        progressBarVal =0
      }
      self.label = formatTime(nowTimeStr)
    }, 1000)
  }, "changed");

  const statusTimeWidget = Widget.Box({
    css:'min-height:0.3rem;margin-top:0.2rem',
    vpack:'fill',
    hpack:'fill',
    homogeneous:true,
    children:[
      totalTime,
      nowTime
    ]
  })
  return statusTimeWidget
}

const bottomPart = (avg_row_px) => {
  const progressBar = Widget.ProgressBar({
    className:'osd-progress',
    setup:(self)=>{
      setInterval(()=>{
        self.value = progressBarVal
      },1000)
    }
  });

  const widget = Widget.Box({
    css:'padding:0 1rem;',
    vpack: "fill",
    hpack: "fill",
    hexpand: true,
    vertical:true,
    children: [
      progressBar,
      statusTime()
    ],
  });

  return widget;
};

const music = (avg_row_px) => {
  const widget = Widget.Box({
    hpack: "fill",
    vpack: "fill",
    vertical: true,
    css: `min-width:${avg_row_px * 2}px;min-height:${avg_row_px}px;background-color:rgba(0,0,0,0.7);border-radius:1.5rem;`,
    children: [
      topPart(avg_row_px),
      bottomPart(avg_row_px),
    ],
  });

  return widget;
};
export default music;
