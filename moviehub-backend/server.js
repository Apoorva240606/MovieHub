import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import pool  from "./config/db.js";
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));


pool.connect().then(() => console.log("✅ DB Connected")).catch(err => console.error("DB Error", err));


app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
