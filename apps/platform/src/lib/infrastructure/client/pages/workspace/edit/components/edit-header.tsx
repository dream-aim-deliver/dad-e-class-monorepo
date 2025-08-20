import {
    Button,
    IconEyeShow,
    IconSave,
    PageTitle,
} from '@maany_shr/e-class-ui-kit';

interface EditHeaderProps {
    title: string;
    onPreview: () => void;
    onSave: () => void;
    disablePreview: boolean;
    isSaving: boolean;
    isPreviewing?: boolean;
}

export default function EditHeader({
    title,
    onPreview,
    onSave,
    disablePreview,
    isSaving,
    isPreviewing = false,
}: EditHeaderProps) {
    const previewButtonText = isPreviewing
        ? 'Hide preview'
        : disablePreview
          ? 'Save to preview'
          : 'Preview';

    return (
        <div className="flex md:flex-row flex-col md:items-center justify-between gap-4">
            <PageTitle text={title} />
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <Button
                    variant="text"
                    iconLeft={<IconEyeShow />}
                    hasIconLeft
                    text={previewButtonText}
                    className="px-0"
                    onClick={onPreview}
                    disabled={disablePreview || isSaving}
                />
                <Button
                    variant="primary"
                    iconLeft={<IconSave />}
                    hasIconLeft
                    text={isSaving ? 'Saving...' : 'Save draft'}
                    onClick={onSave}
                    disabled={isSaving || isPreviewing}
                />
            </div>
        </div>
    );
}
