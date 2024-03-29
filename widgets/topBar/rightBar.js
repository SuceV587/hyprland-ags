
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { Tray } from "./systray.js";
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'

//检测wifi信号强度等
const wifi_widget = Widget.Label({
  className: 'font',
  css: 'margin-right:1rem',
  attribute: {
    'update': (box) => {
      const network = Network.wifi
      box.label = '  ' + network.strength + '%'
    }
  },
}).poll(10000, self => {
  self.attribute.update(self)
})


const volumn_widget = Widget.Label({
  className: 'font',
  css: 'margin-right:1rem',
  attribute: {
    'update': (box) => {
      const audio = Audio.microphone
      if (!audio) {
        return
      }
      box.label = '  ' + Math.round(audio.volume * 100) + '%'
    }
  },
  setup: (self) => {
    Utils.timeout(1000, () => {
      self.attribute.update(self)
    });
  }
}).poll(10000, self => {
  self.attribute.update(self)
})


const battery_widget = Widget.Label({
  className: 'font',
  css: 'margin-right:1rem',
  attribute: {
    'update': (box) => {
      const battery = Battery.percent
      if (!battery) {
        return
      }
      let icon = ' '
      if (battery > 90) {

        icon = ' '
      } else if (battery > 75) {
        icon = ' '
      } else if (battery > 50) {
        icon = ' '
      } else if (battery > 25) {
        icon = ' '
      }
      box.label = icon + ' ' + battery + '%'
    }
  },
  setup: (self) => {
    Utils.timeout(1000, () => {
      self.attribute.update(self)
    });
  }
}).poll(10000, self => {
  self.attribute.update(self)
})

// 󰔄
const temp = Widget.Label({
  className: 'font',
  css: 'margin-right:1rem',
  attribute: {
    'update': (box) => {
      // execAsync([`bash`, `-c`, `hyprctl version | grep -oP "Tag: v\\K\\d+\\.\\d+\\.\\d+"`]).then(distro => {
      execAsync([`bash`, `-c`, `sensors | grep 'Tctl' | awk '{print $2}'`]).then(tmpStr => {
        const temp = tmpStr.replace('+', '')
        box.label = '  ' + temp
      })
    }
  },
}).poll(5000, self => {
  self.attribute.update(self)
})



//  
export const rightBar = () => {
  const right = Widget.Box({
    className: 'u-right-bar',
    // homogeneous: false,
    hpack: 'end',
    vpack: 'fill',
    vertical: false,
    children: [
      wifi_widget,
      volumn_widget,
      battery_widget,
      temp,
      Tray()
    ],
  })

  return right
}



