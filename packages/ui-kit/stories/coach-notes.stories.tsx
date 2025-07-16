import React from 'react';

import { CoachNotesCreate, CoachNotesView } from '../lib/components/coach/coach-notes';
import type { Descendant } from 'slate';

// Simple Slate Descendant[] mock for demonstration
const sampleDescription: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is a sample note description with ' },
      { text: 'bold', bold: true },
      { text: ' and ' },
      { text: 'italic', italic: true },
      { text: '.' },
    ],
  },
];

const sampleLinks = [
  {
    title: 'Storybook',
    url: 'https://storybook.js.org',
    customIconMetadata: undefined,
  },
  {
    title: 'E-Class',
    url: 'https://e-class.example.com',
    customIconMetadata: undefined,
  },
];

const emptyDescription: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  },
];

export default {
  title: 'Components/CoachNotes',
  component: CoachNotesCreate,
  subcomponents: { CoachNotesView },
};

export const DefaultEditable = () => (
  <CoachNotesCreate
    noteDescription={JSON.stringify(emptyDescription)}
    noteLinks={sampleLinks}
    includeInMaterials={true}
    locale="en"
    onPublish={() => alert('onPublish')}
  />
);

export const ViewOnly = () => (
  <CoachNotesView
    noteDescription={JSON.stringify(emptyDescription)}
    noteLinks={sampleLinks}
    includeInMaterials={true}
    locale="en"
    onExploreCourses={() => alert('onExploreCourses')}
  />
);

export const EmptyState = () => (
  <CoachNotesView
    noteDescription={JSON.stringify(emptyDescription)}
    noteLinks={[]}
    includeInMaterials={false}
    locale="en"
    onExploreCourses={() => alert('onExploreCourses')}
  />
);

export const EditableEmptyLinks = () => (
  <CoachNotesCreate
    noteDescription={JSON.stringify(emptyDescription)}
    noteLinks={[]}
    includeInMaterials={false}
    locale="en"
    onPublish={() => alert('onPublish')}
  />
);
