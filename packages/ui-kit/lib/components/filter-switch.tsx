import { topic } from '@maany_shr/e-class-models';
import React, { useState } from 'react';
import { Button } from './button';

interface TopicListProps {
  list: topic.TTopic[];
  title: string;
  onFilterChange?: (selectedTopicNames: string[]) => void; // Now accepts array of strings
}

/**
 * A reusable FilterSwitch component that displays a list of topics as filter buttons.
 * Supports selecting multiple filters at once.
 *
 * @param title The title displayed above the topic list.
 * @param list An array of topics, each containing a `name`.
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
 *   // Filter your data based on topicNames array
 * };
 *
 * <FilterSwitch title="Filter By Topic" list={topics} onFilterChange={handleFilterChange} />
 */
const FilterSwitch: React.FC<TopicListProps> = ({ title, list, onFilterChange }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicClick = (topicName: string) => {
    let newSelectedTopics: string[];
    
    // If already selected, remove it from the array (toggle behavior)
    if (selectedTopics.includes(topicName)) {
      newSelectedTopics = selectedTopics.filter(name => name !== topicName);
    } else {
      // Otherwise, add it to the array
      newSelectedTopics = [...selectedTopics, topicName];
    }
    
    setSelectedTopics(newSelectedTopics);
    
    // Notify parent component if callback exists
    if (onFilterChange) {
      onFilterChange(newSelectedTopics);
    }
  };

  return (
    <div className="max-w-7xl  flex flex-col gap-4">
      <h5 className="text-text-primary md:text-lg lg:text-2xl">{title}</h5>
      <div className="flex gap-3 flex-wrap items-center">
        {list.map((topic, index) => (
          <Button
            key={index}
            size="medium"
            className='border-0'
            variant={selectedTopics.includes(topic.name) ? "primary" : "secondary"}
            text={topic.name}
            onClick={() => handleTopicClick(topic.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterSwitch;