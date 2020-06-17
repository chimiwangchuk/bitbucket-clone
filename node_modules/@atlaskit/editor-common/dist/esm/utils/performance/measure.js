import { isPerformanceAPIAvailable } from './is-performance-api-available';
var measureMap = new Map();
export function startMeasure(measureName) {
    if (!isPerformanceAPIAvailable()) {
        return;
    }
    performance.mark(measureName);
    measureMap.set(measureName, performance.now());
}
export function stopMeasure(measureName, onMeasureComplete) {
    if (!isPerformanceAPIAvailable()) {
        return;
    }
    var start = measureMap.get(measureName);
    try {
        performance.measure(measureName, measureName);
        var entry = performance.getEntriesByName(measureName).pop();
        if (entry) {
            onMeasureComplete(entry.duration, entry.startTime);
        }
        else if (start) {
            onMeasureComplete(performance.now() - start, start);
        }
    }
    catch (error) {
        if (start) {
            onMeasureComplete(performance.now() - start, start);
        }
    }
    clearMeasure(measureName);
}
export function clearMeasure(measureName) {
    if (!isPerformanceAPIAvailable()) {
        return;
    }
    measureMap.delete(measureName);
    performance.clearMarks(measureName);
    performance.clearMeasures(measureName);
}
//# sourceMappingURL=measure.js.map