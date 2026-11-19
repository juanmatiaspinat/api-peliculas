import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Middleware logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Ruta de prueba para ver si el servidor funciona
app.get("/", (_req, res) => {
    res.json({ message: "API de Películas funcionando" });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
