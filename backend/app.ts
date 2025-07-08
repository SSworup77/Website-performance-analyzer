import express, { Request, Response } from "express";
import cors from "cors";
import { analyzePerformance } from "./src/analyse";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body;

    // Validate URL format
    if (!url || typeof url !== "string") {
        res.status(400).json({ error: "A valid URL is required" });
        return;
    }

    // Ensure URL has a protocol
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));