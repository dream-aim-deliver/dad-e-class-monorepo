import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// Assignment filter interface
export interface AssignmentFilterModel {
    title?: string;
    status?: string[];
    course?: string;
    module?: string;
    lesson?: string;
    student?: string;
    groupName?: string;
    dateFrom?: Date;
    dateTo?: Date;
    hasFiles?: boolean;
    hasLinks?: boolean;
    hasReplies?: boolean;
}

interface AssignmentCardFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: AssignmentFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<AssignmentFilterModel>;
    availableStatuses: string[];
    availableCourses: string[];
    availableModules: string[];
    availableLessons: string[];
}

export const AssignmentCardFilterModal: React.FC<AssignmentCardFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    availableStatuses,
    availableCourses,
    availableModules,
    availableLessons,
    locale,
}) => {
    const dictionary = getDictionary(locale).components.assignmentGridFilterModal;
    
    const [filters, setFilters] = useState<Partial<AssignmentFilterModel>>({
        title: initialFilters.title,
        status: initialFilters.status || [],
        course: initialFilters.course,
        module: initialFilters.module,
        lesson: initialFilters.lesson,
        student: initialFilters.student,
        groupName: initialFilters.groupName,
        dateFrom: initialFilters.dateFrom,
        dateTo: initialFilters.dateTo,
        hasFiles: initialFilters.hasFiles,
        hasLinks: initialFilters.hasLinks,
        hasReplies: initialFilters.hasReplies,
    });

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleStatusToggle = (status: string) => {
        setFilters((prev) => {
            const currentStatuses = prev.status || [];
            const updatedStatuses = currentStatuses.includes(status)
                ? currentStatuses.filter((s) => s !== status)
                : [...currentStatuses, status];
            return { ...prev, status: updatedStatuses };
        });
    };

    // This key is required to force re-render the modal when filters are reset.
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        setFilters({
            title: undefined,
            status: [],
            course: undefined,
            module: undefined,
            lesson: undefined,
            student: undefined,
            groupName: undefined,
            dateFrom: undefined,
            dateTo: undefined,
            hasFiles: undefined,
            hasLinks: undefined,
            hasReplies: undefined,
        });
        setResetKey(prev => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as AssignmentFilterModel);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[450px] h-full max-h-[90vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-0 right-0">
                    <Button variant="text" size="medium" hasIconLeft iconLeft={<IconClose size="8" />} onClick={onClose} />
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{dictionary.title}</h2>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Title Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.titleSection}</h3>
                    <TextInput
                        label=""
                        key={`title-${resetKey}`}
                        inputField={{
                            id: 'title',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.title,
                            setValue: (value: string) => handleChange('title', value || undefined),
                            inputText: dictionary.titlePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Status Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.statusSection}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {availableStatuses.map((status) => (
                            <CheckBox
                                key={status}
                                name={status}
                                value={status}
                                label={
                                    <span
                                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={status}
                                    >
                                        {status}
                                    </span>
                                }
                                labelClass="text-white text-sm w-full"
                                checked={(filters.status || []).includes(status)}
                                withText
                                onChange={() => handleStatusToggle(status)}
                            />
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Course Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.courseSection}</h3>
                    <TextInput
                        label=""
                        key={`course-${resetKey}`}
                        inputField={{
                            id: 'course',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.course,
                            setValue: (value: string) => handleChange('course', value || undefined),
                            inputText: dictionary.coursePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Module Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.moduleSection}</h3>
                    <TextInput
                        label=""
                        key={`module-${resetKey}`}
                        inputField={{
                            id: 'module',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.module,
                            setValue: (value: string) => handleChange('module', value || undefined),
                            inputText: dictionary.modulePlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Lesson Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.lessonSection}</h3>
                    <TextInput
                        label=""
                        key={`lesson-${resetKey}`}
                        inputField={{
                            id: 'lesson',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.lesson,
                            setValue: (value: string) => handleChange('lesson', value || undefined),
                            inputText: dictionary.lessonPlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Student Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.studentSection}</h3>
                    <TextInput
                        label=""
                        key={`student-${resetKey}`}
                        inputField={{
                            id: 'student',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.student,
                            setValue: (value: string) => handleChange('student', value || undefined),
                            inputText: dictionary.studentPlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Group Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.groupSection}</h3>
                    <TextInput
                        label=""
                        key={`group-${resetKey}`}
                        inputField={{
                            id: 'groupName',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.groupName,
                            setValue: (value: string) => handleChange('groupName', value || undefined),
                            inputText: dictionary.groupPlaceholder,
                        }}
                    />
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Date Range Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.dateRangeSection}</h3>
                    <div className="flex gap-2">
                        <DateInput
                            label={dictionary.dateFromLabel}
                            key={`dateFrom-${resetKey}`}
                            value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                            onChange={(dateString) => handleChange('dateFrom', dateString ? new Date(dateString) : undefined)}
                            locale={locale}
                        />
                        <DateInput
                            label={dictionary.dateToLabel}
                            key={`dateTo-${resetKey}`}
                            value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                            onChange={(dateString) => handleChange('dateTo', dateString ? new Date(dateString) : undefined)}
                            locale={locale}
                        />
                    </div>
                </div>
                <div className="h-px w-full bg-divider"></div>

                {/* Content Filters Section */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">{dictionary.contentSection}</h3>
                    <div className="flex flex-col gap-3">
                        <CheckBox
                            name="hasFiles"
                            value="hasFiles"
                            label={dictionary.hasFilesLabel}
                            labelClass="text-white text-sm"
                            checked={filters.hasFiles || false}
                            withText
                            onChange={(checked) => handleChange('hasFiles', checked)}
                        />
                        <CheckBox
                            name="hasLinks"
                            value="hasLinks"
                            label={dictionary.hasLinksLabel}
                            labelClass="text-white text-sm"
                            checked={filters.hasLinks || false}
                            withText
                            onChange={(checked) => handleChange('hasLinks', checked)}
                        />
                        <CheckBox
                            name="hasReplies"
                            value="hasReplies"
                            label={dictionary.hasRepliesLabel}
                            labelClass="text-white text-sm"
                            checked={filters.hasReplies || false}
                            withText
                            onChange={(checked) => handleChange('hasReplies', checked)}
                        />
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
