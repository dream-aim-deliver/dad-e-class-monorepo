import { Dialog, DialogContent, DialogBody } from '../dialog';
import { CoachNotesCreate, coachNotesProps } from './coach-notes';
import { getDictionary } from '@maany_shr/e-class-translations';


export interface coachNotesEditDialogProps extends coachNotesProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onBack: () => void;
}

/**
 * 
 * @param param0 Props for the CoachNotesEditDialog component
 * @param param0.isOpen Whether the dialog is open
 * @param param0.onOpenChange Function to change the open state of the dialog
 * @param param0.onBack Function to handle back navigation
 * @returns CoachNotesEditDialog component
 */
function CoachNotesEditDialog({
    isOpen,
    onOpenChange,
    onBack,
    locale,
    ...coachNotesProps
}: coachNotesEditDialogProps) {
    const dictionary = getDictionary(locale);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent
                className="max-w-xl max-h-[95vh] overflow-hidden"
                showCloseButton={true}
                closeOnOverlayClick={false}
                closeOnEscape={true}
            >
                <DialogBody className="p-0 overflow-y-auto max-h-[calc(95vh-120px)]">
                    <div className="flex flex-col w-full gap-5">
                        <h3 className="text-2xl text-text-primary capitalize">
                            {dictionary.components.coachNotes.editCoachNotes}
                        </h3>
                        <p className="text-text-primary">
                            {dictionary.components.coachNotes.description}
                        </p>

                        {/* Coach Notes Create Component in Edit Mode */}
                        <CoachNotesCreate
                            {...coachNotesProps}
                            locale={locale}
                            isEditMode={true}
                            onBack={onBack}
                        />
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

export { CoachNotesEditDialog };
