declare module 'web-vitals' {
  interface ReportOpts {
    reportAllChanges?: boolean;
  }

  interface CLSMetric {
    name: 'CLS';
    value: number;
    delta: number;
    entries: PerformanceEntry[];
    id: string;
    rating: 'poor' | 'needs-improvement' | 'good';
  }

  interface FCPMetric {
    name: 'FCP';
    value: number;
    entries: PerformanceEntry[];
    id: string;
  }

  interface FIDMetric {
    name: 'FID';
    value: number;
    entries: PerformanceEntry[];
    id: string;
  }

  interface LCPMetric {
    name: 'LCP';
    value: number;
    entries: PerformanceEntry[];
    id: string;
    rating: 'poor' | 'needs-improvement' | 'good';
  }

  interface TTFBMetric {
    name: 'TTFB';
    value: number;
    entries: PerformanceEntry[];
    id: string;
  }

  export function onCLS(callback: (metric: CLSMetric) => void, opts?: ReportOpts): void;
  export function onFID(callback: (metric: FIDMetric) => void, opts?: ReportOpts): void;
  export function onFCP(callback: (metric: FCPMetric) => void, opts?: ReportOpts): void;
  export function onLCP(callback: (metric: LCPMetric) => void, opts?: ReportOpts): void;
  export function onTTFB(callback: (metric: TTFBMetric) => void, opts?: ReportOpts): void;
}
