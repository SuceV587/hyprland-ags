import App from 'resource:///com/github/Aylur/ags/app.js';
import Dock from "./widget/dock/index"
import Corner from "./widget/decorator/corner"
import DymicIsland from "./widget/dymicIsland/index"

// import Mask from "./widget/mask/index"

import Applauncher from './widget/applauncher/index'
import monitorUtils from "./lib/monitor"
import topBar from './widget/topBar/index';
import DeskCenter from './widget/deskCenter/index';

App.config({
  style: `${App.configDir}/style/index.css`,
  onConfigParsed: () => {
  },
  windows: () => {
    return [
      ...monitorUtils.forMonitors(topBar),
      new Dock().mainWidget,
      // top placement dymicIsland 
      new DymicIsland().mainWidget,
      //applauncher with keymap "Win"
      new Applauncher().mainWidget,
      // deskCenter
      new DeskCenter().mainWidget,
      //decoration round
      ...monitorUtils.forMonitors((monitor) => Corner(monitor, "top left")),
      ...monitorUtils.forMonitors((monitor) => Corner(monitor, "top right")),
      ...monitorUtils.forMonitors((monitor) => Corner(monitor, "bottom left")),
      ...monitorUtils.forMonitors((monitor) => Corner(monitor, "bottom right")),
    ]
  }
})
