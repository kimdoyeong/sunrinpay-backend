import { schedule } from "node-cron";
import Payment from "../models/Payment";

function collection() {
  const date = new Date();
  console.log(
    `Delete garbage payment per hour ${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  );
  Payment.deleteMany({
    createdAt: {
      $lt: Date.now() - 1000 * 60 * 5
    }
  }).exec();
}
function cron() {
  const task = schedule("0 * * * *", collection);
  collection();
  task.start();
}

export default cron;
