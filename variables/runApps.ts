import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { sortClientItems } from "lib/client";

interface runAppsType {
  apps: any[],
  hover: number,
  trueHover: number

}

export const showMaxNums = 9
let runAppsCache: any[] = []
let runAppsCacheBak: any[] = []
let hover = 0
let trueHover = 0

const runAppsVariable = Variable<runAppsType>({ apps: [], hover: 0, trueHover: 0 }, {});

//初始化runApps
export const initRunApps = () => {
  hover = 0
  trueHover = 0

  runAppsCache = []
  runAppsCacheBak = []

  runAppsCache = Hyprland.clients.filter(client => client["pid"] > 0 && client["class"] != "").sort(({ workspace: { id: a } }, { workspace: { id: b } }) => {
    return a - b
  })

  //只取前showMaxNums个
  const result = runAppsCache.slice(0, showMaxNums);
  runAppsVariable.setValue({ apps: result, hover: hover, trueHover: trueHover })
}

export const getTotalPage = () => {
  return Math.ceil(runAppsCache.length / showMaxNums)
}

export function substitute(str) {
  const subs = [
    { from: "dd", to: "dingtalk" },
    { from: "wx", to: "wechat" },
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

  if (keyword != "") {
    if (runAppsCacheBak.length == 0) {
      runAppsCacheBak = runAppsCache
    } else {
      runAppsCache = runAppsCacheBak
    }

    keyword = substitute(keyword)
    //搜索包含指定关键词的
    runAppsCache = runAppsCache.filter((item) => {
      const classLower = item.class.toLowerCase()
      return classLower.indexOf(keyword) != -1;
    })
  } else {
    if (runAppsCacheBak.length != 0) {
      runAppsCache = runAppsCacheBak
    }
  }

  const result = runAppsCache.slice(0, showMaxNums);
  runAppsVariable.setValue({ apps: result, hover: hover, trueHover: trueHover })
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

  runAppsVariable.setValue({ apps: newApps, hover: newHover, trueHover: trueHover })
}


const nextPage = () => {
  const result = runAppsCache.slice(trueHover + 1, trueHover + 1 + showMaxNums);
  return result
}

const prevPage = () => {
  const result = runAppsCache.slice(trueHover - showMaxNums, trueHover);
  return result
}

export default runAppsVariable;
