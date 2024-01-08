
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

import { weather } from './weather.js';
import systemInfoWidget from './systemInfo.js';
import wellKnow from './wellKnow.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'

const leftWideges = ( desk_widget_spacing) => {
  const row_1 = Widget.Box({
    spacing: desk_widget_spacing,
    homogeneous:true,
    vpack: 'fill',
    hpack: 'fill',
    setup:(self)=>{
      Utils.timeout(500,()=>{
       const width = self.get_allocated_width();
       const avagRow=  (width - desk_widget_spacing) / 4 
       self.children =[
          weather(avagRow)
       ]
      })
    },
  })

 const row_2 = Widget.Box({
    spacing: desk_widget_spacing,
    vpack: 'fill',
    hpack: 'fill',
    setup:(self)=>{
      Utils.timeout(500,()=>{
       const width = self.get_allocated_width();
       const avagRow= Math.floor( (width - desk_widget_spacing) / 4) 
       self.children =[
          wellKnow(avagRow),
          systemInfoWidget(avagRow)
       ]
      })
    },
  })
  

  const mainWrap = Widget.Box({
    spacing:desk_widget_spacing,
    vpack: 'fill',
    vertical: true,
    homogeneous:true,
    children: [
      row_1,
      row_2
    ],
  })
  return mainWrap
}

export default leftWideges
