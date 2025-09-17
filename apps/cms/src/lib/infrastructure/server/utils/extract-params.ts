export function extractListParams(
    params: string | string[] | undefined,
): string[] | undefined {
    let items: string[] | undefined;

    if (params) {
        const paramsItems = Array.isArray(params) ? params : params.split(',');

        const filteredItems = paramsItems.filter(
            (topic) => topic.trim() !== '',
        );
        items = filteredItems.length > 0 ? filteredItems : undefined;
    }

    return items;
}
