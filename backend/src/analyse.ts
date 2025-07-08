import puppeteer, { Browser, Page, HTTPResponse } from "puppeteer";

interface PerformanceResults {
    loadTime: number;
    totalSize: number;
    requestCount: number;
    url: string;
}

interface Resource {
    name: string;
    size: number;
}

let browser: Browser | null = null;

export const analyzePerformance = async (url: string): Promise<PerformanceResults> => {
    let page: Page | null = null;

    const urlPattern = /^https?:\/\/[\w.-]+(?:\.[\w\.-]+)+[/#?]?.*$/;
    if (!urlPattern.test(url)) {
        throw new Error("Invalid URL format. Must include http:// or https://");
    }

    try {
        if (!browser) {
            browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });
        }
        page = await browser.newPage();
        await page.setCacheEnabled(false);

        const resources: Resource[] = [];
        page.on("response", async (response: HTTPResponse) => {
            const url = response.url();
            const type = response.request().resourceType();

            if (["document", "script", "stylesheet", "image", "xhr", "fetch", "font"].includes(type)) {
                const size = response.headers()['content-length']
                    ? parseInt(response.headers()['content-length']!, 10)
                    : await response.buffer().then(buffer => buffer.length).catch(() => 0);
                if (url && size > 0) {
                    resources.push({ name: url, size });
                }
            }
        });

        let attempts = 0;
        let success = false;
        while (attempts < 2 && !success) {
            try {
                await page.goto(url, {
                    waitUntil: "load",
                    timeout: 30000,
                });
                success = true;
            } catch (err: any) {
                attempts++;
                if (attempts === 2) {
                    throw new Error(`Failed to load page after 2 attempts: ${err.message}`);
                }
            }
        }

        await page.waitForFunction(
            'performance.getEntriesByType("navigation")[0]?.loadEventEnd > 0',
            { timeout: 30000 }
        );

        const loadTime = await page.evaluate(() => {
            const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
            return nav ? (nav.loadEventEnd || nav.responseEnd || 0) - nav.startTime : 0;
        });

        const { fallbackResources } = await page.evaluate(() => {
            const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
            return {
                fallbackResources: res.map((r) => ({
                    name: r.name,
                    size: r.transferSize || 0,
                })),
            };
        });

        const uniqueResources = new Map<string, number>();
        resources.forEach((res) => uniqueResources.set(res.name, res.size));
        fallbackResources.forEach((res) => {
            if (!uniqueResources.has(res.name)) {
                uniqueResources.set(res.name, res.size);
            }
        });

        const totalSize = Array.from(uniqueResources.values()).reduce((acc, size) => acc + size, 0);
        const requestCount = uniqueResources.size;

        return {
            loadTime,
            totalSize,
            requestCount,
            url,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error during analysis";
        throw new Error(`Performance analysis failed: ${message}`);
    } finally {
        if (page) await page.close().catch(() => { });
    }
};

process.on('SIGINT', async () => {
    if (browser) {
        await browser.close();
        process.exit(0);
    }
});
