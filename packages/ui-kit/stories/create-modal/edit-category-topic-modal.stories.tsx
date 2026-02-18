import { Meta, StoryObj } from '@storybook/react-vite';
import CreateEditCategoryTopicModal from '../../lib/components/create-modal/create-edit-category-topic-modal';
import { Dialog, DialogContent, DialogTrigger } from '../../lib/components/dialog';

const meta: Meta = {
    title: 'Components/EditCategoryTopicModal',
    component: CreateEditCategoryTopicModal,
    tags: ['docs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;

export const CreateCategory: StoryObj<typeof CreateEditCategoryTopicModal> = {
    args: {
        locale: 'en',
        mode: 'create',
        type: 'category',
        onSave: (name) => console.log('Save Category:', name),
        onClose: () => console.log('Modal Closed'),
    },
};

export const EditCategory: StoryObj<typeof CreateEditCategoryTopicModal> = {
    args: {
        locale: 'en',
        mode: 'edit',
        type: 'category',
        initialValue: 'Campaigning',
        onSave: (name) => console.log('Save Category:', name),
        onDelete: () => console.log('Delete Category'),
        onClose: () => console.log('Modal Closed'),
    },
};

export const CreateTopic: StoryObj<typeof CreateEditCategoryTopicModal> = {
    args: {
        locale: 'en',
        mode: 'create',
        type: 'topic',
        onSave: (name) => console.log('Save Topic:', name),
        onClose: () => console.log('Modal Closed'),
    },
};

export const EditTopic: StoryObj<typeof CreateEditCategoryTopicModal> = {
    args: {
        locale: 'en',
        mode: 'edit',
        type: 'topic',
        initialValue: 'Marketing Strategies',
        onSave: (name) => console.log('Save Topic:', name),
        onDelete: () => console.log('Delete Topic'),
        onClose: () => console.log('Modal Closed'),
    },
};

export const InDialog: StoryObj<typeof CreateEditCategoryTopicModal> = {
    args: {
        locale: 'en',
        mode: 'create',
        type: 'category',
        onSave: (name) => console.log('Save Category:', name),
        onClose: () => console.log('Modal Closed'),
    },
    render: (args) => (
        <Dialog open={undefined} onOpenChange={() => {
            console.log('Dialog Opened/Closed');
        }} defaultOpen={false}>
            <DialogTrigger asChild><span>Open modal</span></DialogTrigger>
            <DialogContent showCloseButton={true} closeOnOverlayClick closeOnEscape>
                <div className="p-6">
                    <CreateEditCategoryTopicModal {...args} />
                </div>
            </DialogContent>
        </Dialog>
    ),
};
