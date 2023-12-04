import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { dateWidget } from './date.js'
import { calendar } from './calendar.js'

import { clock } from './clock.js';
import { battery } from './battery.js'
import monitors from '../../lib/monitors.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { find_icon } from '../../lib/iconUtils.js'




const centerWidgets = (avg_row_px, desk_widget_spacing) => {

  //第一列
  const row_1 = Widget.Box({
    className: 'f-row1',
    spacing: desk_widget_spacing,
    vpack: 'fill',
    hpack: 'fill',
    // homogeneous: true,
    children: [
      dateWidget(avg_row_px),
      calendar(avg_row_px)
    ]
  })

  const mainWrap = Widget.Box({
    className: 'f-desk-center',
    css: `min-width:${avg_row_px * 8}px`,
    vpack: 'fill',
    hpack: 'fill',
    vertical: true,
    spacing: 20,
    children: [
      row_1,
    ],
  })
  return mainWrap
}

export default centerWidgets
