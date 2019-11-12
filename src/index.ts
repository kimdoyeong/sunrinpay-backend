import app from "./app";
import connectDB from "./lib/connectDB";
import cron from "./lib/cron";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    cron();
    app.listen(PORT, () => {
      console.log(`App listens port ${PORT}`);
    });
  })
  .catch(e => {
    console.error(`Mongoose Connect Error: ${e.message}`);
  });
