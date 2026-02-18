import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourseCoachCardList } from '../lib/components/coach/course-coach-card-list';
import { CoachCardDetails } from '../lib/components/coach/course-coach-card';

const mockLanguages = ['English', 'German', 'French', 'Spanish'];
const mockSkills = [
  'Leadership', 'Communication', 'Teamwork', 'Strategy', 'Innovation', 'Project Management',
];

const mockCoaches: CoachCardDetails[] = [
  {
    coachName: 'Prof. Anna Keller',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'German'],
    sessionCount: 120,
    skills: ['Strategy', 'Innovation', 'Leadership'],
    description: 'Award-winning coach with a passion for helping teams innovate and grow. 20+ years of experience in business strategy and leadership.',
    courses: [
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Business Strategy' },
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Innovation Mastery' },
    ],
    rating: 4.9,
    totalRatings: 320,
  },
  {
    coachName: 'Lina Schmidt',
    coachImage: '',
    languages: ['German'],
    sessionCount: 2,
    skills: ['Career Coaching', 'Resume Building'],
    description: 'Early-career coach focused on helping young professionals land their dream jobs.',
    courses: [
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Career Launch' },
    ],
    rating: 4.2,
    totalRatings: 8,
  },
  {
    coachName: 'Michael Carter',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English', 'Japanese', 'Chinese'],
    sessionCount: 200,
    skills: [
      'Business Strategy', 'Marketing', 'Sales', 'SEO', 'Growth', 'Leadership', 'Coaching', 'Mentoring', 'Analytics', 'Branding', 'Negotiation',
    ],
    description: 'I help global teams scale and succeed in new markets. Lets grow together!',
    courses: [
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Global Expansion' },
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Market Entry' },
    ],
    rating: 4.8,
    totalRatings: 210,
  },
  {
    coachName: 'Tom Spencer',
    coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
    languages: ['English'],
    sessionCount: 15,
    skills: ['Public Speaking', 'Debating'],
    description: 'I help you find your voice and speak with confidence.',
    courses: [
      { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Speaking with Confidence' },
    ],
    rating: 2.5,
    totalRatings: 5,
  },
];

const meta: Meta<typeof CourseCoachCardList> = {
  title: 'Components/CourseCoachCard/CourseCoachCardList',
  component: CourseCoachCardList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseCoachCardList>;

export const Default: Story = {
  args: {
    coaches: mockCoaches,
    locale: 'en',
    languages: mockLanguages,
    skills: mockSkills,
    onClickViewProfile: (coach) => alert(`View Profile: ${coach.coachName}`),
    onClickBookSession: (coach) => alert(`Book Session: ${coach.coachName}`),
  },
};

export const GermanLocale: Story = {
  args: {
    coaches: mockCoaches,
    locale: 'de',
    languages: mockLanguages,
    skills: mockSkills,
    onClickViewProfile: (coach) => alert(`Profil ansehen: ${coach.coachName}`),
    onClickBookSession: (coach) => alert(`Sitzung buchen: ${coach.coachName}`),
  },
};