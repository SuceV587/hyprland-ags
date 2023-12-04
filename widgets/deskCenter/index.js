
const { Gdk, Gtk } = imports.gi;
import deskCenterLeft from './deskCenterLeft.js'
import deskCenterCenter from './deskCenterCenter.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import monitors from '../../lib/monitors.js';

//每个组件之间的spacing
const main_desk_left_spacing = 25
const main_desk_right_spacing = 25
const desk_widget_spacing = 20
const colum_widget_spacing = 20

const avg_row_px = (monitors.mainMonitorWidth - colum_widget_spacing * 6 - main_desk_right_spacing - main_desk_left_spacing) / 16


const dockerCenterEnd = Widget.Box({
})

const mainBox = Widget.CenterBox({
  className: 'f-bar',
  spacing: colum_widget_spacing,
  startWidget: deskCenterLeft(avg_row_px, desk_widget_spacing),
  centerWidget: deskCenterCenter(avg_row_px, desk_widget_spacing),
  endWidget: dockerCenterEnd,
})

const deskCenter = (monitor) => {
  const win = Widget.Window({
    monitor,
    name: `dock_center_left`,
    margins: [50, main_desk_right_spacing, 0, main_desk_left_spacing],
    anchor: ['top', 'left', 'right'],
    child: mainBox,
    layer: 'background'  //可以被覆盖在底层。相当于css里面z-index较低的层级
  })
  return win
}

export default deskCenter
