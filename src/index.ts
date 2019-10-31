import app from "./app";
import connectDB from "./lib/connectDB";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listens port ${PORT}`);
    });
  })
  .catch(e => {
    console.error(`Mongoose Connect Error: ${e.message}`);
  });
