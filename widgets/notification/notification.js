import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { lookUpIcon, timeout } from 'resource:///com/github/Aylur/ags/utils.js';
const { GLib, Gdk, Gtk } = imports.gi;
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import App from 'resource:///com/github/Aylur/ags/app.js';
import {find_icon} from '../../lib/iconUtils.js'

//根据summasy,优化一波
const iconMapBySummry= (summary)=>{
    if(summary.indexOf('微信') > -1){
        return 'wechat'
    }

    if(summary.indexOf('QQ') > -1){
        return 'qq'
    }

    return ''
}

const optimizeNotifyBody=(body,summary)=>{
    if(summary.indexOf('微信') > -1){
        return '您收到一条新消息!'
    }

    return body
}

const NotificationIcon = (notifObject) => {
    // { appEntry, appIcon, image }, urgency = 'normal'
    if (notifObject.image) {
        return Widget.Box({
            vpack: 'center',
            hexpand: false,
            className: 'notif-icon',
            css: `
                background-image: url("${notifObject.image}");
                background-size: auto 100%;
                background-repeat: no-repeat;
                background-position: center;
            `,
        });
    }
    
    let icon = `${App.configDir}/assets/message.png`;
    const summaryIcon = iconMapBySummry(notifObject.summary)
    if(find_icon(summaryIcon)){
        icon =find_icon(summaryIcon)
    }else if(find_icon(notifObject.appIcon)){
        icon =find_icon(notifObject.appIcon)
    }else if (find_icon(notifObject.appEntry)){
        icon =find_icon(notifObject.appEntry)
    }else if (lookUpIcon(notifObject.appIcon)){
        icon = notifObject.appIcon;
    }else if (lookUpIcon(notifObject.appEntry)){
        icon = notifObject.appEntry;
    }

    return Widget.Box({
        vpack: 'center',
        hexpand: false,
        className: 'notif-icon',
        setup: box => {
                box.pack_start(
                        Widget.Icon({
                        icon: icon,
                        hpack: 'center', 
                        hexpand: true,
                        vpack: 'center',
                        setup: (self) => {
                            box.toggleClassName(`notif-icon-material-${notifObject.urgency}`, true);
                            Utils.timeout(1, () => {
                                const styleContext = self.get_parent().get_style_context();
                                const width = styleContext.get_property('min-width', Gtk.StateFlags.NORMAL);
                                const height = styleContext.get_property('min-height', Gtk.StateFlags.NORMAL);
                                self.size = Math.max(width, height, 1);
                            })
                        },
                }), false, true, 0);
       
        }
    });
};

const NotificationContent  = (notifObject)=>{
    return  Widget.Box({
        vpack: 'center',
        vertical: true,
        hexpand: true,
        children: [
            Widget.Box({
                children: [
                    Widget.Label({
                        xalign: 0,
                        className: 'txt-small txt-semibold titlefont',
                        justify: Gtk.Justification.LEFT,
                        hexpand: true,
                        maxWidthChars: 18,
                        ellipsize: 3,
                        wrap: true,
                        useMarkup: notifObject.summary.startsWith('<'),
                        label: notifObject.summary,
                    }),
                ]
            }),
            Widget.Label({
                xalign: 0,
                className: 'txt-smallie',
                useMarkup: true,
                xalign: 0,
                justify: Gtk.Justification.LEFT,
                maxWidthChars: 18,
                ellipsize: 3,
                wrap: true,
                wrap: true,
                label: optimizeNotifyBody(notifObject.body,notifObject.summary),
            }),
        ]
    })
}

const notificationContentEnd=(notifObject)=>{
    return  Widget.Box({
        className: 'u-notcie-end',
        children: [
            Widget.Label({
                vpack: 'center',
                className: 'txt-smaller txt-semibold',
                justify: Gtk.Justification.RIGHT,
                setup: (label) => {
                    const messageTime = GLib.DateTime.new_from_unix_local(notifObject.time);
                    if (messageTime.get_day_of_year() == GLib.DateTime.new_now_local().get_day_of_year()) {
                        label.label = messageTime.format('%H:%M');
                    }
                    else if (messageTime.get_day_of_year() == GLib.DateTime.new_now_local().get_day_of_year() - 1) {
                        label.label = messageTime.format('%H:%M\nYesterday');
                    }
                    else {
                        label.label = messageTime.format('%H:%M\n%d/%m');
                    }
                }
            }),
            // Widget.Button({
            //     className: 'notif-close-btn',
            //     onClicked: () => {
            //         destroyWithAnims()
            //     },
            //     child: MaterialIcon('close', 'large', {
            //         vpack: 'center',
            //     }),
            //     setup: (button) => setupCursorHover(button),
            // }),
        ]
    })
}

export const NotificationWidget = (params)=>{

    const {notifObject,isPopup} = params

    const widget = Widget.Revealer({
        transition: 'slide_left',
        transitionDuration: 500,
        className:'f-notification-popup-box-revealer',
        child: Widget.Box({
            className:`f-notification-popup-box`,
            children:[
                NotificationIcon(notifObject),
                NotificationContent(notifObject),
                notificationContentEnd(notifObject)
            ]

        })
    })
    return widget
}
