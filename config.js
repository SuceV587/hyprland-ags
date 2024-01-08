
import topBar from './widgets/topBar/topBar.js'
import App from 'resource:///com/github/Aylur/ags/app.js';
import Dock from "./widgets/dock/index.js";
import notificationTop from './widgets/notification/notificationTop.js';
import Monitors from './lib/monitors.js'
import deskCenter from './widgets/deskCenter/index.js'

//定义主屏幕的id
const mainMonitorId = Monitors.mainMonitorId

export default {
  style: `${App.configDir}/style/index.css`,
  stackTraceOnError: true,
  windows: [
    topBar(mainMonitorId),
    Dock(mainMonitorId),
    notificationTop(mainMonitorId),
    deskCenter(mainMonitorId)
  ]
}
