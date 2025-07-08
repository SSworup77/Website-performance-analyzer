import { create } from 'zustand';
import type { PerformanceResults, PerformanceState } from '../@types/AnalyseResult';


interface PerformanceStore extends PerformanceState {
    setUrl: (url: string) => void;
    setLoading: (loading: boolean) => void;
    setResults: (results: PerformanceResults | null) => void;
    setError: (error: string) => void;
    analyzePerformance: () => Promise<void>;
    resetState: () => void;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
    url: '',
    loading: false,
    results: null,
    error: '',

    setUrl: (url: string) => set({ url }),
    setLoading: (loading: boolean) => set({ loading }),
    setResults: (results: PerformanceResults | null) => set({ results }),
    setError: (error: string) => set({ error }),

    analyzePerformance: async () => { },
    resetState: () => set({ url: '', loading: false, results: null, error: '' }),
}));