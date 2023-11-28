
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { clock } from './clock.js';


const sys_info = Widget.Box({
  className: 'f-sys',
  vpack: 'fill',
  hpack: 'fill',
  homogeneous: true,
  children: [
    Widget.Label({
      label: 'fd'
    })
  ]
})



const row_1 = Widget.Box({
  className: 'f-row1',
  spacing: 10,
  vpack: 'fill',
  hpack: 'fill',
  // homogeneous: true,
  children: [
    clock(),
    // sys_info
  ]
})


const leftWideges = () => {
  const mainWrap = Widget.Box({
    className: 'f-desk-left',
    vertical: true,
    spacing: 20,
    children: [
      row_1,
    ]
  })
  return mainWrap
}

export default leftWideges
