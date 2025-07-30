import type { Meta, StoryObj } from '@storybook/react';
import { AssignmentCardList } from '../../lib/components/assignment/assignment-card-list';
import { AssignmentCardProps } from '../../lib/components/assignment/assignment-card';
import { NumberFilter } from 'ag-grid-community';

const meta: Meta<typeof AssignmentCardList> = {
  title: 'Components/Assignment/AssignmentCardList',
  component: AssignmentCardList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    locale: {
      control: 'radio',
      options: ['en', 'de'],
      defaultValue: 'en',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample assignment data
const sampleAssignments: AssignmentCardProps[] = [
  {
    role: 'coach',
    assignmentId: 1,
    title: 'Create a photo composition',
    description: 'In my opinion you can do a better job with the shadows',
    files: [
      {
        id: '1',
        name: 'imagefile.png',
        size: 3500000,
        mimeType: 'image/png',
        category: 'image' as const,
        url: 'https://example.com/imagefile.png',
        thumbnailUrl: 'https://picsum.photos/100/100',
        checksum: 'abc123',
        status: 'available'
      }
    ],
    links: [
      {
        linkId: 1,
        title: 'Link title',
        url: 'https://www.lernenhierlernen.ch/lernendiestrebedahin',
      }
    ],
    course: {
      title: 'Course Title',
      imageUrl: 'https://picsum.photos/40/40',
    },
    module: 2,
    lesson: 4,
    status: 'AwaitingReview',
    replies: [
      {
        type: 'text',
        replyId: 1,
        timestamp: '2024-09-19T19:52:00Z',
        comment: "I don't know why but it looks weird. Any suggestion?",
        sender: {
          id: '1',
          name: 'Alice Student',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
          isCurrentUser: false,
          role: 'student',
        }
      }
    ],
    student: {
      id: '1',
      name: 'Alice Student',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      isCurrentUser: false,
      role: 'student',
    },
    groupName: 'Group Alpha',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Course Title'),
    onClickUser: () => alert('User clicked: Alice Student'),
    onClickGroup: () => alert('Group clicked: Group Alpha'),
    onClickView: () => alert('View assignment 1'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  },
  {
    role: 'coach',
    assignmentId: 2,
    title: 'Advanced Photography Techniques',
    description: 'Please work on lighting and composition',
    files: [],
    links: [],
    course: {
      title: 'Photography Masterclass',
      imageUrl: 'https://picsum.photos/40/40',
    },
    module: 1,
    lesson: 3,
    status: 'Passed',
    replies: [
      {
        type: 'passed',
        replyId: 1,
        timestamp: '2024-09-20T10:00:00Z',
        sender: {
          id: '2',
          name: 'John Doe',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
          isCurrentUser: false,
          role: 'student',
        }
      }
    ],
    student: {
      id: '2',
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      isCurrentUser: false,
      role: 'student',
    },
    groupName: undefined,
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Photography Masterclass'),
    onClickUser: () => alert('User clicked: John Doe'),
    onClickGroup: () => alert('Group clicked: (no group)'),
    onClickView: () => alert('View assignment 2'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  },
  {
    role: 'student',
    assignmentId: 3,
    title: 'Portrait Photography Assignment',
    description: 'Take 5 portrait photos using natural lighting',
    files: [
      {
        id: '2',
        name: 'portrait1.jpg',
        size: 2800000,
        mimeType: 'image/jpeg',
        category: 'image' as const,
        url: 'https://example.com/portrait1.jpg',
        thumbnailUrl: 'https://picsum.photos/100/100',
        checksum: 'def456',
        status: 'available'
      }
    ],
    links: [],
    course: {
      title: 'Portrait Photography Course',
      imageUrl: 'https://picsum.photos/40/40',
    },
    module: 3,
    lesson: 2,
    status: 'AwaitingForLongTime',
    replies: [
      {
        type: 'text',
        replyId: 2,
        timestamp: '2024-09-18T15:30:00Z',
        comment: "Here are my portrait shots. I focused on natural lighting as requested.",
        sender: {
          id: '3',
          name: 'Jane Smith',
          image: 'https://randomuser.me/api/portraits/women/3.jpg',
          isCurrentUser: true,
          role: 'student',
        }
      }
    ],
    student: {
      id: '3',
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      isCurrentUser: true,
      role: 'student',
    },
    groupName: 'Photography Group A',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Portrait Photography Course'),
    onClickUser: () => alert('User clicked: Jane Smith'),
    onClickGroup: () => alert('Group clicked: Photography Group A'),
    onClickView: () => alert('View assignment 3'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  }
];

export const Default: Story = {
  args: {
    assignments: sampleAssignments,
    locale: 'en',
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) =>
      alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) =>
      alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) =>
      alert(`Files changed: ${files.length}, Links: ${links.length}, Edit index: ${linkEditIndex}`),
    onImageChange: (image, abortSignal) =>
      alert(`Image change: ${image.name}`),
    onClickCourse: () => alert('Course clicked from list'),
    onClickUser: () => alert('User clicked from list'),
    onClickGroup: () => alert('Group clicked from list'),
    onClickView: () => alert('View clicked from list'),
    onDownloadAll: () => alert('Download all assignments clicked'),
    availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
    availableCourses: ['Course Title', 'Photography Masterclass', 'Portrait Photography Course'],
    availableModules: ['Module 1', 'Module 2', 'Module 3'],
    availableLessons: ['Lesson 1', 'Lesson 2', 'Lesson 3', 'Lesson 4'],
  },
};

export const EmptyState: Story = {
  args: {
    assignments: [],
    locale: 'en',
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) =>
      alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) =>
      alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) =>
      alert(`Files changed: ${files.length}, Links: ${links.length}, Edit index: ${linkEditIndex}`),
    onImageChange: (image, abortSignal) =>
      alert(`Image change: ${image.name}`),
    onClickCourse: () => alert('Course clicked from empty list'),
    onClickUser: () => alert('User clicked from empty list'),
    onClickGroup: () => alert('Group clicked from empty list'),
    onClickView: () => alert('View clicked from empty list'),
    availableStatuses: ['AwaitingReview', 'AwaitingForLongTime', 'Passed'],
  },
};
