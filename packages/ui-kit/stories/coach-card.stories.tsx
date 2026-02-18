import type { Meta, StoryObj } from '@storybook/react-vite';
import CoachCard from '../lib/components/coach/coach-card';

const meta: Meta<typeof CoachCard> = {
  title: 'Components/CoachCard',
  component: CoachCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the component in the Storybook canvas
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    variant: {
      control: 'select',
      options: ['student', 'coach', 'courseCreator'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoachCard>;

// 🔹 Default Variant Stories (View Profile + Book Session)

export const HighlyRatedCoach: Story = {
  args: {
    variant: 'student',
    cardDetails: {
      coachName: 'Dr. Sarah Johnson',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'French'],
      sessionCount: 100,
      skills: ['Leadership', 'Communication', 'Public Speaking'],
      description: 'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that\'s as unique as your business.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Leadership Mastery',
          slug: 'leadership-mastery',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Effective Communication',
          slug: 'effective-communication',
        },
      ],
      rating: 5.0,
      totalRatings: 500,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const NewCoach: Story = {
  args: {
    variant: 'student',
    cardDetails: {
      coachName: 'Alex Roberts',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English'],
      sessionCount: 3,
      skills: ['Career Coaching', 'Resume Building'],
      description: 'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that\'s as unique as your business.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Career Advancement',
          slug: 'career-advancement',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Career Development',
          slug: 'career-development',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Resume Writing',
          slug: 'resume-writing',
        },
      ],
      rating: 4.2,
      totalRatings: 15,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const NoProfilePicture: Story = {
  args: {
    variant: 'student',
    cardDetails: {
      coachName: 'Anonymous Coach',
      coachImage: '',
      languages: ['German', 'Spanish'],
      sessionCount: 50,
      skills: ['Personal Development', 'Time Management'],
      description: 'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that\'s as unique as your business.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Personal Growth',
          slug: 'personal-growth',
        },
      ],
      rating: 4.7,
      totalRatings: 75,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const CoachWithManySkills: Story = {
  args: {
    variant: 'student',
    cardDetails: {
      coachName: 'Michael Carter',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'Japanese', 'Chinese'],
      sessionCount: 200,
      skills: [
        'Business Strategy',
        'Marketing',
        'Sales',
        'SEO',
        'Leadership',
        'Communication',
        'Project Management',
        'Data Analysis',
        'Customer Success',
        'Product Development',
      ],
      description: 'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that\'s as unique as your business.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Business Growth',
          slug: 'business-growth',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Marketing 101',
          slug: 'marketing-101',
        },
      ],
      rating: 4.8,
      totalRatings: 320,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

export const LowRatedCoach: Story = {
  args: {
    variant: 'student',
    cardDetails: {
      coachName: 'Tom Spencer',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English'],
      sessionCount: 15,
      skills: ['Public Speaking', 'Debating'],
      description: 'Stand out with my coaching that combines deep branding expertise and a tailored, hands-on approach to craft a brand identity that\'s as unique as your business.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Speaking with Confidence',
          slug: 'speaking-with-confidence',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Public Speaking Mastery',
          slug: 'public-speaking-mastery',
        },
      ],
      rating: 2.5,
      totalRatings: 5,
    },
    locale: 'en',
    onClickViewProfile: () => alert('View Profile Clicked'),
    onClickBookSession: () => alert('Book Session Clicked'),
  },
};

// 🔹 Coach Variant Stories (View Profile Only)

export const CoachVariant: Story = {
  args: {
    variant: 'coach',
    cardDetails: {
      coachName: 'Emma Wilson',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'Italian'],
      sessionCount: 89,
      skills: ['Life Coaching', 'Mindfulness', 'Wellness'],
      description: 'Professional life coach focused on helping individuals achieve their personal and professional goals through mindfulness and structured planning.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Mindful Living',
          slug: 'mindful-living',
        },
      ],
      rating: 4.6,
      totalRatings: 42,
    },
    locale: 'en',
    onClickViewProfile: () => alert('Coach Profile Viewed'),
  },
};

// 🔹 Course Creator Variant Stories (View Profile + Remove from Course)

export const CourseCreatorVariant: Story = {
  args: {
    variant: 'courseCreator',
    cardDetails: {
      coachName: 'Professor Jane Smith',
      coachImage: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1741153300/pjgn9kimlqbz1f5zlvwk.png',
      languages: ['English', 'French', 'Spanish'],
      sessionCount: 245,
      skills: ['Course Development', 'Educational Technology', 'Curriculum Design'],
      description: 'Experienced educator and course creator with expertise in developing comprehensive learning programs for professional development.',
      courses: [
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Advanced Teaching Methods',
          slug: 'advanced-teaching-methods',
        },
        {
          image: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
          title: 'Educational Technology',
          slug: 'educational-technology',
        },
      ],
      rating: 4.9,
      totalRatings: 156,
    },
    locale: 'en',
    onClickViewProfile: () => alert('Course Creator Profile Viewed'),
    onClickRemoveFromCourse: () => alert('Removed from Course'),
  },
};
