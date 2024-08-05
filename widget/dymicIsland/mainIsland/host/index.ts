import WindowInfo from "./windowInfo"
import Task from "./task"
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const host = {
  windowInfo() {
    return new WindowInfo().mianWidget
  },
  task() {
    return new Task().mainWidget
  },
  empy() {
    return Widget.Box({
      css:"background-color:#000;border-radius:2.75rem"
    })
  }
}

export default host
