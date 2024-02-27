import Variable from "resource:///com/github/Aylur/ags/variable.js";
import App from "resource:///com/github/Aylur/ags/app.js";

//一分钟刷新一次。
const todoUse = Variable("10", {
  poll: [60000, [
    "bash",
    "-c",
   `${App.configDir}/scripts/goTodo list`
  ], (out) => {
      let todoContent=[]
      try {
        todoContent = JSON.parse(out)
      } catch (error) {
        console.log("get todoList error")
        console.log(error)
      }

      //检查是否是数组格式
      if(!Array.isArray(todoContent)){
        return []
      }

      return todoContent
    }],
});

export default todoUse;
