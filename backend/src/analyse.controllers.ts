import { Request, Response } from "express";
import { analyzePerformance } from "./analyse";

export const analyse = async (req: Request, res: Response): Promise<void> => {
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
};