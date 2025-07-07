import type { Meta, StoryObj } from '@storybook/react';
import CourseCoachCard from '../lib/components/coach/course-coach-card';

const meta: Meta<typeof CourseCoachCard> = {
  title: 'Components/CourseCoachCard/CourseCoachCard',
  component: CourseCoachCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CourseCoachCard>;

export const HighlyRatedCoach: Story = {
  args: {
    cardDetails: {
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
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const NewCoach: Story = {
  args: {
    cardDetails: {
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
    locale: 'de',
    onClickViewProfile: () => alert('Profil ansehen geklickt'),
    onClickBookSession: () => alert('Sitzung buchen geklickt'),
  },
};

export const CoachWithManySkills: Story = {
  args: {
    cardDetails: {
      coachName: 'Michael Carter',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'Japanese', 'Chinese'],
      sessionCount: 200,
      skills: [
        'Business Strategy', 'Marketing', 'Sales', 'SEO', 'Growth', 'Leadership', 'Coaching', 'Mentoring', 'Analytics', 'Branding', 'Negotiation',
      ],
      description: 'I help global teams scale and succeed in new markets. Let’s grow together!',
      courses: [
        { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Global Expansion' },
        { image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg', title: 'Market Entry' },
      ],
      rating: 4.8,
      totalRatings: 210,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const LowRatedCoach: Story = {
  args: {
    cardDetails: {
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
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};
