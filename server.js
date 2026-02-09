import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import subRoutes from "./src/routes/sub.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Подключаем базу данных (Vercel вызывает файл при каждом запросе, 
// поэтому подключение внутри асинхронной функции — это ок)
connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subRoutes);

const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "willy.html"));
});

app.use(errorHandler);

// Для Vercel: не вызывай app.listen() в продакшене, 
// так как Vercel сам управляет портами.
if (process.env.NODE_ENV !== 'production') {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running on http://localhost:${PORT}`);
  });
}

export default app;