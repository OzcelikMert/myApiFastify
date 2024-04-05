import chalk from "chalk";
import {PostTimer} from "@timers/post.timer";
import {ViewTimer} from "@timers/view.timer";

const iniLongTimer = (hours: number = 12) => {
    console.log(chalk.green(`#Long Timer (each ${hours} hours)`));
    console.log(chalk.blue(`- Long Timer Initialized ${new Date().toLocaleString()}`))

    async function start() {
        setTimeout(async () => {
            try {
                console.log(chalk.green(`#Long Timer`));
                console.log(chalk.blue(`- Long Timer Started ${new Date().toLocaleString()}`))
                console.time(`longTimer`)

                /* Check Pending Posts */
                await PostTimer.checkIsPending();

                /* Check Old Views */
                await ViewTimer.checkOld();

                console.timeEnd(`longTimer`);
                console.log(chalk.blue(`- Long Timer Finished`));
            }catch (e) {}
            start();
        }, Date.convertHoursToSeconds(hours))
    }

    start();
}

export const Timers = {
    iniLongTimer: iniLongTimer
}