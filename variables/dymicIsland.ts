import Variable from "resource:///com/github/Aylur/ags/variable.js";
import GLib from "types/@girs/glib-2.0/glib-2.0";

interface dymicIslandVaribaleType {
  host: "windowInfo" | "task" | "",
  slave: string[]
}

interface eventType {
  name: string,
  taskID: GLib.Source
}

const dymicIslandVaribale = Variable<dymicIslandVaribaleType>({ host: "", slave: [] });

/**
 *{name:"",time:"",taskID:""}
 * **/
let eventList: eventType[] = []
const delayTime = 1000

export const handleSalve = (event, handle) => {
  const addTask = (event, handle) => {
    const taskID = setTimeout(() => {
      eventList = eventList.filter(item => {
        return item.name !== event
      })

      if (handle === "add") {
        addSlave(event)
      } else {
        delteSlave(event)
      }

    }, delayTime)
    return taskID
  }


  const has = eventList.find(item => {
    return item.name === event
  })


  if (has) {
    has.taskID.destroy()
    has.taskID = addTask(event, handle)
  } else {
    const taskID = addTask(event, handle)
    eventList.push({
      name: event,
      taskID: taskID
    })
  }
}


export const addSlave = (event: string) => {
  const currentHost = dymicIslandVaribale.value.host
  const currentSlave: string[] = dymicIslandVaribale.value.slave ?? []
  const isHave = currentSlave.find(item => {
    return item === event
  })
  if (isHave) {
    return
  }
  currentSlave.push(event);
  dymicIslandVaribale.setValue({ host: currentHost, slave: currentSlave })
}

export const setHost = (name: "" | "task" | "windowInfo") => {
  const { slave } = dymicIslandVaribale.value
  dymicIslandVaribale.setValue({ host: name, slave: slave })
}

export const resetHost = () => {
  const { slave } = dymicIslandVaribale.value
  dymicIslandVaribale.setValue({ host: "", slave: slave })
}


export const delteSlave = (event) => {
  const handle = () => {
    const currentHost = dymicIslandVaribale.value.host
    const currentSlave = dymicIslandVaribale.value.slave ?? []
    const freshSlave = currentSlave.filter(item => {
      return item !== event
    })
    dymicIslandVaribale.setValue({ host: currentHost, slave: freshSlave })
  }
  handle()

}

export const taskOnOffFunc = () => {
  const { host } = dymicIslandVaribale.value
  if (!host) {
    setHost("task")
  } else {
    resetHost()
  }
}


globalThis.taskOnOff = taskOnOffFunc
export default dymicIslandVaribale
