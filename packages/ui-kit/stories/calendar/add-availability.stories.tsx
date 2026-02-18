import type { Meta, StoryObj } from '@storybook/react-vite';
import AvailabilityManager from '../../lib/components/calendar/add-availability/availability-manager';
import DeleteAvailabilityConfirmation from '../../lib/components/calendar/add-availability/delete-availability-confirmation';
import DeleteAvailabilitySuccess from '../../lib/components/calendar/add-availability/delete-availability-success';
import React, { useState } from 'react';
import { TAvailability, TRecurringAvailability, TSingleAvailability } from "../../lib/components/calendar/add-availability/availability-manager";

const meta: Meta<typeof AvailabilityManager> = {
  title: 'Components/AvailabilityManager',
  component: AvailabilityManager,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    availability: {
      control: 'object',
      description: 'The availability object to edit, if any.',
    },
    isLoading: {
      control: 'boolean',
      defaultValue: false,
      description: 'Whether the component is in a loading state.',
    },
    isError: {
      control: 'boolean',
      defaultValue: false,
      description: 'Whether the component is in an error state.',
    },
    onSave: {
      action: 'saved',
      description: 'Callback when the availability is saved.',
    },
    onDelete: {
      action: 'deleted',
      description: 'Callback when the availability is deleted.',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback when the action is cancelled.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
      description: 'The locale for internationalization.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof AvailabilityManager>;

const sampleSingleAvailability: TSingleAvailability = {
  id: 1,
  type: 'single',
  date: '2025/12/31',
  startTime: '12:00',
  endTime: '14:00',
};

const sampleRecurringAvailability: TRecurringAvailability = {
  id: 2,
  type: 'recurring',
  days: ['Monday', 'Wednesday'],
  startTime: '12:00',
  endTime: '14:00',
  startDate: '2025/01/01',
  expirationDate: '2025/12/31',
};

/**
 * Displays availability data in a formatted way for both console and alert
 */
const displayAvailabilityData = (operation: string, availability: TAvailability) => {
  // Format availability data for display
  const formattedData = JSON.stringify(availability, null, 2);
  
  // Log to console for developers
  console.log(`${operation} Availability Data:`, availability);
  
  // Show prettier alert to users
  const displayText = `${operation} Availability Data:\n\n${formattedData}`;
  alert(displayText);
};

const AvailabilityManagerWithState: React.FC<React.ComponentProps<typeof AvailabilityManager>> = (props) => {
  const [isLoading, setIsLoading] = useState(props.isLoading || false);
  const [isError, setIsError] = useState(props.isError || false);

  const handleSave = async (availability: TAvailability) => {
    setIsLoading(true);
    console.log('Sending to backend:', availability);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (Math.random() > 0.7) {
      setIsError(true);
      console.error('Failed to save:', availability);
      setIsLoading(false);
      alert('Error: Failed to save availability');
      return;
    }
    
    setIsLoading(false);
    props.onSave?.(availability);
    
    // Display the saved data
    displayAvailabilityData('Saved', availability);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    console.log('Deleting availability with ID:', id);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (Math.random() > 0.7) {
      setIsError(true);
      console.error('Failed to delete availability with ID:', id);
      setIsLoading(false);
      alert('Error: Failed to delete availability');
      return;
    }
    
    setIsLoading(false);
    props.onDelete?.(id);
    
    // For delete operations, show what was deleted
    const availabilityData = props.availability || { id, type: 'unknown' };
    displayAvailabilityData('Deleted', availabilityData as TAvailability);
  };

  return (
    <AvailabilityManager
      {...props}
      isLoading={isLoading}
      isError={isError}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
};

export const AddSingleAvailability: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component for adding a new single availability slot.',
      },
    },
  },
};

export const AddRecurringAvailability: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component for adding a new recurring availability slot.',
      },
    },
  },
};

export const EditSingleAvailability: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    availability: sampleSingleAvailability,
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component for editing an existing single availability slot.',
      },
    },
  },
};

export const EditRecurringAvailability: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    availability: sampleRecurringAvailability,
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component for editing an existing recurring availability slot.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    isLoading: true,
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component in a loading state.',
      },
    },
  },
};

export const ErrorState: Story = {
  render: (args) => <AvailabilityManagerWithState {...args} />,
  args: {
    locale: 'en',
    isError: true,
    onCancel: () => alert('Action cancelled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'The AvailabilityManager component in an error state.',
      },
    },
  },
};

/**
 * Helper to display deletion data in DeleteAvailabilityConfirmation
 */
const DeleteConfirmationWithState: React.FC<{
  availability: TAvailability;
  locale?: "en" | "de";
  isLoading?: boolean;
  isError?: boolean;
}> = ({ availability, locale = 'en', isLoading = false, isError = false }) => {
  const [loading, setLoading] = useState(isLoading);
  const [error, setError] = useState(isError);

  const handleConfirm = async (id: number) => {
    setLoading(true);
    console.log('Sending delete request for ID:', id);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (Math.random() > 0.7) {
      setError(true);
      console.error('Failed to delete:', id);
      setLoading(false);
      alert('Error: Failed to delete availability');
      return;
    }
    
    setLoading(false);
    displayAvailabilityData('Deleted', availability);
  };

  return (
    <DeleteAvailabilityConfirmation
      availability={availability}
      onConfirm={handleConfirm}
      onCancel={() => alert('Delete cancelled')}
      locale={locale}
      isLoading={loading}
      isError={error}
    />
  );
};

export const DeleteConfirmationSingle: Story = {
  render: (args) => (
    <DeleteConfirmationWithState
      availability={sampleSingleAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isLoading: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilityConfirmation component for a single availability slot.',
      },
    },
  },
};

export const DeleteConfirmationRecurring: Story = {
  render: (args) => (
    <DeleteConfirmationWithState
      availability={sampleRecurringAvailability}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isLoading: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilityConfirmation component for a recurring availability slot.',
      },
    },
  },
};

export const DeleteConfirmationLoading: Story = {
  render: (args) => (
    <DeleteAvailabilityConfirmation
      availability={sampleSingleAvailability}
      onConfirm={(id) => {
        console.log('Deleting ID:', id);
        alert(`Deleting availability ${id}`);
      }}
      onCancel={() => alert('Delete cancelled')}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isLoading: true,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilityConfirmation component in a loading state.',
      },
    },
  },
};

export const DeleteConfirmationError: Story = {
  render: (args) => (
    <DeleteAvailabilityConfirmation
      availability={sampleSingleAvailability}
      onConfirm={(id) => {
        console.log('Deleting ID:', id);
        alert(`Deleting availability ${id}`);
      }}
      onCancel={() => alert('Delete cancelled')}
      {...args}
    />
  ),
  args: {
    locale: 'en',
    isLoading: false,
    isError: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilityConfirmation component in an error state.',
      },
    },
  },
};

export const DeleteSuccessSingle: Story = {
  render: (args) => (
    <DeleteAvailabilitySuccess
      availability={sampleSingleAvailability}
      onClose={() => {
        console.log('Successfully deleted:', sampleSingleAvailability);
        alert('Delete success screen closed');
      }}
      {...args}
    />
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilitySuccess component for a single availability slot.',
      },
    },
  },
};

export const DeleteSuccessRecurring: Story = {
  render: (args) => (
    <DeleteAvailabilitySuccess
      availability={sampleRecurringAvailability}
      onClose={() => {
        console.log('Successfully deleted:', sampleRecurringAvailability);
        alert('Delete success screen closed');
      }}
      {...args}
    />
  ),
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'The DeleteAvailabilitySuccess component for a recurring availability slot.',
      },
    },
  },
};