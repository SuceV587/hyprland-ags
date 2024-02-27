
//每半分钟更新连接的蓝牙设备电量+本机电量
import Variable from "resource:///com/github/Aylur/ags/variable.js";

import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';

const firstTime = false

const blueDeviceVariable = Variable([], {
  // listen is what will be passed to Utils.subprocess, so either a string or string[]
  // listen: ['bash', '-c', "LANG=c free -m | grep 'Mem:' | awk '{printf \"%d@@%d@\", $7, $2}'"],
  poll: [30000, () => {
    //delay for the first poll
    const blueDevice = Bluetooth['connected-devices']
    const blueDeviceBattery = [
      { battery: Battery.percent, type: 'charg-computer' }
    ]
    blueDevice.map(item => {
      const deivce = {
        battery: item._device['battery_percentage']|| 0,
        type: item._device['icon']
      }
      blueDeviceBattery.push(deivce)
    })

    return blueDeviceBattery 
  }],
});


export default blueDeviceVariable;
