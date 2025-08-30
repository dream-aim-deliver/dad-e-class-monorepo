export function idToNumber(id: string | undefined): number | undefined {
    if (id === undefined) return undefined;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? undefined : parsed;
}
