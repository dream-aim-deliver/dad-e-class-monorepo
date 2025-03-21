import { Meta, StoryObj } from "@storybook/react";
import HomeAccordion from "../lib/components/accordion/accordian-types/home-accordion";

export default {
  title: "Components/Accordion",
  component: HomeAccordion,
  parameters: {
    backgrounds: { default: "black" }
  },
} as Meta<typeof HomeAccordion>;

export const Home_Accordion: StoryObj<typeof HomeAccordion> = {
  args: {
    accordionTitle: "Frequently Asked Questions",
    accordionItems: [
      { 
        number: 1,
        value: "item-1", 
        title: "🚀 How can I improve my productivity   bbbhhhhhhhjkkk vhbj How can I improve my productivity  ?",
        content: `- Use time-blocking to structure your day efficiently.
- Leverage productivity tools like Notion, Trello, or Asana.
- Take short breaks using the Pomodoro technique (25 mins work, 5 mins break).
- Prioritize deep work and minimize distractions.` 
      },
      { 
        number: 2, 
        value: "item-2", 
        title: "🎯 What are the best ways to set and achieve goals?", 
        content: `- Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.
- Break large goals into smaller, actionable steps.
- Track progress using a goal journal or an app like Habitica.
- Stay motivated by celebrating small wins along the way.` 
      },
      { 
        number: 3, 
        value: "item-3", 
        title: "💻 What are the best practices for learning to code?", 
        content: `- Start with the basics: HTML, CSS, and JavaScript.
- Follow interactive courses like FreeCodeCamp, Codecademy, or Scrimba.
- Build projects to apply what you’ve learned.
- Read open-source code on GitHub and contribute to projects.` 
      },
      { 
        number: 4, 
        value: "item-4", 
        title: "📖 How can I develop a strong reading habit?", 
        content: `- Set a daily reading goal (e.g., 10-15 pages per day).
- Use audiobooks for convenience when commuting.
- Read diverse genres to keep things interesting.
- Join a book club or use Goodreads to track your progress.` 
      },
      { 
        number: 5, 
        value: "item-5", 
        title: "🌍 What are some practical tips for traveling on a budget?", 
        content: `- Book flights and accommodations in advance for better deals.
- Use budget travel websites like Skyscanner and Airbnb.
- Travel during the off-season to save money.
- Leverage travel reward programs and credit card points.` 
      },
    ],
  },
};
