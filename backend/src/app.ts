import express from "express";
import cors from "cors";
import quoteRoutes from "./routes/quotes.routes";
import materialRoutes from "./routes/materials.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/quotes", quoteRoutes);
app.use("/api/materials", materialRoutes);

export default app;
