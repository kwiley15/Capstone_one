import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import uploadRoute from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")));

app.use("/auth", authRoutes);

app.use("/upload", uploadRoute);

app.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
