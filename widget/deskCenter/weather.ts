import Gtk from "gi://Gtk?version=3.0"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec } from 'resource:///com/github/Aylur/ags/utils.js'

const env = {
  weatherLoaction: '101250111',
  weatherLocationName: ' 长沙天心',
  weatherKey: "5ca9c851a9d44819961749d9909e4f3d",
}

class Weather {

  mainWidget!: Gtk.Widget
  data: any
  resetWidth: boolean

  constructor() {
    this.resetWidth = false
    this.data = this.initData()
    this.mainWidget = this.init()
  }

  init() {
    return Widget.Box({
      className: "f-weater",
      css: "min-width:1px;min-height:1px",
      vertical: true,
    }).on("size-allocate", (self, allocation) => {
      const width = allocation.width || 200
      if (width < 100 || this.resetWidth) {
        return
      }
      this.resetWidth = true
      const height = (width - 20) /  3
      self.setCss(`min-width:${width}px;min-height:${height}px;`)

      //init child
      self.children = [
        this.topPart(width, height),
        this.bottomPart()
      ]
    })

  }

  topPart(width, height) {
    const widgets = Widget.Box({
      css: `min-height:${height * 1 / 3 - 10}px;padding:1rem`,
      homogeneous: true,
      children: [
        this.topPartLeft(width),
        this.topPartRight(width),
      ]
    })

    return widgets
  }

  topPartLeft(width) {
    const topPartLeft = Widget.Box({
      homogeneous: true,
      vertical: true,
      children: [
        Widget.Label({
          // vexpand:true,
          // hexpand:true,
          hpack: "start",
          css: `font-weight:600`,
          label: ' 长沙天心'
        }),

        Widget.Label({
          hpack: 'start',
          css: 'font-size:1.5rem;font-weight:800;',
          setup: self => {
            Utils.idle(() => {
              const today = this.data.daily[0] || {}
              if (today.tempMax && today.tempMin) {
                self.label = today.tempMin + ' ~ ' + today.tempMax + '°'
              }
            })
          }
        })
      ]
    })

    return topPartLeft
  }

  topPartRight(width) {
    const topPartRight = Widget.Box({
      vpack: 'center',
      homogeneous: true,
      children: [
        Widget.Box({
          hpack: 'end',
          children: [
            Widget.Label({
              hpack: 'end',
              css: `font-weight:700;min-width:50px;font-size:1.3rem`,
              setup: (self) => {
                Utils.idle(() => {
                  self.label = this.data.daily[0]?.textDay || ""
                })
              }
            }),
            Widget.Icon({
              hpack: 'end',
              size: 36,
              setup: (self) => Utils.idle(() => {
                const today = this.data.daily[0] || {}
                let icon = `${App.configDir}/assets/weather/icons/${today.iconDay}.svg`;
                self.icon = icon
              }),
            })
          ]
        })
      ],

    })

    return topPartRight
  }

  bottomPart() {
    // const widgets = Widget.FlowBox({
    //   vpack: 'fill',
    //   min_children_per_line: 7,
    //   max_children_per_line: 7,
    //   setup: (self) => {
    //     Utils.idle(() => {
    //       this.data.daily.map(item => {
    //         self.add(this.nextSixDayWeahter(item))
    //       })
    //     })
    //   }
    // })
    const widgets = Widget.Box({
      css: `color:#fff;`,
      vpack: 'fill',
      homogeneous: true,
      setup: (self) => {
        Utils.idle(() => {
          const childrens: Gtk.Widget[] = []
          this.data.daily.map(item => {
            childrens.push(this.nextSixDayWeahter(item))
          })
          self.children = childrens
        })
      }
    })

    return widgets
  }

  nextSixDayWeahter(item) {
    const single = Widget.Box({
      css: `font-size:0.8rem`,
      vpack: 'fill',
      homogeneous: true,
      vertical: true,
      children: [
        Widget.Label({
          css: `padding-bottom:5px;font-weight:500`,
          label: item.fxDate
        }),

        Widget.Label({
          css: 'padding-bottom:10px',
          label: item.textDay + ' ' + item.tempMin + '~' + item.tempMax + '° '
        }),
        Widget.Icon({
          setup: (self) => Utils.idle(() => {
            self.size = 24
            let icon = `${App.configDir}/assets/weather/icons/${item.iconDay}.svg`;
            self.icon = icon
          })
        })
      ]
    })

    return single

  }



  initData() {
    try {
      const url = 'https://devapi.qweather.com/v7/weather/7d?location=' + env.weatherLoaction + '&key=' + env.weatherKey
      const ret = exec(`curl  -L -X GET --compressed ${url}`)
      const wetaherArr = JSON.parse(ret)
      if (wetaherArr.code != 200) {
        throw new Error('')
      }
      return wetaherArr
    } catch (error) {
      return { code: "200", daily: [{ tempMax: 20, tempMin: 10, iconDay: 100, textDay: "晴" }] }
    }
  }
}


export default Weather
