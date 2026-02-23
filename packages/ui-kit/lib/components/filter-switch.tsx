import React from 'react';
import { Button } from './button';

interface TopicListProps {
  list: {
      name: string;
      slug: string;
  }[];
  title: string;
  selectedTopics: string[];
  setSelectedTopics: (selectedTopics: string[]) => void;
  onFilterChange?: (selectedTopicNames: string[]) => void; // Now accepts array of strings
}

/**
 * A reusable FilterSwitch component that displays a list of topics as filter buttons.
 * Supports selecting multiple filters at once.
 *
 * @param title The title displayed above the topic list.
 * @param list An array of topics, each containing a `name`.
 * @param selectedTopics An array of currently selected topic names.
 * @param setSelectedTopics A function to update the selected topics state.
 * @param onFilterChange Optional callback function that receives an array of selected topic names.
 *
 * @example
 * const topics = [
 *   { name: 'React' },
 *   { name: 'Next.js' },
 * ];
 *
 * const handleFilterChange = (topicNames) => {
 *   console.log('Selected topics:', topicNames);
 * };
 *
 * <FilterSwitch title="Filter By Topic" list={topics} onFilterChange={handleFilterChange} />
 */
const FilterSwitch: React.FC<TopicListProps> = ({ title, list, onFilterChange, selectedTopics, setSelectedTopics }) => {
  const handleTopicClick = (topicSlug: string) => {
    let newSelectedTopics: string[];

    // If already selected, remove it from the array (toggle behavior)
    if (selectedTopics.includes(topicSlug)) {
      newSelectedTopics = selectedTopics.filter(name => name !== topicSlug);
    } else {
      // Otherwise, add it to the array
      newSelectedTopics = [...selectedTopics, topicSlug];
    }

    setSelectedTopics(newSelectedTopics);

    // Notify parent component if callback exists
    if (onFilterChange) {
      onFilterChange(newSelectedTopics);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h5 className="text-text-primary md:text-lg lg:text-2xl">{title}</h5>
      <div className="flex gap-3 flex-wrap items-start">
        {list.map((topic, index) => (
          <Button
            key={topic.slug}
            size="medium"
            className='border-1 border-button-secondary-stroke'
            variant={selectedTopics.includes(topic.slug) ? "primary" : "secondary"}
            text={topic.name}
            onClick={() => handleTopicClick(topic.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterSwitch;
