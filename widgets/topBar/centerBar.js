import Widget from "resource:///com/github/Aylur/ags/widget.js";
import clientInfoWidget from "./dymicBar/clientInfo.js";



export const centerBar = () => {
  const mainControl  = Widget.Stack({
    items: [
        ['clientInfo',clientInfoWidget()],
    ],
    shown:'clientInfo',
    connections: [
    ],
  })

  const centerWidget = Widget.Box({
    className: "u-right-bar",
    hpack: "end",
    vpack: "fill",
    vertical: false,
    children: [
      mainControl,
    ],
  });

  return centerWidget;
};
