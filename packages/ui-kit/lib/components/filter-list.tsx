import { topic } from '@maany_shr/e-class-models';
import React, { useState } from 'react';
import { Button } from './button';

interface TopicListProps {
  list: topic.TTopic[];
  title: string;
  onFilterChange?: (selectedTopicName: string | null) => void; // Callback for parent component
}

/**
 * A reusable TopicList component that displays a list of topics as filter buttons.
 *
 * @param title The title displayed above the topic list.
 * @param list An array of topics, each containing a `name`.
 * @param onFilterChange Optional callback function that receives the selected topic name.
 *
 * @example
 * const topics = [
 *   { name: 'React' },
 *   { name: 'Next.js' },
 * ];
 * 
 * const handleFilterChange = (topicName) => {
 *   console.log('Selected topic:', topicName);
 *   // Filter your data based on topicName
 * };
 *
 * <FilterList title="Filter By Topic" list={topics} onFilterChange={handleFilterChange} />
 */
const FilterList: React.FC<TopicListProps> = ({ title, list, onFilterChange }) => {
  const [selectedTopicName, setSelectedTopicName] = useState<string | null>(null);

  const handleTopicClick = (topicName: string) => {
    // If already selected, deselect it (toggle behavior)
    const newSelectedName = selectedTopicName === topicName ? null : topicName;
    setSelectedTopicName(newSelectedName);
    
    // Notify parent component if callback exists
    if (onFilterChange) {
      onFilterChange(newSelectedName);
    }
  };

  return (
    <div className="max-w-7xl bg-card-fill flex flex-col items-center justify-center gap-6 py-2">
      <h3 className="text-text-primary md:text-4xl text-2xl">{title}</h3>
      <div className="flex gap-3 flex-wrap items-center justify-center">
        {list.map((topic, index) => (
          <Button
            key={index}
            size="medium"
            // Change variant based on whether this topic is selected
            variant={"primary"}
            text={topic.name}
            onClick={() => handleTopicClick(topic.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterList;