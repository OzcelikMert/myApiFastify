import chalk from 'chalk';
import { PostTimer } from '@timers/post.timer';
import { ViewTimer } from '@timers/view.timer';
import { UserTimer } from '@timers/user.timer';

const initLongTimer = (hours: number = 6) => {
  console.log(chalk.green(`#Timer (${chalk.yellow(`each ${hours} hours`)})`));
  console.log(chalk.blue(`- Initialized ${new Date().toLocaleString()}`));

  async function start() {
    setTimeout(async () => {
      try {
        console.log(chalk.green(`#Timer (${chalk.yellow(`each ${hours} hours`)})`));
        console.log(chalk.blue(`- Started ${new Date().toLocaleString()}`));
        console.time(`longTimer`);

        /* Check Pending Posts */
        await PostTimer.checkIsPending();

        /* Check Old Views */
        await ViewTimer.checkOld();

        /* Check users who have banned */
        await UserTimer.checkBanDateEnd();

        console.timeEnd(`longTimer`);
        console.log(chalk.blue(`- Long Timer Finished`));
      } catch (e) {}
      start();
    }, Date.convertHoursToMS(hours));
  }

  start();
};

export const Timers = {
  initLongTimer: initLongTimer,
};
