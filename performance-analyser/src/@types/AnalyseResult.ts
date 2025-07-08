export interface PerformanceResults {
    loadTime: number;
    totalSize: number;
    requestCount: number;
    url: string;
}

export interface PerformanceScore {
    score: string;
    color: string;
    bg: string;
}

export interface PerformanceState {
    url: string;
    loading: boolean;
    results: PerformanceResults | null;
    error: string;
}