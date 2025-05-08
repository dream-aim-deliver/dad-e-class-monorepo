import { Meta, StoryObj } from '@storybook/react';
import {  OneOutOfThree, OneOutOfThreeData } from '../lib/components/out-of-three/one-out-of-three';
import React, { useState } from 'react';

/**
 * Mock messages for translations.
 */
const mockMessages = {
  oneOutOfThree: '1 out of 3',
  tableTitle: 'Table Title',
  columnTitle: 'Column Title',
  rowTitle: 'Row Title',
  addRow: 'Add Row',
};

/**
 * Storybook configuration for the OneOutOfThree component.
 */
const meta: Meta<typeof OneOutOfThree> = {
  title: 'Components/OneOutOfThree/OneOutOfThreeEdit',
  component: OneOutOfThree,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof OneOutOfThree>;

/**
 * Interactive story for the OneOutOfThree component
 */
export const Default: Story = {
  render: function Render() {
    const [data, setData] = useState<OneOutOfThreeData>({
      tableTitle: "Sample Table",
      rows: [
        {
          rowTitle: "Question 1",
          columns: [
            { columnTitle: "Option A", selected: true },
            { columnTitle: "Option B", selected: false },
            { columnTitle: "Option C", selected: false },
          ],
        },
        {
          rowTitle: "Question 2",
          columns: [
            { columnTitle: "Option A", selected: false },
            { columnTitle: "Option B", selected: true },
            { columnTitle: "Option C", selected: false },
          ],
        },
      ],
    });

    return (
      <OneOutOfThree
      locale="en"
        data={data}
        onUpdate={(updatedData) => setData(updatedData)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A component that allows users to select one option out of three for each row in a table.',
      },
    },
  },
};

/**
 * Empty state story for the OneOutOfThree component
 */
export const Empty: Story = {
  render: function Render() {
    const [data, setData] = useState<OneOutOfThreeData>({
      tableTitle: "",
      rows: [
        {
          rowTitle: "",
          columns: [
            { columnTitle: "", selected: false },
            { columnTitle: "", selected: false },
            { columnTitle: "", selected: false },
          ],
        },
      ],
    });

    return (
      <OneOutOfThree
      locale="en"
        data={data}
        onUpdate={(updatedData) => setData(updatedData)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty state of the OneOutOfThree component with no pre-filled data.',
      },
    },
  },
};

/**
 * Multiple rows story for the OneOutOfThree component
 */
export const MultipleRows: Story = {
  render: function Render() {
    const [data, setData] = useState<OneOutOfThreeData>({
      tableTitle: "Evaluation Form",
      rows: [
        {
          rowTitle: "Question 1: How satisfied are you?",
          columns: [
            { columnTitle: "Not Satisfied", selected: false },
            { columnTitle: "Neutral", selected: true },
            { columnTitle: "Very Satisfied", selected: false },
          ],
        },
        {
          rowTitle: "Question 2: Would you recommend us?",
          columns: [
            { columnTitle: "No", selected: false },
            { columnTitle: "Maybe", selected: false },
            { columnTitle: "Yes", selected: true },
          ],
        },
        {
          rowTitle: "Question 3: Will you use our service again?",
          columns: [
            { columnTitle: "No", selected: false },
            { columnTitle: "Maybe", selected: true },
            { columnTitle: "Yes", selected: false },
          ],
        },
        {
          rowTitle: "Question 4: Rate our customer service",
          columns: [
            { columnTitle: "Poor", selected: false },
            { columnTitle: "Good", selected: false },
            { columnTitle: "Excellent", selected: true },
          ],
        },
      ],
    });

    return (
      <OneOutOfThree
      locale="en"
        data={data}
        onUpdate={(updatedData) => setData(updatedData)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A OneOutOfThree component with multiple rows of questions and options.',
      },
    },
  },
};
