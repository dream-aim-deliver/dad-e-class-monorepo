import { Meta, StoryObj } from '@storybook/react-vite';
import CoachingOfferingModal from '../../lib/components/coaching-offering-modal';
import { Dialog, DialogContent, DialogTrigger } from '../../lib/components/dialog';
import { Button } from '../../lib/components/button';

const meta: Meta<typeof CoachingOfferingModal> = {
    title: 'Components/CoachingOfferingModal',
    component: CoachingOfferingModal,
    tags: ['docs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        mode: {
            control: 'radio',
            options: ['create', 'edit'],
            description: 'Modal mode: create or edit',
        },
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
    },
};

export default meta;
type Story = StoryObj<typeof CoachingOfferingModal>;

export const CreateMode: Story = {
    args: {
        locale: 'en',
        mode: 'create',
        onSave: (data) => console.log('Save clicked with data:', data),
        onClose: () => console.log('Close clicked'),
    },
};

export const CreateModeGerman: Story = {
    args: {
        locale: 'de',
        mode: 'create',
        onSave: (data) => console.log('Save clicked with data:', data),
        onClose: () => console.log('Close clicked'),
    },
};

export const EditMode: Story = {
    args: {
        locale: 'en',
        mode: 'edit',
        initialValue: {
            title: '1/2 day workshop',
            description: 'Write a brief description to be shown in the tooltip',
            duration: '240',
            price: '800 CHF',
        },
        onSave: (data) => console.log('Save clicked with data:', data),
        onDelete: () => console.log('Delete clicked'),
        onClose: () => console.log('Close clicked'),
    },
};

export const EditModeGerman: Story = {
    args: {
        locale: 'de',
        mode: 'edit',
        initialValue: {
            title: '1/2 Tages-Workshop',
            description: 'Kurze Beschreibung für den Tooltip',
            duration: '240',
            price: '800 CHF',
        },
        onSave: (data) => console.log('Save clicked with data:', data),
        onDelete: () => console.log('Delete clicked'),
        onClose: () => console.log('Close clicked'),
    },
};

export const InDialog: Story = {
    args: {
        locale: 'en',
        mode: 'create',
        onSave: (data) => {
            console.log('Save clicked with data:', data);
        },
        onClose: () => console.log('Close clicked'),
    },
    render: (args) => (
        <Dialog
            open={undefined}
            onOpenChange={() => {
                console.log('Dialog Opened/Closed');
            }}
            defaultOpen={false}
        >
            <DialogTrigger asChild>
                <Button
                    variant="primary"
                    size="medium"
                    text="Create Coaching Offering"
                />
            </DialogTrigger>
            <DialogContent
                showCloseButton={true}
                closeOnOverlayClick
                closeOnEscape
            >
                <div className="p-6">
                    <CoachingOfferingModal {...args} />
                </div>
            </DialogContent>
        </Dialog>
    ),
};

export const InDialogEditMode: Story = {
    args: {
        locale: 'en',
        mode: 'edit',
        initialValue: {
            title: '1/2 day workshop',
            description: 'Write a brief description to be shown in the tooltip',
            duration: '240',
            price: '800 CHF',
        },
        onSave: (data) => {
            console.log('Save clicked with data:', data);
        },
        onDelete: () => console.log('Delete clicked'),
        onClose: () => console.log('Close clicked'),
    },
    render: (args) => (
        <Dialog
            open={undefined}
            onOpenChange={() => {
                console.log('Dialog Opened/Closed');
            }}
            defaultOpen={false}
        >
            <DialogTrigger asChild>
                <Button
                    variant="primary"
                    size="medium"
                    text="Edit Coaching Offering"
                />
            </DialogTrigger>
            <DialogContent
                showCloseButton={true}
                closeOnOverlayClick
                closeOnEscape
            >
                <div className="p-6">
                    <CoachingOfferingModal {...args} />
                </div>
            </DialogContent>
        </Dialog>
    ),
};
