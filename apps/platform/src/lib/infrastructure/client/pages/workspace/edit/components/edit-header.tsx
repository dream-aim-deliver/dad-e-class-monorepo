import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import {
    Button,
    IconEyeShow,
    IconEyeHide,
    IconSave,
} from '@maany_shr/e-class-ui-kit';

interface EditHeaderProps {
    title: string;
    onPreview: () => void;
    onSave: () => void;
    disablePreview: boolean;
    isSaving: boolean;
    isPreviewing?: boolean;
    locale: TLocale;
}

export default function EditHeader({
    title,
    onPreview,
    onSave,
    disablePreview,
    isSaving,
    isPreviewing = false,
    locale,
}: EditHeaderProps) {
    const dictionary = getDictionary(locale);

    const previewButtonText = isPreviewing
        ? dictionary.components.editHeader.hidePreviewText
        : disablePreview
          ? dictionary.components.editHeader.saveToPreviewText
          : dictionary.components.editHeader.previewText;

    return (
        <div className="flex md:flex-row flex-col md:items-center justify-between gap-5">
            <h1>{title}</h1>
            <div className="flex sm:flex-row flex-col sm:items-center gap-3">
                <Button
                    variant="text"
                    iconLeft={isPreviewing ? <IconEyeHide /> : <IconEyeShow />}
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
                    text={
                        isSaving
                            ? dictionary.components.editHeader.savingText
                            : dictionary.components.editHeader.saveDraftText
                    }
                    onClick={onSave}
                    disabled={isSaving || isPreviewing}
                />
            </div>
        </div>
    );
}
