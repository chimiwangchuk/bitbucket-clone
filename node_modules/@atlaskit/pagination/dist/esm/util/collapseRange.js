import { __read, __spread } from "tslib";
export default function collapseRange(pages, current, _a) {
    var max = _a.max, ellipsis = _a.ellipsis;
    var total = pages.length;
    // only need ellipsis if we have more pages than we can display
    var needEllipsis = total > max;
    // show start ellipsis if the current page is further away than max - 3 from the first page
    var hasStartEllipsis = needEllipsis && max - 3 < current;
    // show end ellipsis if the current page is further than total - max + 3 from the last page
    var hasEndEllipsis = needEllipsis && current < total - max + 4;
    if (!needEllipsis) {
        return pages;
    }
    if (hasStartEllipsis && !hasEndEllipsis) {
        var pageCount_1 = max - 2;
        return __spread([
            pages[0],
            ellipsis({ key: 'elipses-1' })
        ], pages.slice(total - pageCount_1));
    }
    if (!hasStartEllipsis && hasEndEllipsis) {
        var pageCount_2 = max - 2;
        return __spread(pages.slice(0, pageCount_2), [
            ellipsis({ key: 'elipses-1' }),
            pages[total - 1],
        ]);
    }
    // we have both start and end ellipsis
    var pageCount = max - 4;
    return __spread([
        pages[0],
        ellipsis({ key: 'elipses-1' })
    ], pages.slice(current - Math.floor(pageCount / 2), current + pageCount - 1), [
        ellipsis({ key: 'elipses-2' }),
        pages[total - 1],
    ]);
}
//# sourceMappingURL=collapseRange.js.map