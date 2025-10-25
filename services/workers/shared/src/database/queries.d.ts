export declare const QUERIES: {
    TOOLS: {
        GET_ALL: string;
        GET_BY_ID: string;
        GET_BY_CATEGORY: string;
        GET_FEATURES: string;
        SEARCH: string;
    };
    CATEGORIES: {
        GET_ALL: string;
        GET_BY_ID: string;
    };
    ANALYTICS: {
        TRACK_EVENT: string;
        GET_EVENTS: string;
        GET_TOOL_STATS: string;
        GET_DAILY_STATS: string;
        UPDATE_USAGE_STATS: string;
    };
    PERFORMANCE: {
        TRACK_METRICS: string;
        GET_METRICS: string;
        GET_AVERAGE_RESPONSE_TIME: string;
    };
    ANNOUNCEMENTS: {
        GET_ACTIVE: string;
        GET_BY_AUDIENCE: string;
        GET_BY_ID: string;
    };
    SYSTEM: {
        GET_CONFIG: string;
        GET_ALL_CONFIG: string;
        SET_CONFIG: string;
    };
    CHANGELOG: {
        GET_LATEST: string;
        GET_BY_VERSION: string;
        GET_RECENT: string;
    };
    CACHE: {
        GET: string;
        SET: string;
        DELETE: string;
        CLEANUP: string;
    };
    RATE_LIMIT: {
        GET: string;
        UPDATE: string;
        CLEANUP: string;
    };
};
export declare function buildSearchQuery(searchTerm: string): string;
export declare function buildDateRangeQuery(startDate: string, endDate?: string): string;
//# sourceMappingURL=queries.d.ts.map