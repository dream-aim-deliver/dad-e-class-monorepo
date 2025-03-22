import { topic } from '@maany_shr/e-class-models';
import React from 'react';
import { Button } from './button';


interface TopicProps extends topic.TTopic {
    url: string;
}
interface TopicListProps {
    list: TopicProps[];
    title: string;
 }
/**
 * Represents a topic with a name and a URL.
 *
 * @param name The name of the topic.
 * @param url The URL the button links to.
 */
/**
 * A reusable TopicList component that displays a list of topics with buttons linking to their respective URLs.
 *
 * @param title The title displayed above the topic list.
 * @param list An array of topics, each containing a `name` and `url`.
 *
 * @example
 * const topics = [
 *   { name: 'React', url: 'https://react.dev' },
 *   { name: 'Next.js', url: 'https://nextjs.org' },
 * ];
 * 
 * <TopicList title="Topics" list={topics} />
 */
/**
 * A component that renders a list of topics as buttons.
 *
 * - Each button represents a topic and links to its respective URL.
 * - The buttons are styled using the `Button` component.
 * - The list is wrapped in a responsive container for better UX.
 *
 * @param {TopicListProps} props - The component props.
 * 
 * @returns {JSX.Element} A list of topic buttons.
 */
const TopicList: React.FC<TopicListProps> = ({ title, list }) => {
  return (
    <div className="max-w-7xl bg-card-fill flex flex-col items-center justify-center gap-6 py-2">
      <h3 className="text-text-primary md:text-[40px] text-2xl">{title}</h3>
      <div className="flex gap-3 flex-wrap items-center justify-center">
        {list.map((topic, index) => (
          <a href={topic.url} key={index}>
            <Button size="medium" variant="secondary" text={topic.name} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopicList;
