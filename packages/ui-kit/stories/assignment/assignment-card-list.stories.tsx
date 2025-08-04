import type { Meta, StoryObj } from '@storybook/react';
import { AssignmentCardList } from '../../lib/components/assignment/assignment-card-list';
import { AssignmentCardProps } from '../../lib/components/assignment/assignment-card';
import { NumberFilter } from 'ag-grid-community';

// Mock Data Generators
const mockCourse = {
    id: 1,
    title: 'Storybook Champions  Champions Champions Champions Champions Champions Champions ',
    imageUrl: 'https://picsum.photos/40/40',
};

const mockStudent = {
    id: '1',
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockCoach = {
    id: '2',
    name: 'Coach Jane',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateFile = () => ({
    id: Math.random().toString(),
    name: 'Slide.pdf',
    mimeType: 'application/pdf',
    size: 102400,
    checksum: 'xyz123',
    status: 'available' as 'available',
    category: 'generic' as const,
    url: 'https://example.com/slide.pdf',
});

const generateLink = () => ({
    linkId: Math.floor(Math.random() * 1_000_000),
    title: 'Example Link',
    url: 'https://example.com',
});

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
  // AwaitingReview, no reply (coach)
  {
    role: 'coach',
    assignmentId: 1,
    title: 'Algebra Homework',
    description: 'Solve all the equations in section B.',
    files: [generateFile()],
    links: [generateLink()],
    course: mockCourse,
    module: 2,
    lesson: 4,
    status: 'AwaitingReview',
    replies: [],
    student: mockStudent,
    groupName: 'Team Rockets',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Super Course'),
    onClickUser: () => alert('User clicked: Priya'),
    onClickGroup: () => alert('Group clicked: Team Rockets'),
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
  // AwaitingReview, with reply (coach)
  {
    role: 'coach',
    assignmentId: 2,
    title: 'Algebra Homework',
    description: 'Solve all the equations in section B.',
    files: [generateFile()],
    links: [generateLink()],
    course: mockCourse,
    module: 2,
    lesson: 4,
    status: 'AwaitingReview',
    replies: [
      {
        replyId: 1001,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'resources',
        comment: 'Here is my submission.',
        sender: mockStudent,
        files: [generateFile()],
        links: [generateLink()],
      }
    ],
    student: mockStudent,
    groupName: 'Team Rockets',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Super Course'),
    onClickUser: () => alert('User clicked: Priya'),
    onClickGroup: () => alert('Group clicked: Team Rockets'),
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
  // Passed, with reply (student)
  {
    role: 'student',
    assignmentId: 3,
    title: 'Algebra Homework',
    description: 'Solve all the equations in section B.',
    files: [],
    links: [],
    course: mockCourse,
    module: 2,
    lesson: 4,
    status: 'Passed',
    replies: [
      {
        replyId: 1002,
        timestamp: new Date().toISOString(),
        sender: mockCoach,
        type: 'passed',
      }
    ],
    student: mockStudent,
    groupName: 'Team Rockets',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Super Course'),
    onClickUser: () => alert('User clicked: Priya'),
    onClickGroup: () => alert('Group clicked: Team Rockets'),
    onClickView: () => alert('View assignment 3'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  },
  // Card matching the screenshot: Create a photo composition with last activity and waited for more than 48h
  {
    role: 'coach',
    assignmentId: 100,
    title: 'Create a photo composition',
    description: 'Custom coach description here, for example: "Please download the file, follow the tasks and upload your work when you\'re done."',
    files: [
      {
        id: 'img1',
        name: 'Imagefile.png',
        mimeType: 'image/png',
        size: 3500000,
        checksum: 'img-abc',
        status: 'available',
        category: 'image',
        url: 'https://picsum.photos/seed/assignment/400/300',
        thumbnailUrl: 'https://picsum.photos/100/100',
      }
    ],
    links: [],
    course: {
      title: 'Course Title',
      imageUrl: 'https://picsum.photos/40/40',
    },
    module: 2,
    lesson: 4,
    status: 'AwaitingForLongTime',
    replies: [
      {
        replyId: 1,
        timestamp: '2024-09-19T19:52:00Z',
        type: 'resources',
        comment: "I don't know why but it looks weird. Any suggestion?",
        sender: {
          id: 'alice',
          name: 'Alice',
          image: 'https://picsum.photos/40/40',
          isCurrentUser: false,
          role: 'student',
        },
        files: [
          {
            id: 'img1',
            name: 'Imagefile.png',
            mimeType: 'image/png',
            size: 3500000,
            checksum: 'img-abc',
            status: 'available',
            category: 'image',
            url: 'https://picsum.photos/seed/assignment/400/300',
            thumbnailUrl: 'https://picsum.photos/100/100',
          },
          {
            id: 'img2',
            name: 'Imagefile.png',
            mimeType: 'image/png',
            size: 3500000,
            checksum: 'img-def',
            status: 'available',
            category: 'image',
            url: 'https://picsum.photos/seed/assignment2/400/300',
            thumbnailUrl: 'https://picsum.photos/100/100',
          }
        ],
        links: [
          {
            linkId: 1,
            title: 'Link title',
            url: 'https://website.com/this/is/the/url',
          }
        ],
      }
    ],
    student: {
      id: 'full',
      name: 'Full Name',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      isCurrentUser: false,
      role: 'student',
    },
    groupName: 'Group Name',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Course Title'),
    onClickUser: () => alert('User clicked: Full Name'),
    onClickGroup: () => alert('Group clicked: Group Name'),
    onClickView: () => alert('View assignment 100'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  },
  // Card matching the screenshot: Create a photo composition, no replies, one image
  {
    role: 'coach',
    assignmentId: 101,
    title: 'Create a photo composition',
    description: 'Custom coach description here, for example: "Please download the file, follow the tasks and upload your work when you\'re done."',
    files: [
      {
        id: 'img1',
        name: 'Imagefile.png',
        mimeType: 'image/png',
        size: 3500000,
        checksum: 'img-abc',
        status: 'available',
        category: 'image',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=100&q=80',
      }
    ],
    links: [],
    course: {
      title: 'Course Title',
      imageUrl: 'https://picsum.photos/40/40',
    },
    module: 2,
    lesson: 4,
    status: 'AwaitingForLongTime',
    replies: [],
    student: {
      id: 'full',
      name: 'Full Name',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      isCurrentUser: false,
      role: 'student',
    },
    groupName: 'Group Name',
    linkEditIndex: -1,
    onFileDownload: (id: string) => alert(`Download file: ${id}`),
    onFileDelete: (assignmentId: number, fileId: string) => alert(`Delete file: ${fileId} from assignment ${assignmentId}`),
    onLinkDelete: (assignmentId: number, linkId: number) => alert(`Delete link: ${linkId} from assignment ${assignmentId}`),
    onChange: (files, links, linkEditIndex) => alert(`Files changed: ${files.length}, Links: ${links.length}`),
    onImageChange: () => alert('Image changed'),
    onClickCourse: () => alert('Course clicked: Course Title'),
    onClickUser: () => alert('User clicked: Full Name'),
    onClickGroup: () => alert('Group clicked: Group Name'),
    onClickView: () => alert('View assignment 101'),
    onReplyFileDelete: () => alert('Reply file deleted'),
    onReplyLinkDelete: () => alert('Reply link deleted'),
    onDeleteIcon: () => alert('Delete icon clicked'),
    onReplyImageChange: () => alert('Reply image changed'),
    onReplyDeleteIcon: () => alert('Reply delete icon clicked'),
    onReplyChange: () => alert('Reply changed'),
    replyLinkEditIndex: -1,
    locale: 'en',
  },
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
