
import topBar from './widgets/topBar/index.js'
import App from 'resource:///com/github/Aylur/ags/app.js';
import Dock from "./widgets/dock/index.js";
import notificationTop from './widgets/notification/notificationTop.js';
import deskCenter from './widgets/deskCenter/index.js';
import Monitors from './lib/monitors.js'



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
