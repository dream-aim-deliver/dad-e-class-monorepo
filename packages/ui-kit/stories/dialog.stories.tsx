import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogBody, 
  DialogClose 
} from '../lib/components/dialog';
import { Button } from '../lib/components/button';
import { IconTrashAlt } from '../lib/components/icons/icon-trash-alt';
import { IconCheck } from '../lib/components/icons/icon-check';
import { IconError } from '../lib/components/icons/icon-error';
import { IconInfoCircle } from '../lib/components/icons';


/**
 * Mock messages for translations.
 */
const mockMessages = {
  hello: 'Hello',
  world: 'World',
  confirm: 'Confirm',
  cancel: 'Cancel',
  delete: 'Delete',
  save: 'Save',
  close: 'Close',
};

/**
 * Storybook configuration for the Dialog component.
 */
const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A flexible dialog component built with compound components pattern. The Dialog component provides:

- **Dialog**: Root component that manages dialog state
- **DialogTrigger**: Button or element that opens the dialog
- **DialogContent**: The modal content container
- **DialogBody**: Content wrapper with consistent padding
- **DialogClose**: Button to close the dialog

The dialog supports controlled and uncontrolled modes, keyboard navigation (ESC to close), 
click outside to close, and customizable styling.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <div className="flex justify-center items-center min-h-[400px]">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls the open state of the dialog (controlled mode)',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled mode)',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Callback fired when the dialog open state changes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

/**
 * Basic dialog example with simple content.
 */
export const Basic: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="primary" text="Open Dialog" />
      </DialogTrigger>
      <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <h2 className="text-xl font-semibold mb-4">Basic Dialog</h2>
          <p className="text-text-secondary mb-6">
            This is a basic dialog with simple content. You can close it by clicking the X button,
            pressing ESC, or clicking outside the dialog.
          </p>
          <div className="flex justify-end gap-3">
            <DialogClose asChild={false}>
              <Button variant="secondary" text="Close" />
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  args: {
    defaultOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic dialog with a trigger button and simple content.',
      },
    },
  },
};

/**
 * Confirmation dialog for destructive actions.
 */
export const ConfirmationDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="primary" text="Delete Item" iconLeft={<IconTrashAlt />} hasIconLeft />
      </DialogTrigger>
      <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <IconError className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Delete Item</h2>
              <p className="text-text-secondary mb-6">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <DialogClose asChild={false}>
                  <Button variant="secondary" text="Cancel" />
                </DialogClose>
                <DialogClose asChild={false}>
                  <Button 
                    variant="primary" 
                    text="Delete" 
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  />
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A confirmation dialog for destructive actions with warning styling.',
      },
    },
  },
};

/**
 * Success dialog with custom styling.
 */
export const SuccessDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="primary" text="Complete Action" />
      </DialogTrigger>
      <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <IconCheck className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Success!</h2>
            <p className="text-text-secondary mb-6">
              Your action has been completed successfully. You can now continue with your workflow.
            </p>
            <DialogClose asChild={false}>
              <Button variant="primary" text="Continue" />
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A success dialog with centered content and custom styling.',
      },
    },
  },
};

/**
 * Information dialog with detailed content.
 */
export const InformationDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="secondary" text="View Information" iconLeft={<IconInfoCircle />} hasIconLeft />
      </DialogTrigger>
      <DialogContent className="max-w-lg" showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <IconInfoCircle  className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">Important Information</h2>
              <div className="text-text-secondary space-y-3 mb-6">
                <p>
                  This dialog contains important information that you should be aware of before proceeding.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Feature A is now available</li>
                  <li>Feature B has been updated</li>
                  <li>Feature C will be deprecated soon</li>
                </ul>
                <p>
                  Please review these changes and update your workflow accordingly.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild={false}>
                  <Button variant="secondary" text="Later" />
                </DialogClose>
                <DialogClose asChild={false}>
                  <Button variant="primary" text="Got it" />
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An information dialog with detailed content and multiple action buttons.',
      },
    },
  },
};

/**
 * Dialog with custom trigger using asChild prop.
 */
export const CustomTrigger: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <div className="p-4 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
          <p className="text-center text-text-secondary">
            Click anywhere in this area to open dialog
          </p>
        </div>
      </DialogTrigger>
      <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <h2 className="text-xl font-semibold mb-4">Custom Trigger</h2>
          <p className="text-text-secondary mb-6">
            This dialog was opened by clicking on a custom trigger element using the `asChild` prop.
            The trigger can be any clickable element, not just a button.
          </p>
          <div className="flex justify-end">
            <DialogClose asChild={false}>
              <Button variant="primary" text="Close" />
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog with a custom trigger element using the asChild prop.',
      },
    },
  },
};

/**
 * Dialog with custom close button using asChild.
 */
export const CustomCloseButton: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="primary" text="Open Dialog" />
      </DialogTrigger>
      <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
        <DialogBody>
          <h2 className="text-xl font-semibold mb-4">Custom Close Button</h2>
          <p className="text-text-secondary mb-6">
            This dialog demonstrates using the `asChild` prop with DialogClose to create
            custom close buttons that maintain the dialog's close functionality.
          </p>
          <div className="flex justify-between items-center">
            <DialogClose asChild>
              <button className="text-text-secondary hover:text-text-primary underline">
                Cancel and go back
              </button>
            </DialogClose>
            <DialogClose asChild={false}>
              <Button variant="primary" text="Save & Close" />
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog with custom close buttons using the asChild prop.',
      },
    },
  },
};

/**
 * Controlled dialog example.
 */
export const ControlledDialog: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-2">
            Dialog is currently: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
          </p>
          <Button 
            variant="secondary" 
            text={isOpen ? 'Close Dialog' : 'Open Dialog'}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        
        <Dialog {...args} open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild={false}>
            <Button variant="primary" text="Alternative Trigger" />
          </DialogTrigger>
          <DialogContent showCloseButton={true} closeOnOverlayClick={true} closeOnEscape={true}>
            <DialogBody>
              <h2 className="text-xl font-semibold mb-4">Controlled Dialog</h2>
              <p className="text-text-secondary mb-6">
                This dialog's open state is controlled by external state. You can open/close it
                using the button above or the trigger button.
              </p>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="secondary" 
                  text="External Close"
                  onClick={() => setIsOpen(false)}
                />
                <DialogClose asChild={false}>
                  <Button variant="primary" text="Dialog Close" />
                </DialogClose>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A controlled dialog where the open state is managed by external state.',
      },
    },
  },
};

/**
 * Dialog with disabled features.
 */
export const CustomBehavior: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild={false}>
        <Button variant="primary" text="Open Custom Dialog" />
      </DialogTrigger>
      <DialogContent 
        closeOnOverlayClick={false} 
        closeOnEscape={false}
        showCloseButton={false}
      >
        <DialogBody>
          <h2 className="text-xl font-semibold mb-4">Custom Behavior</h2>
          <p className="text-text-secondary mb-6">
            This dialog has custom behavior:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-1 mb-6">
            <li>No close button in the header</li>
            <li>Cannot be closed by clicking outside</li>
            <li>Cannot be closed with ESC key</li>
            <li>Must use the close button below</li>
          </ul>
          <div className="flex justify-end">
            <DialogClose asChild={false}>
              <Button variant="primary" text="Close Dialog" />
            </DialogClose>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog with customized behavior - disabled overlay click, ESC key, and close button.',
      },
    },
  },
};
