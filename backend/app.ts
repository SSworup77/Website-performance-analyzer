import express, { Request, Response } from "express";
import cors from "cors";
import { analyzePerformance } from "./src/analyse";
import dotenv from "dotenv"
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running")
})
app.post("/analyze", async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
        res.status(400).json({ error: "A valid URL is required" });
        return;
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (!urlPattern.test(formattedUrl)) {
        res.status(400).json({ error: "Invalid URL format" });
        return;
    }

    try {
        const data = await analyzePerformance(formattedUrl);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to analyze site" });
    }
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));