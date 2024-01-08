import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import env from '../../env.js'
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
const { Gdk, Gtk } = imports.gi;
import { exec } from 'resource:///com/github/Aylur/ags/utils.js'
import App from 'resource:///com/github/Aylur/ags/app.js';


const initData = () => {
  const url = 'https://devapi.qweather.com/v7/weather/7d?location=' + env.weatherLoaction + '&key=' + env.weatherKey
  const ret = exec(`curl  -L -X GET --compressed ${url}`)
  try {
    const wetaherArr = JSON.parse(ret)
    if(wetaherArr.code != 200){
     throw new Error('') 
    }

    return wetaherArr
  } catch (error) {
    return {code:"200",daily:[{tempMax:20,tempMin:10,iconDay:100,textDay:"晴"}]}
  }
}

export const weather = (avg_row_px) => {

  const widgetPaddingRightAndLeft = 30
  const widgetPaddingTopAndRight = 20
  const widgetWidth = avg_row_px * 4 - widgetPaddingRightAndLeft*2
  const widgetHeight = avg_row_px - widgetPaddingTopAndRight*2

  const data = initData()

  const topPart=()=>{
    const topPartLeft=Widget.Box({
      css:`color:#fff;min-width:${widgetWidth / 2}px;`,
      homogeneous: true,
      vertical: true,
      children:[
        Widget.Label({
          hpack:'start',
          css:`font-weight:600`,
            label:' 长沙天心'
        }),

        Widget.Label({
          hpack:'start',
          css:'font-size:1.8rem;font-weight:800',
          setup:(self)=>{
              const today = data.daily[0] || {}
              if(today.tempMax && today.tempMin){
                self.label = today.tempMin + ' ~ ' + today.tempMax + '°'
              }
          }
        })
      ]
    })

    const topPartRight = Widget.Box({
      css:`color:#fff;min-width:${widgetWidth / 2}px;`,
      vpack:'center',
      homogeneous:true,
      children:[
        Widget.Box({
          hpack:'end',
          children:[
            Widget.Label({
              hpack:'end',
              css:`font-weight:600;min-width:50px;padding-right:1rem;font-size:1.5rem`,
              setup:(self)=>{
                  const today = data.daily[0] || {}
                  self.label = today.textDay
              }
            }),
            Widget.Icon({
                hpack:'end',
                setup: (self) => Utils.timeout(10, () => {
                  if (self._destroyed) {
                    return
                  }
                  const iconWidth = (avg_row_px) * 1 / 5
                  self.size = Math.max(iconWidth, iconWidth, 1);

                  const today = data.daily[0] || {}

                  let icon = `${App.configDir}/assets/weather/icons/${today.iconDay}.svg`;
                  self.icon = icon
                }),
              })
          ]
        })
      ],

    })

   const widgets= Widget.Box({
        vertical: false,
        css:`min-height:${widgetHeight * 1/3 - 10}px;padding-bottom:10px`,
        children:[
          topPartLeft,
          topPartRight,
        ]
      })

    return widgets
  }


  const nextSixDayWeahter = (params)=>{
    const single=Widget.Box({
      css:`color:#fff;min-width:${widgetWidth/7}px;font-size:0.8rem`,
      vpack:'fill',
      homogeneous: true,
      vertical: true,
      children:[
        Widget.Label({
          css:`padding-bottom:5px;font-weight:500`,
          label:params.fxDate
        }),

        Widget.Label({
          css:'padding-bottom:10px',
          label:params.textDay +' ' +params.tempMin +'~' + params.tempMax +'° '
        }),
       Widget.Icon({
          setup: (self) => Utils.timeout(10, () => {
            if (self._destroyed) {
              return
            }
            const iconWidth = (avg_row_px) * 1 / 8
            self.size = Math.max(iconWidth, iconWidth, 1);
            let icon = `${App.configDir}/assets/weather/icons/${params.iconDay}.svg`;
            self.icon = icon
          })
        })
            
      ]
    })

    return single
  }

  const bottomPart = ()=>{
    const widgets=Widget.Box({
      css:`color:#fff;`,
      vpack:'fill',
      setup:(self)=>{
        const days= data.daily
        const childrens= []
        days.map(item=>{
          const single = nextSixDayWeahter(item)
          childrens.push(single)
        })

        self.children = childrens
      }
    })


    return widgets
  }

  const mainWidget = Widget.Box({
    css: `min-height:${widgetHeight}px;padding-right:${widgetPaddingRightAndLeft}px;padding-left:${widgetPaddingRightAndLeft}px;background-color:rgba(21,66,128,0.6);border-radius:1.5rem;padding-top:${widgetPaddingTopAndRight}px;padding-bottom:${widgetPaddingTopAndRight}px`,
    vertical: true,
    vpack:'fill',
    hpack:'fill',
    children:[
      topPart(),
      bottomPart()
    ]
  })


  return mainWidget
}
