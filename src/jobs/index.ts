import cron from "node-cron";
import NotificationJob from "./notification.jobs";
import PatronageJob from "./patronage.jobs";
import SubscriptionJob from "./subscription.jobs";

cron.schedule("45 9 * * *", async () => {
  await NotificationJob.run();
});

cron.schedule("55 9 * * *", async () => {
  await PatronageJob.run();
});

cron.schedule("5 10 * * *", async () => {
  await SubscriptionJob.run();
});
