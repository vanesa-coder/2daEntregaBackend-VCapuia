import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import handlebars from "express-handlebars";
import viewsRoutes from "./routes/views.routes.js";
import __dirname from "./dirname.js";
import { Server } from "socket.io";


const PORT = 8080
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static("public"));

app.use("/api", productRouter );
app.use("/api", cartRouter);
app.use("/", viewsRoutes);



  

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

// Configuración de socket

export const io = new Server(httpServer);

let products = [];

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("product", (data) => {
    products.push(data);

    io.emit("products", products)
})

socket.on("changeStock", (data) => {
    products = data;
    io.emit("products", products);
})

  })
