import { Meta, StoryObj } from '@storybook/react-vite';
import { OneOutOfThree, OneOutOfThreeData } from '../lib/components/out-of-three/one-out-of-three';
import { useState } from 'react';

/**
 * Mock messages for translations.
 */
const mockMessages = {
  oneOutOfThree: '1 out of 3',
  tableTitle: 'Table Title',
  columnTitle: 'Column Title',
  rowTitle: 'Row Title',
  addRow: 'Add Row',
  deleteRow: 'Delete Row', // Added delete row text
};

/**
 * Storybook configuration for the OneOutOfThree component.
 * The component allows creating and managing a table with rows where each row has three options,
 * and only one option can be selected. Each row can be deleted using the trash icon button.
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

// Wrapper component to handle state
const OneOutOfThreeWithState = ({ initialData }: { initialData: OneOutOfThreeData }) => {
  const [data, setData] = useState<OneOutOfThreeData>(initialData);
  return (
    <OneOutOfThree
      locale="en"
      data={data}
      onUpdate={(updatedData) =>{ 
        console.log('Updated data:', updatedData);
        setData(updatedData)}}
    />
  );
};

/**
 * Interactive story for the OneOutOfThree component.
 * Shows basic functionality with two rows that can be edited or deleted.
 * Each row has a trash icon button that allows removal of that specific row.
 */
export const Default: Story = {
  render: () => {
    const initialData: OneOutOfThreeData = {
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
    };
    return <OneOutOfThreeWithState initialData={initialData} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A component that allows users to select one option out of three for each row in a table. Each row can be deleted using the trash icon button on the right. You can also add new rows using the "Add Choice" button at the bottom.',
      },
    },
  },
};

/**
 * Empty state story for the OneOutOfThree component.
 * Shows the initial state with one empty row that can be filled or deleted.
 */
export const Empty: Story = {
  render: () => {
    const initialData: OneOutOfThreeData = {
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
    };
    return <OneOutOfThreeWithState initialData={initialData} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty state of the OneOutOfThree component with no pre-filled data. Contains one blank row that can be edited or deleted. Additional rows can be added using the "Add Choice" button.',
      },
    },
  },
};

/**
 * Multiple rows story for the OneOutOfThree component.
 * Demonstrates how the component handles multiple rows with different questions and options.
 * Each row has its own delete button for easy removal.
 */
export const MultipleRows: Story = {
  render: () => {
    const initialData: OneOutOfThreeData = {
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
    };
    return <OneOutOfThreeWithState initialData={initialData} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A OneOutOfThree component with multiple rows of questions and options. Shows how the component handles a larger set of data. Each row can be independently deleted using the trash icon, and new rows can be added as needed.',
      },
    },
  },
};
