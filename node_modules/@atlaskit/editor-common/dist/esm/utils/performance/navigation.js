import { isPerformanceAPIAvailable } from './is-performance-api-available';
export function getResponseEndTime() {
    if (!isPerformanceAPIAvailable()) {
        return;
    }
    var nav = performance.getEntriesByType('navigation')[0];
    if (nav) {
        return nav.responseEnd;
    }
    return;
}
//# sourceMappingURL=navigation.js.map