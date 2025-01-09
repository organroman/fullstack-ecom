import express, {
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import qs from "qs";

import productsRoutes from "./routes/products/index.js";
import ordersRoutes from "./routes/orders/index.js";
import authRoutes from "./routes/auth/index.js";
import usersRoutes from "./routes/users/index.js";
import categoriesRoutes from "./routes/categories/index.js";
import uploadRoutes from "./routes/upload/index.js";
import dashboardRoutes from "./routes/dashboard/index.js";

import serverless from "serverless-http";

const port = 8000;

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3000"],
  })
);
app.set("query parser", function (str: string) {
  return qs.parse(str);
});

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API",
    version: "1.0.0",
    endpoints: {
      products: "/products",
      orders: "/orders",
      auth: "/auth",
      users: "/users",
      categories: "/categories",
      upload: "/upload",
    },
  });
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/upload", uploadRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message || "File upload failed" });
  next();
});

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Listening on port`, port);
  });
}

export const handler = serverless(app);
