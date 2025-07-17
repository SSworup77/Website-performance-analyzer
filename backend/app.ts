import express, { Request, Response } from "express";
import cors from "cors";
import { analyzePerformance } from "./src/analyse";
import dotenv from "dotenv"
import analyseRoute from "./src/route";
dotenv.config()
const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://website-performance-analyzer-sworup-shresthas-projects.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running")
})
app.use('/api/',analyseRoute)

const PORT = process.env.PORT;
app.listen(process.env.PORT, () => console.log(`Server running on port ${PORT}`));