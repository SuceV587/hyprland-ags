
import dockCenterLeft from './dockCenterLeft.js'
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const dockerCenter = Widget.Box({
  className: 'f-center',
  hpack: 'fill',
  children: [
    Widget.Label({
      label: 'fk'
    })

  ]
})

const dockerCenterEnd = Widget.Box({
  hpack: 'fill',
  children: [
    Widget.Label({
      label: 'fkss'
    })

  ]
})

const mainBox = Widget.CenterBox({
  className: 'f-bar',
  spacing: 1,
  hpack: 'fill',
  vpack: 'fill',
  startWidget: dockCenterLeft(),
  centerWidget: null,
  endWidget: null,
})

const deskCenter = () => {
  const win = Widget.Window({
    name: `dock_center_left`,
    margins: [20, 0, 0, 20],
    anchor: ['top', 'left', 'right'],
    child: mainBox,
    layer: 'background'  //可以被覆盖在底层。相当于css里面z-index较低的层级
  })
  return win
}

export default deskCenter















