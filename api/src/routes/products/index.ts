import { Router } from "express";

const router = Router();
// products endpoints

router.get("/", (req, res) => {
  res.send("The list of products");
});

router.get("/:id", (req, res) => {
  console.log(req.params);
  res.send("Product");
});

router.post("/", (req, res) => {
  res.send("new product created");
});

router.patch("/", (req, res) => {
  res.send("new product created");
});

export default router;
