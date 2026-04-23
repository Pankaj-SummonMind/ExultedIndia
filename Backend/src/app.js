import express from "express"
import cors from "cors"
import { Router } from "express";
const router = Router()
//remove later after adding cloud  services
import path from "path"
import { fileURLToPath } from "url";
const app = express();

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

// app.use(cors({
//     origin: "http://localhost:5173"
// }))

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// console.log("this is cors ",process.env.CORS_ORIGIN)
app.use(express.json());

// just to store file at backend and aceess it in frontend letter remove when store file in cloud servises
// Create __dirname manually (ESM fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(process.cwd(), "public")));


//routes import 
import categoriesRoutes from "./routes/categories.routes.js"
import productsRoutes from "./routes/product.routes.js"
import userRoutes from "./routes/user.routes.js"
import socialMedia from "./routes/socialMedia.Routes.js"
import certificateRoutes from "./routes/certificate.routes.js"
import HomePageRoutes from "./routes/HomePage.routes.js"
import aboutusRoutes from "./routes/aboutus.routes.js"
// routes declaration
app.use("/api/categories",categoriesRoutes)
app.use("/api/products",productsRoutes)
app.use("/api/user",userRoutes)
app.use("/api/socialMedia",socialMedia)
app.use("/api/certificate",certificateRoutes)
app.use("/api/homepage",HomePageRoutes)
app.use("/api/aboutus",aboutusRoutes)




export default app;