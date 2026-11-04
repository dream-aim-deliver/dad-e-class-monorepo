'use client';

import {
    Button,
    CoachNotesCreate,
    CoachNotesResultPopup,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogBody,
    DialogContent,
} from '@maany_shr/e-class-ui-kit';
import { fileMetadata, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { trpc } from '../trpc/cms-client';
import { useGetPackageGroupNoteTemplatePresenter } from '../hooks/use-get-package-group-note-template-presenter';
import { useSavePackageGroupNoteTemplatePresenter } from '../hooks/use-save-package-group-note-template-presenter';
import { usePackageGroupNoteTemplateIconUpload } from './common/hooks/use-package-group-note-template-icon-upload';

interface PackageGroupNoteTemplateEditorProps {
    locale: TLocale;
    packageId: number;
}

type TNoteLink = {
    url: string;
    title: string;
    customIconMetadata?: fileMetadata.TFileMetadata;
    id?: number;
};

type TTemplateLink = viewModels.TGetPackageGroupNoteTemplateSuccess['links'][number];

const toIconMetadata = (
    icon: NonNullable<TTemplateLink['icon']>,
): fileMetadata.TFileMetadata => ({
    id: icon.id,
    name: icon.name,
    size: icon.size,
    status: 'available',
    category: icon.category,
    url: icon.downloadUrl,
    thumbnailUrl: icon.downloadUrl,
});

const toNoteLink = (link: TTemplateLink): TNoteLink => ({
    url: link.url || '',
    title: link.title,
    id: link.id ? Number(link.id) : undefined,
    customIconMetadata: link.icon ? toIconMetadata(link.icon) : undefined,
});

/**
 * Button + modal for editing the package-level group note template.
 * The CMS is admin-only (enforced by middleware).
 * The template is fetched lazily, only while the modal is open.
 */
export default function PackageGroupNoteTemplateEditor({
    locale,
    packageId,
}: PackageGroupNoteTemplateEditorProps) {
    const t = useTranslations('pages.editPackage.groupNoteTemplate');

    const [isOpen, setIsOpen] = useState(false);
    const [isPrefilled, setIsPrefilled] = useState(false);
    const [noteDescription, setNoteDescription] = useState('');
    const [noteLinks, setNoteLinks] = useState<TNoteLink[]>([]);
    const [includeInMaterials, setIncludeInMaterials] = useState(false);
    const [saveRequestFailed, setSaveRequestFailed] = useState(false);

    const [templateViewModel, setTemplateViewModel] = useState<
        viewModels.TGetPackageGroupNoteTemplateViewModel | undefined
    >(undefined);
    const [saveViewModel, setSaveViewModel] = useState<
        viewModels.TSavePackageGroupNoteTemplateViewModel | undefined
    >(undefined);

    // Prefill the editor state as soon as the template is presented
    const handleTemplateViewModel = useCallback(
        (viewModel: viewModels.TGetPackageGroupNoteTemplateViewModel) => {
            setTemplateViewModel(viewModel);
            if (viewModel.mode === 'default') {
                setNoteDescription(viewModel.data.notes);
                setNoteLinks(viewModel.data.links.map(toNoteLink));
                setIncludeInMaterials(false);
                setIsPrefilled(true);
            }
        },
        [],
    );

    const { presenter: templatePresenter } = useGetPackageGroupNoteTemplatePresenter(handleTemplateViewModel);
    const { presenter: savePresenter } = useSavePackageGroupNoteTemplatePresenter(setSaveViewModel);
    const { handleFileUpload } = usePackageGroupNoteTemplateIconUpload();

    const utils = trpc.useUtils();

    // Only fetch while the modal is open
    const templateQuery = trpc.getPackageGroupNoteTemplate.useQuery(
        { packageId },
        { enabled: isOpen },
    );

    const saveMutation = trpc.savePackageGroupNoteTemplate.useMutation();

    // Present the template once fresh data is available (only until the editor is prefilled)
    useEffect(() => {
        if (!isOpen || isPrefilled || templateQuery.isFetching || !templateQuery.data) {
            return;
        }
        // @ts-ignore
        templatePresenter.present(templateQuery.data, templateViewModel);
    }, [isOpen, isPrefilled, templateQuery.data, templateQuery.isFetching, templatePresenter, templateViewModel]);

    const handleOpen = () => {
        setTemplateViewModel(undefined);
        setIsPrefilled(false);
        setIsOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setIsOpen(false);
        }
    };

    const handlePublish = async (description: string, links: TNoteLink[]) => {
        if (saveMutation.isPending) {
            return;
        }

        setSaveViewModel(undefined);
        setSaveRequestFailed(false);

        try {
            const result = await saveMutation.mutateAsync({
                packageId,
                notes: description,
                links: links.map((link) => ({
                    id: link.id ?? null,
                    title: link.title,
                    url: link.url,
                    iconFileId: link.customIconMetadata?.id
                        ? Number(link.customIconMetadata.id)
                        : null,
                })),
            });

            // @ts-ignore
            await savePresenter.present(result, saveViewModel);

            if (result.success === true) {
                await utils.getPackageGroupNoteTemplate.invalidate({ packageId });
            }
        } catch (error) {
            console.error('Failed to save package group note template:', error);
            setSaveRequestFailed(true);
        }

        setIsOpen(false);
    };

    const handleImageChange = async (
        _index: number,
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        return handleFileUpload(fileRequest, packageId, abortSignal);
    };

    const isLoadError =
        templateQuery.isError ||
        templateViewModel?.mode === 'kaboom' ||
        templateViewModel?.mode === 'not-found';

    const showResultPopup = saveViewModel !== undefined || saveRequestFailed;
    const isSaveSuccess = saveViewModel?.mode === 'default';
    const isSaveError =
        saveRequestFailed ||
        saveViewModel?.mode === 'kaboom' ||
        saveViewModel?.mode === 'not-found';

    return (
        <>
            <div className="flex justify-end">
                <Button
                    variant="secondary"
                    size="medium"
                    text={t('editButton')}
                    onClick={handleOpen}
                />
            </div>

            {/* Loading / error state while the template is not ready */}
            {isOpen && !isPrefilled && (
                <Dialog open={true} onOpenChange={handleOpenChange} defaultOpen={false}>
                    <DialogContent
                        showCloseButton
                        closeOnOverlayClick
                        closeOnEscape
                        className="max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <DialogBody>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold text-text-primary">
                                    {t('title')}
                                </h2>
                                {isLoadError ? (
                                    <DefaultError
                                        type="simple"
                                        locale={locale}
                                        title={t('loadErrorTitle')}
                                        description={t('loadErrorDescription')}
                                    />
                                ) : (
                                    <DefaultLoading locale={locale} variant="minimal" />
                                )}
                            </div>
                        </DialogBody>
                    </DialogContent>
                </Dialog>
            )}

            {/* Editor - mounted only after prefill so the editor initialises with the template */}
            {isOpen && isPrefilled && (
                <Dialog open={isOpen} onOpenChange={handleOpenChange} defaultOpen={false}>
                    <DialogContent
                        showCloseButton
                        closeOnOverlayClick={false}
                        closeOnEscape={!saveMutation.isPending}
                        disableCloseButton={saveMutation.isPending}
                        className="max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <DialogBody>
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold text-text-primary">
                                    {t('title')}
                                </h2>
                                <p className="text-text-secondary">
                                    {t('description')}
                                </p>
                                <CoachNotesCreate
                                    noteDescription={noteDescription}
                                    noteLinks={noteLinks}
                                    includeInMaterials={includeInMaterials}
                                    locale={locale}
                                    onPublish={handlePublish}
                                    onBack={() => setIsOpen(false)}
                                    onImageChange={handleImageChange}
                                    onDeleteIcon={() => undefined}
                                    onNoteLinksChange={setNoteLinks}
                                    onIncludeInMaterialsChange={setIncludeInMaterials}
                                    onNoteDescriptionChange={setNoteDescription}
                                    isEditMode={true}
                                    isLoading={saveMutation.isPending}
                                    variant="group"
                                />
                            </div>
                        </DialogBody>
                    </DialogContent>
                </Dialog>
            )}

            {/* Save result popup */}
            {showResultPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                    <CoachNotesResultPopup
                        onClose={() => {
                            setSaveViewModel(undefined);
                            setSaveRequestFailed(false);
                        }}
                        isSuccess={isSaveSuccess}
                        isError={isSaveError}
                        successMessage={t('saveSuccess')}
                        errorMessage={t('saveError')}
                        locale={locale}
                    />
                </div>
            )}
        </>
    );
}
