import Monitors from './monitors'
const monitorWidth = Monitors.mainMonitorWidth
const monitorHeight = Monitors.mainMonitorHeight



//把屏幕高度分为20份
export const getNoramlIconSize = () => {
  return Math.floor(monitorHeight / 20);
}

export const getBigIconSize = () => {
  return Math.floor(getNoramlIconSize() * 1.2)
}


export const getMaxIconSize = () => {
  return Math.floor(getNoramlIconSize() * 1.5)
}

//把屏幕高度分为100份
export const getNoramlSpace = () => {
  return Math.floor(monitorHeight / 100);
}


export const getSmallSpace = () => {
  return Math.floor(getNoramlSpace() * 0.8);
}


export const getSmallerSpace = () => {
  return Math.floor(getNoramlSpace() * 0.5);
}


export const getBigSpace = () => {
  return Math.floor(getNoramlSpace() * 1.2)
}

export const getMaxSpace = () => {
  return Math.floor(getNoramlSpace() * 1.5)
}
