import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { find_icon } from "./iconUtils";
import { lookUpIcon, timeout } from 'resource:///com/github/Aylur/ags/utils.js';


export let clientMapWorkSpace = {};

export function substitute(str) {
  const subs = [
    { from: "code-url-handler", to: "visual-studio-code" },
    { from: "Code", to: "visual-studio-code" },
    { from: "GitHub Desktop", to: "github-desktop" },
    { from: "wpsoffice", to: "wps-office2019-kprometheus" },
    { from: "gnome-tweaks", to: "org.gnome.tweaks" },
    { from: "Minecraft* 1.20.1", to: "minecraft" },
    { from: "", to: "image-missing" },
  ];

  for (const { from, to } of subs) {
    if (from === str) {
      return to;
    }
  }

  return str;
}

function titleToClient(title, className) {
  const subs = [
    { from: "musicfox", to: "musicfox" },
    { from: "open.spotify.com", to: "spotify" }
  ];

  for (const { from, to } of subs) {
    if (title.indexOf(from) !== -1) {
      return to;
    }
  }

  return className
}

export const getClientByAdrees = function(address) {

  const clients = Hyprland.clients

  const client = clients.find(item => {
    return item.address === address
  })

  return client
}

//获取一个设置了fullscreen的client
export const getFullScreenClientAddress = function(workspace_id) {

  const clients = Hyprland.clients
  const client = clients.find(item => {
    return item.fullscreen && item.workspace.id === workspace_id
  })
  return client
}

export const ignoreAppsClass = [
  'image-missing',
  'fcitx',
  'rofi'
]

export const getClientIcon = (clientClass, title = "", type = false, ignoreSpecityClass = false) => {
  //忽略某些class
  if (ignoreSpecityClass || clientClass.length <= 0) {
    if (ignoreAppsClass.indexOf(clientClass) !== -1) {
      return "";
    }
  }

  //通过title模糊匹配
  if (title.length > 0) {
    clientClass = titleToClient(title, clientClass)
  }


  const diyIconClass = clientClass.toLowerCase().replace(" ", "_");
  //去自定的awesome等主题图标下寻找
  const awesome_icon = find_icon(diyIconClass)
  if (awesome_icon) {
    if (type) {
      return { icon: awesome_icon, isAwesome: true }
    } else {
      return awesome_icon
    }
  }

  //去系统图标下寻找
  if (lookUpIcon(clientClass)) {
    if (type) {
      return { icon: clientClass, isAwesome: false }
    } else {
      return clientClass
    }
  }

  //实在找不到,返回一个系统图表
  if (find_icon('system')) {
    const awesome_icon = find_icon('system')
    if (type) {
      return { icon: awesome_icon, isAwesome: true }
    } else {
      return awesome_icon
    }
  }

  return ""
}


export const sortClientItems = function(arr) {
  return arr.sort(({ attribute: a }, { attribute: b }) => {
    const aclient = Hyprland.getClient(a.address)!
    const bclient = Hyprland.getClient(b.address)!
    let aWroskpaceId = aclient ? (aclient.workspace.id == -99 ? 99 : aclient.workspace.id) : 99
    let bWroskpaceId = bclient ? (bclient.workspace.id == -99 ? 99 : bclient.workspace.id) : 99
    return aWroskpaceId - bWroskpaceId
  })
}


export const focus = (client) => {
  //这里的client的状态并不是最新的
  const { address } = client;
  const liveClient = getClientByAdrees(address);
  if (!liveClient) {
    return
  }

  //如果当前在special的window里面,则移出来
  if (liveClient.workspace.id < 0) {
    const oldWorkSpace = clientMapWorkSpace[address];
    if (oldWorkSpace) {
      Utils.exec(
        `hyprctl dispatch movetoworkspace ${oldWorkSpace},address:${address}`,
      );
      Utils.exec(`hyprctl dispatch workspace ${oldWorkSpace}`);
    }
  }

  //如果当前已经是fullscreen的,不发生变化
  if (liveClient.fullscreen) {
    Utils.exec("hyprctl dispatch focuswindow address:" + address);
    return;
  }

  //获取当前workspace里面是否有设置fullscreen的client
  const currentFullScreenAddress = getFullScreenClientAddress(
    liveClient.workspace.id,
  );
  if (currentFullScreenAddress) {
    const fullScreenAdress = currentFullScreenAddress.address;
    Utils.exec("hyprctl dispatch focuswindow address:" + fullScreenAdress);
    Utils.exec("hyprctl dispatch fullscreen 1");
  }

  Utils.exec("hyprctl dispatch focuswindow address:" + address);
  // Utils.exec('hyprctl dispatch cyclenext')
  Utils.exec("hyprctl dispatch alterzorder top,address:" + address);
  if (currentFullScreenAddress) {
    Utils.exec("hyprctl dispatch fullscreen 1");
  }
};
