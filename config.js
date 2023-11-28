
import topBar from './widgets/topBar/index.js'
import App from 'resource:///com/github/Aylur/ags/app.js';
import Dock from "./widgets/dock/index.js";
import notificationTop from './widgets/notification/notificationTop.js';
// import deskCenter from './widgets/deskCenter/index.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';


//定义主屏幕
const mainMonitor = 1
// const mainbar = topBar(mainMonitor)




export default {
  style: `${App.configDir}/style/index.css`,
  stackTraceOnError: true,
  windows: [
    topBar(mainMonitor),
    Dock(mainMonitor),
    notificationTop(mainMonitor),
    // deskCenter(mainMonitor)
  ]
}
