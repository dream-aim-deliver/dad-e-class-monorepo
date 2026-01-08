'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogBody } from '../dialog';
import { Button } from '../button';
import Banner from '../banner';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

export interface DuplicateLessonDialogModule {
    id: number;
    title: string;
}

export interface DuplicateLessonDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    modules: DuplicateLessonDialogModule[];
    onConfirm: (moduleId: number) => void;
    locale: TLocale;
    isLoading?: boolean;
    errorMessage?: string;
}

/**
 * Dialog for selecting a target module when duplicating a lesson.
 */
export function DuplicateLessonDialog({
    isOpen,
    onOpenChange,
    modules,
    onConfirm,
    locale,
    isLoading = false,
    errorMessage,
}: DuplicateLessonDialogProps) {
    const dictionary = getDictionary(locale);
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

    const handleConfirm = () => {
        if (selectedModuleId !== null) {
            onConfirm(selectedModuleId);
        }
    };

    const handleCancel = () => {
        setSelectedModuleId(null);
        onOpenChange(false);
    };

    const handleModuleClick = (moduleId: number) => {
        setSelectedModuleId(moduleId);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent
                className="max-w-lg"
                showCloseButton={true}
                closeOnOverlayClick={false}
                closeOnEscape={true}
            >
                <DialogBody className="p-0">
                    <div className="flex flex-col w-full gap-5">
                        <h3 className="text-xl text-text-primary">
                            {dictionary.components.duplicateLessonDialog.title}
                        </h3>
                        <p className="text-text-secondary text-sm">
                            {dictionary.components.duplicateLessonDialog.description}
                        </p>

                        <div className="flex flex-col gap-2">
                            <label className="text-text-primary text-sm">
                                {dictionary.components.duplicateLessonDialog.selectModule}
                            </label>
                            <ul className="flex flex-col max-h-60 overflow-y-auto rounded-medium border border-base-neutral-700">
                                {modules.map((module) => (
                                    <li
                                        key={module.id}
                                        className={`p-4 cursor-pointer hover:bg-base-neutral-700 ${
                                            selectedModuleId === module.id
                                                ? 'bg-base-neutral-700 text-button-text-text'
                                                : 'text-text-primary'
                                        }`}
                                        onClick={() => handleModuleClick(module.id)}
                                    >
                                        <span className="text-sm">{module.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {errorMessage && (
                            <Banner
                                style="error"
                                title={errorMessage}
                                icon={true}
                            />
                        )}

                        <div className="flex justify-end gap-3 mt-2">
                            <Button
                                variant="secondary"
                                text={dictionary.components.duplicateLessonDialog.cancel}
                                onClick={handleCancel}
                                disabled={isLoading}
                            />
                            <Button
                                variant="primary"
                                text={dictionary.components.duplicateLessonDialog.confirm}
                                onClick={handleConfirm}
                                disabled={selectedModuleId === null || isLoading}
                            />
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
