import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { rightBar } from './rightBar.js'
import { centerBar  } from "./centerBar.js";


import { find_icon } from "../../lib/iconUtils.js";

const workspaceSort = [" 1Dock", " 2Code", " 3Chat", " 4Vmware", " 5Other1", " 6Other2", "7 󰨇 monitor0"]


const topBar = function(monitor = 1) {
  const left = Widget.Box({
    className: 'u-left-bar',
    children: [
      Widget.Label({
        label: ' ',
        connections: [[5000, label => {
          execAsync([`date`, "+%H:%M  %m月%d日 周%a"]).then(timeString => {
            label.label = timeString;
          }).catch(print);
        }]],
      }),

      Widget.Label({
        className: 'font',
        label: ' ',
        connections: [
          [Hyprland.active.workspace, self => {
            const id = Hyprland.active.workspace.id
            const workspaceName = workspaceSort[id - 1]
            self.label = "  " + workspaceName
          }],
        ],
      })
    ]
  })
  const mainBox = Widget.CenterBox({
    className: 'f-bar',
    spacing: 1,
    vertical: false,
    startWidget: left,
    centerWidget: centerBar(),
    endWidget: rightBar(),
  })


  const win = Widget.Window({
    monitor,
    name: `bar${monitor}`,
    anchor: ['top', 'left', 'right'],
    child: mainBox,
    margins:[5,0,2,0],
    exclusivity: "exclusive",
    layer: 'top'
  })
  return win
}


export default topBar

