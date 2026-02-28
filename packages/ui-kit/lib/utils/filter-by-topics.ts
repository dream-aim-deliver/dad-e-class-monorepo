/**
 * Returns true if the item matches the selected topics filter.
 * When no topics are selected (empty array), all items pass the filter.
 *
 * @param selectedTopics - Array of selected topic slugs
 * @param itemTopicSlugs - Array of topic slugs the item belongs to
 */
export function matchesTopicFilter(
    selectedTopics: string[],
    itemTopicSlugs: string[],
): boolean {
    return (
        selectedTopics.length === 0 ||
        itemTopicSlugs.some((slug) => selectedTopics.includes(slug))
    );
}
