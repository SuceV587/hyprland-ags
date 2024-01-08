
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { rightBar } from './rightBar.js'
const topRightBar = function(monitor = 1) {

  const win = Widget.Window({
    monitor,
    name: `bar-right-${monitor}`,
    anchor: ['top','right'],
    child: rightBar(),
    // exclusive: true,
    layer: 'top'
  })
  return win
}



export default topRightBar
