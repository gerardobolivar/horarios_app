import cron from 'node-cron';
import { deactivateHorarioById } from 'prisma/models/horarioModel';


class TaskMonitor {
  static task: cron.ScheduledTask|null;

  static create(cronString: string, fn: () => void) {
    if (cron.validate(cronString)) {
      const task = cron.schedule(cronString, fn);
      TaskMonitor.task = task;
    } else {
      console.error("Invalid cron string format.")
    }

  }

  static setDeactivation(horario_id:number,date:Date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const dayOfMonth = date.getUTCDate();
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const cronString = `${minutes} ${hour} ${dayOfMonth} ${month} *`;
    console.log("Constring: "+cronString);
    
    
    if (cron.validate(cronString)) {
      
      const task = cron.schedule(cronString, async () => {
        await deactivateHorarioById(horario_id).then(()=>{
          TaskMonitor.stopAll();
        })
      },{scheduled:true});

      TaskMonitor.task = task;
    } else {
      console.error("Invalid cron string format.")
    }

  }

  close() {
    TaskMonitor.task?.stop();
  }

  list() {
    const tasks = cron.getTasks().keys();
    for (const value of tasks) {
      console.log(value);
    }


  }

  static stopAll() {
    const tasks = cron.getTasks().keys();
    for (const value of tasks) {
      cron.getTasks().get(value)?.stop();
    }
    cron.getTasks().clear();
    TaskMonitor.task = null;
  }


}

export default TaskMonitor;