import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { find_icon } from "./iconUtils.js";
import { lookUpIcon, timeout } from 'resource:///com/github/Aylur/ags/utils.js';

export const getClientByAdrees=function(address){

    const clients= Hyprland.clients 

    const client =  clients.find(item=>{
        return item.address === address
    })

    return client
}

//获取一个设置了fullscreen的client
export const getFullScreenClientAddress=function(workspace_id){

    const clients= Hyprland.clients 
    const client =  clients.find(item=>{
        return item.fullscreen && item.workspace.id === workspace_id
    })
    return client
}

export const ignoreAppsClass = [
  'image-missing',
  'fcitx',
  'rofi'
]

export const getClientIcon = (clientClass)=>{
  //去自定的awesome等主题图标下寻找
  const awesome_icon=find_icon(clientClass)
  if(awesome_icon){
    return awesome_icon
  }

  //去系统图标下寻找
  if (lookUpIcon(clientClass)){
    return clientClass
  }

  //实在找不到,返回一个系统图表
  if (find_icon('system')) {
    return find_icon('system')
  }

  return ""
}
