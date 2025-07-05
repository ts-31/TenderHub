import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/company";
import tenderRoutes from "./routes/tenders";
import applicationRoutes from "./routes/applications";
import logoRoutes from "./routes/logo";
import searchRoutes from "./routes/search";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/companies", companyRoutes);
app.use("/tenders", tenderRoutes);
app.use("/applications", applicationRoutes);
app.use("/", logoRoutes);
app.use("/search", searchRoutes);

export default app;
