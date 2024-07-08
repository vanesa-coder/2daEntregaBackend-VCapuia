import { Router } from "express";
import productManage from "../managers/productManage.js";
import { io } from "../app.js";


const router = Router();

router.get("/", async (req, res) => {
  const products = await productManage.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManage.getProducts();
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado en Real Times Products");
    socket.emit("products", products);
  });

  res.render("realTimeProducts");
}); 

router.post("/realtimeproducts", async (req, res) => {
  console.log(req.body);
  await productManage.addProduct(req.body);
  const products = await productManage.getProducts();
  io.emit("products", products);

  res.render("realTimeProducts");
});

router.delete("/realtimeproducts", async (req, res) => {
  const { id } = req.body;
  console.log(id);
  await productManage.deleteProduct(Number(id));
  const products = await productManage.getProducts();
  io.emit("products", products);
  res.render("realTimeProducts");
});
  
  

export default router;