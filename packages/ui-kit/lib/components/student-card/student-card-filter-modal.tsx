'use client';

import React, { useState } from 'react';
import { Button } from '../button';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconClose } from '../icons/icon-close';

export interface StudentCardFilterModel {
    studentName?: string;
    courseName?: string;
    assignmentStatus?: string[];
}

interface StudentCardFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: StudentCardFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<StudentCardFilterModel>;
}

/**
 * StudentCardFilterModal is a reusable modal component for filtering student cards in a grid or list.
 *
 * @param onApplyFilters Callback function triggered when the user applies filters. Receives the current `StudentCardFilterModel` object.
 * @param onClose Callback function triggered when the modal is closed (background or close button).
 * @param initialFilters Optional initial filter values to pre-populate the modal fields.
 * @param locale The locale used for translations and localization.
 *
 * @example
 * ```tsx
 * <StudentCardFilterModal
 *   onApplyFilters={(filters) => console.log('Filters applied:', filters)}
 *   onClose={() => console.log('Modal closed')}
 *   initialFilters={{ assignmentStatus: 'long-wait', studentName: 'Alice' }}
 *   locale="en"
 * />
 * ```
 */
export const StudentCardFilterModal: React.FC<StudentCardFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    locale,
}) => {
    const dictionary = getDictionary(locale).components.studentCardFilterModal;

    const [filters, setFilters] = useState<Partial<StudentCardFilterModel>>({
        studentName: initialFilters.studentName || '',
        courseName: initialFilters.courseName || '',
        assignmentStatus: initialFilters.assignmentStatus || [],
    });

    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setFilters({
            studentName: undefined,
            courseName: undefined,
            assignmentStatus: [],
        });
        setResetKey((prev) => prev + 1);
    };

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleStatusToggle = (status: string) => {
        setFilters((prev) => {
            const currentStatuses = prev.assignmentStatus || [];
            const newStatuses = currentStatuses.includes(status)
                ? currentStatuses.filter((s) => s !== status)
                : [...currentStatuses, status];
            return { ...prev, assignmentStatus: newStatuses };
        });
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const availableStatuses = [
        { value: 'no-assignment', label: dictionary.noAssignmentStatus },
        { value: 'long-wait', label: dictionary.longWaitStatus },
        { value: 'waiting-feedback', label: dictionary.waitingFeedbackStatus },
        { value: 'course-completed', label: dictionary.courseCompletedStatus },
    ];

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50 mt-12" onClick={onClose}>
            <div className="relative flex flex-col gap-4 p-6 bg-card-fill text-text-primary w-full max-w-[430px] max-h-[85vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-2 right-2 sm:top-0 sm:right-0">
                    <Button
                        variant="text"
                        size="medium"
                        onClick={onClose}
                        hasIconLeft
                        iconLeft={<IconClose size="6" />}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                </div>

                <div className="h-px w-full bg-divider"></div>

                {/* Student Name Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.studentNameFilter}</h3>
                    <TextInput
                        label=""
                        key={`studentName-${resetKey}`}
                        inputField={{
                            id: 'studentName',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.studentName,
                            setValue: (value: string) => handleChange('studentName', value),
                            inputText: dictionary.studentNamePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Course Name Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.courseNameFilter}</h3>
                    <TextInput
                        label=""
                        key={`courseName-${resetKey}`}
                        inputField={{
                            id: 'courseName',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.courseName,
                            setValue: (value: string) => handleChange('courseName', value),
                            inputText: dictionary.courseNamePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Assignment Status Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.assignmentStatusFilter}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {availableStatuses.map((status) => (
                            <CheckBox
                                key={status.value}
                                name={status.value}
                                value={status.value}
                                label={
                                    <span
                                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={status.label}
                                    >
                                        {status.label}
                                    </span>
                                }
                                labelClass="text-white text-sm w-full"
                                checked={(filters.assignmentStatus || []).includes(status.value)}
                                withText
                                onChange={() => handleStatusToggle(status.value)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="medium"
                        onClick={handleReset}
                        className="flex-1"
                        text={dictionary.resetFilters}
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        onClick={handleApply}
                        className="flex-1"
                        text={dictionary.applyFilters}
                    />
                </div>
            </div>
        </div>
    );
};