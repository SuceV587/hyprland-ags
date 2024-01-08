import Variable from "resource:///com/github/Aylur/ags/variable.js";

const meoryUse = Variable("10", {
  // listen is what will be passed to Utils.subprocess, so either a string or string[]
  // listen: ['bash', '-c', "LANG=c free -m | grep 'Mem:' | awk '{printf \"%d@@%d@\", $7, $2}'"],
  poll: [2000, [
    "bash",
    "-c",
    "LANG=c free -m | grep 'Mem:' | awk '{printf \"%d||%d\", $7, $2}'",
  ], (out) => {
      const mem = out.split("||");
      return {available:mem[0]||10,total:mem[1]||31498} 
    }],
});

// sh -c
//      "LANG=c free -m | grep 'Mem:' | awk '{printf \"%d@@%d@\", $7, $2}'"

export default meoryUse;
