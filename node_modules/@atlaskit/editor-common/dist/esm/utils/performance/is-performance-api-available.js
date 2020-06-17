var hasRequiredPerformanceAPIs;
export function isPerformanceAPIAvailable() {
    if (hasRequiredPerformanceAPIs === undefined) {
        hasRequiredPerformanceAPIs =
            typeof window !== 'undefined' &&
                'performance' in window &&
                [
                    'measure',
                    'clearMeasures',
                    'clearMarks',
                    'getEntriesByName',
                    'getEntriesByType',
                    'now',
                ].every(function (api) { return !!performance[api]; });
    }
    return hasRequiredPerformanceAPIs;
}
export function isPerformanceObserverAvailable() {
    return !!(typeof window !== 'undefined' && 'PerformanceObserver' in window);
}
//# sourceMappingURL=is-performance-api-available.js.map