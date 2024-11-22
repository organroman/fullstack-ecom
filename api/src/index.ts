import express, { json, urlencoded } from "express";
import cors from "cors";
import qs from "qs";

import productsRoutes from "./routes/products/index.js";
import ordersRoutes from "./routes/orders/index.js";
import authRoutes from "./routes/auth/index.js";

import serverless from "serverless-http";

const port = 3000;

const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3001"],
  })
);
app.set("query parser", function (str: string) {
  return qs.parse(str);
});

app.get("/", (req, res) => {
  res.send("Hello World 11");
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Listening on port`, port);
  });
}

export const handler = serverless(app);
