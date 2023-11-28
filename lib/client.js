import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

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