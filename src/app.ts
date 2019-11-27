import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import user from "./routes/user";
import auth from "./routes/auth";
import payment from "./routes/payment";
import admin from "./routes/admin";
import store from "./routes/store";
import onlinestore from "./routes/onlinestore";

import env from "./lib/env";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/user", user);
app.use("/auth", auth);
app.use("/payment", payment);
app.use("/admin", admin);
app.use("/store", store);
app.use("/onlinestore", onlinestore);

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (env === "development" || !err.expose) console.error(err);
  const status = err.status || 500;
  const message =
    err.expose && err.message
      ? err.message
      : "오류가 발생했습니다. 다시 시도해주세요.";

  res.status(status).json({
    status,
    message
  });
};
app.use(errorHandler);

export default app;
