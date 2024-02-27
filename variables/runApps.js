
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";

export const showMaxNums = 9
let runAppsCache = []
let hover = 0
let trueHover = 0

const runAppsVariable = Variable({ apps: [], hover: 0 }, {});

//初始化runApps
export const initRunApps = () => {
  hover = 0
  trueHover = 0

  const clients = Hyprland.clients

  // if (runAppsCache.length == 0) {
  runAppsCache = []
  clients.map(client => {
    if (client["pid"] == -1) return;
    runAppsCache.push(client)
  })
  // }

  //只取前showMaxNums个
  const result = runAppsCache.slice(0, showMaxNums);
  runAppsVariable.setValue({ apps: result, hover: 0 })
}



export function substitute(str) {
  const subs = [
    { from: "dd", to: "dingtalk" },
    { from: "wx", to: "weixin" },
  ];

  for (const { from, to } of subs) {
    if (from === str) {
      return to;
    }
  }

  return str;
}


export const findApps = (keyword) => {
  hover = 0
  trueHover = 0

  let newRunAppsCache = runAppsCache

  if (keyword != "") {
    keyword = substitute(keyword)
    //搜索包含指定关键词的
      newRunAppsCache = runAppsCache.filter((item) => {
      const classLower= item.class.toLowerCase()
      return classLower.indexOf(keyword) != -1;
    })
  }


  const result = newRunAppsCache.slice(0, showMaxNums);
  runAppsVariable.setValue({ apps: result, hover: hover })
}

export const scrollApps = (type = "up") => {
  const oldVar = runAppsVariable.value

  let newHover = 0
  let newApps = oldVar.apps
  if (type == "down") {

    //跳转到第一页第一个
    if (trueHover == runAppsCache.length - 1) {
      newApps = runAppsCache.slice(0, showMaxNums)
      newHover = 0
      trueHover = 0
    } else {
      if (oldVar.hover < showMaxNums - 1) {
        newHover = oldVar.hover + 1
      } else {
        newHover = 0
        newApps = nextPage()
      }
      trueHover++
    }
  } else {
    if (oldVar.hover == 0) {
      //翻到最后一页的最后一项
      if (trueHover == 0) {
        const remainder = (runAppsCache.length % showMaxNums) ? (runAppsCache.length % showMaxNums) : showMaxNums
        newHover = remainder - 1
        newApps = runAppsCache.slice(-remainder)
      } else {
        newHover = 8
        newApps = prevPage()
      }

    } else {
      newHover = oldVar.hover - 1
    }

    if (trueHover == 0) {
      trueHover = runAppsCache.length - 1
    } else {
      trueHover--
    }
  }

  runAppsVariable.setValue({ apps: newApps, hover: newHover })
}


const nextPage = () => {
  const result = runAppsCache.slice(trueHover + 1, trueHover + 1 + showMaxNums);
  return result
}

const prevPage = () => {
  console.log(trueHover - showMaxNums)
  const result = runAppsCache.slice(trueHover - showMaxNums, trueHover);
  return result
}

export default runAppsVariable;
