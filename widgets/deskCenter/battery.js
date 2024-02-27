const { Gdk, Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { find_icon } from '../../lib/iconUtils.js'

import blueDeviceVariable from '../../variables/blueDevice.js'


export const battery = (avg_row_px) => {

  const singleBatterWidget = (percent, icon_name,index) => {

    const battery = (batteryWidth) => {

      if (batteryWidth < 60) {
        batteryWidth = avg_row_px * 3 / 4
      }

      const deviceIcon = Widget.Icon({
          icon: find_icon(icon_name),
          setup: (self) => Utils.timeout(10, () => {
            if (self._destroyed) {
              return
            }
            const iconWidth = (avg_row_px) * 1 / 6
            self.size = Math.max(iconWidth, iconWidth, 1);
          }),
      })

      deviceIcon.hook(blueDeviceVariable,self=>{
        const blueDevceList=blueDeviceVariable.value
        if(blueDevceList[index]){
          const icon_name = blueDevceList[index]['type']??""
          if(icon_name){
            self.icon = find_icon(icon_name)
          }
        }
      },'changed')


      const circular = Widget.CircularProgress({
        className: 'u-battery',
        css:
          `min-width:${batteryWidth - 60}px;` +
          `min-height:${batteryWidth - 60}px;` +
          'font-size: 22px;' +
          'background-color: #f0f0f0;' +
          'color: #00C957;',
        child:deviceIcon,
        value: percent / 100,
        rounded: false,
        inverted: false,
        startAt: 0.75,
      });


      circular.hook(blueDeviceVariable,self=>{
        const blueDevceList=blueDeviceVariable.value
        if(blueDevceList[index]){
          const percent = blueDevceList[index]['battery']??0
          self.value = percent > 0 ? percent /100 : 0
          self.rounded = percent <= 0 ? false : true
        }
      },'changed')


      return Widget.Box({
        css: `min-height:${batteryWidth}px;`,
        hpack: 'center',
        vpack: 'center',
        children: [circular]
      })
    }

    const batteryLabel = Widget.Label({
      css: 'font-size:1rem;font-weight:700;color:#555',
      label: percent > 0 ? percent + '%' : ''
    })
    
    batteryLabel.hook(blueDeviceVariable,self=>{
      const blueDevceList=blueDeviceVariable.value
      if(blueDevceList[index]){
        const percent = blueDevceList[index]['battery']??0
        self.label = percent > 0 ? percent + '%' : ''
      }

    },'changed')

    const batter_wrap = Widget.Box({
      vertical: true,
      hpack: 'fill',
      vpack: 'fill',
      setup: self => {
        Utils.timeout(100, () => {
          let batteryWidth = self.get_allocated_width();
          // const batterHeight = self.get_allocated_height()
          if (batteryWidth <= 0) {
            return
          }
          batteryWidth = Math.floor(batteryWidth)

          if (typeof batteryWidth !== "number") {
            return
          }

          self.children = [battery(batteryWidth), batteryLabel]
        })
      }
    })
    return batter_wrap
  }


  const batterWidget = Widget.Box({
    className: 'f-battery',
    css: `min-width:${avg_row_px * 3}px;background-color: rgba(232,232,232,0.8);border-radius: 1.5rem;`,
    homogeneous: true,
    attribute: {
      deviceList: [],
      update: (self) => {
      }
    },

    setup: (self) => {
      Utils.timeout(1000, () => {
        const deviceListNums = 4
        const deviceList = self.attribute.deviceList
        if (deviceList.length == 0) {
          for (let index = 0; index < deviceListNums; index++) {
            deviceList.push(singleBatterWidget(0, null,index))
          }
          self.children = deviceList
        }
      });
    }
  })

  // //10s更新一下电池电量
  // connections: [[60000, self => {
  //   self.attribute.update(self)
  // }]],
  //


  return batterWidget
}
