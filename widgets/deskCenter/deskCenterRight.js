
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { clock } from './clock.js';
import { battery } from './battery.js'

const rightWidgets = ( desk_widget_spacing) => {
  const row_1 = Widget.Box({
    spacing: desk_widget_spacing,
    vpack: 'fill',
    hpack: 'fill',
    setup:(self)=>{
      Utils.timeout(500,()=>{
       const width = self.get_allocated_width();
       const avagRow= Math.floor( (width - desk_widget_spacing) / 4) 
       self.children =[
         clock(avagRow),
         battery(avagRow)
       ]
      })
    },
  })

  const row_2 =Widget.Box({
    spacing: desk_widget_spacing,
    vpack: 'fill',
    hpack: 'fill',
  })

  const mainWrap = Widget.Box({
    vpack: 'fill',
    vertical: true,
    // homogeneous:true,
    children: [
      row_1,
      // row_2
    ],
  })
  return mainWrap
}

export default rightWidgets
