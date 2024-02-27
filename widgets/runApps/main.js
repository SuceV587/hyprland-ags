import Widget from "resource:///com/github/Aylur/ags/widget.js";
import monitor from "../../lib/monitors.js"
import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { substitute } from "../../lib/client.js";
import { getClientIcon, ignoreAppsClass, focus } from "../../lib/client.js";
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import { setupCursorHover, setupCursorHoverAim } from "../../lib/cursorhover.js";
const { Gdk, Gtk } = imports.gi;
import runAppsVariable, { findApps, showMaxNums, initRunApps, scrollApps } from '../../variables/runApps.js'

const width = monitor.mainMonitorWidth / 4
const widgetHeight = monitor.mainMonitorHeight / 2
const entryHeight = 60


const clickEventWrap = (childWidget) => {
  const widget = Widget.EventBox({
    onPrimaryClick: () => { //make the widget hide when hovering
      // console.log(childWidget)
    },
    child: childWidget,
    setup: self => {
      setupCursorHover(self)
    }
  })

  return widget
}

// const appsItem = (appClass, title, isHover) => {
const appsItem = (index) => {
  //每列放10个
  const rowNums = 10

  const iconWidget = Widget.Icon({
    // icon: getClientIcon(appClass, title),
    setup: self => {
      Utils.timeout(10, () => {
        self.size = widgetHeight / rowNums
      })
    }
  })

  const lableWidget = Widget.Label({
    maxWidthChars: 55,
    ellipsize: 3,
    wrap: true,
    css: 'color:#fff;font-weight:500;font-size:0.9rem',
    label: "fk"
  })

  let backGroundColor = "transparent"

  const widget = Widget.Box({
    vpack: "fill",
    hpack: "center",
    // background-color:rgba(252,252,252,0.3);
    css: `min-height:3rem;min-width:${width}px;border-radius:1rem;background-color:${backGroundColor}`,
    children: [
      iconWidget,
      lableWidget
    ]
  })



  widget.hook(runAppsVariable, self => {
    const apps = runAppsVariable.value.apps
    const hover = runAppsVariable.value.hover
    if (apps[index]) {
      self.visible = true
      let css = `min-height:3rem;min-width:${width}px;border-radius:1rem;background-color:transparent;`
      if (hover == index) {
        css = `min-height:3rem;min-width:${width}px;border-radius:1rem;background-color:rgba(252,252,252,0.3)`
      }
      widget.setCss(css)

      const clientInfo = apps[index]
      lableWidget.label = clientInfo.title

      let appClass = substitute(clientInfo.class).toLowerCase();
      iconWidget.icon = getClientIcon(appClass, clientInfo.title)

    } else {
      self.visible = false
    }
  }, 'changed')


  return widget
}


const appsContent = Widget.Box({
  vertical: true,
  css: `min-height:${widgetHeight - entryHeight}px;`,
  setup: (self) => {
    const deviceList = []
    for (let index = 0; index < showMaxNums; index++) {
      deviceList.push(clickEventWrap(appsItem(index)))
    }
    self.children = deviceList
  }
})

const focusClient = () => {

  const clients = runAppsVariable.value.apps
  const hover = runAppsVariable.value.hover

  if (clients[hover]) {
    focus(clients[hover])
    App.toggleWindow("runApps");
  }

}


const inputEntry = Widget.Entry({
  className: "appsEntry",
  css: `min-height:${entryHeight}px;margin-bottom:30px;min-width:${width * 0.7}px;border:0;background-color:rgba(252,252,252,0.5);color:#fff;border-radius:0.5rem`,
  onAccept: () => {
    focusClient()
  },
  onChange: ({ text }) => { // this is when you type
    findApps(text)
  },
  //toggle-window的时候的visble会变化
  setup: (self) => self.hook(App, (self, currentName, visible) => {
    if (currentName === 'runApps') {
      self.text = ""
      initRunApps()
      self.grab_focus();
    }
  })
})



const appEntry = Widget.Box({
  hpack: "center",
  child: inputEntry
})

//--------------------------------
const appsConetWrap = Widget.Scrollable({
  hscroll: 'never',
  vscroll: 'external',
  css: `min-height: ${widgetHeight - entryHeight - 30}px;min-width:${width}px`,
  child: appsContent
})

//--------------------------------
const apps = Widget.Box({
  vertical: true,
  css: `min-height:${widgetHeight}px`,
  children: [
    appEntry,
    appsConetWrap,
  ],
  setup: (self) => {
    self.on('key-press-event', (widget, event) => { // Typing
      const keyval = event.get_keyval()[1];
      // console.log(keyval)
      //往下翻
      if (keyval == 106 || keyval == 110 || keyval == 65364) {
        scrollApps("down")
      }

      //往上翻
      if (keyval == 107 || keyval == 112 || keyval == 65362) {
        scrollApps("up")
      }

      //按enter
      if (keyval == 65293) {
        focusClient()
      }
    })
  }
})

const mainBox = () => {
  const mainBoxWidget = Widget.Box({
    css: `min-width:${width}px;min-height:${widgetHeight}px;background-color:rgba(0,0,0,0.8);border-radius:1.5rem;padding:1rem`,
    children: [
      apps
    ],
  })

  return mainBoxWidget
}

export default mainBox
