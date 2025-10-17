import express from "express";
import cors from "cors";
import quoteRoutes from "./routes/quotes.routes";
import materialRoutes from "./routes/materials.routes";
import vendorRoutes from "./routes/vendors.routes";
import syncRoutes from "./routes/sync-sheet.routes";
import awardRoutes from "./routes/awards.routes";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.send("Server Is Up & Running");
});
app.use("/api/quotes", quoteRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/sync-sheet", syncRoutes);
app.use("/api/awards", awardRoutes);

export default app;
