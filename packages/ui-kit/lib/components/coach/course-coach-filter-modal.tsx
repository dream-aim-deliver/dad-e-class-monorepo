import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { IconClose } from '../icons/icon-close';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// Coach filter interface
export interface CourseCoachFilterModel {
    coachId?: number;
    name?: string;
    minRating?: number;
    maxRating?: number;
    languages?: string[];
    skills?: string[];
    minSessionCount?: number;
    maxSessionCount?: number;
}

interface CourseCoachFilterModalProps extends isLocalAware {
    onApplyFilters: (filters: CourseCoachFilterModel) => void;
    onClose: () => void;
    initialFilters?: Partial<CourseCoachFilterModel>;
    languages: string[];
    skills: string[];
}

export const CourseCoachFilterModal: React.FC<CourseCoachFilterModalProps> = ({
    onApplyFilters,
    onClose,
    initialFilters = {},
    languages,
    skills,
    locale,
}) => {

    const dictionary = getDictionary(locale).components.coachFilterModal; const [filters, setFilters] = useState<Partial<CourseCoachFilterModel>>({
        name: initialFilters.name,
        minRating: initialFilters.minRating,
        maxRating: initialFilters.maxRating,
        languages: initialFilters.languages || [],
        skills: initialFilters.skills || [],
        minSessionCount: initialFilters.minSessionCount,
        maxSessionCount: initialFilters.maxSessionCount,
    });

    const handleChange = (field: string, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleLanguageToggle = (language: string) => {
        setFilters((prev) => {
            const currentLanguages = prev.languages || [];
            const updatedLanguages = currentLanguages.includes(language)
                ? currentLanguages.filter((l) => l !== language)
                : [...currentLanguages, language];
            return { ...prev, languages: updatedLanguages };
        });
    };

    const handleSkillToggle = (skill: string) => {
        setFilters((prev) => {
            const currentSkills = prev.skills || [];
            const updatedSkills = currentSkills.includes(skill)
                ? currentSkills.filter((s) => s !== skill)
                : [...currentSkills, skill];
            return { ...prev, skills: updatedSkills };
        });
    };

    // This key is required to force re-render the modal when filters are reset.
    const [resetKey, setResetKey] = useState(0); const handleReset = () => {
        setFilters({
            name: undefined,
            minRating: undefined,
            maxRating: undefined,
            languages: [],
            skills: [],
            minSessionCount: undefined,
            maxSessionCount: undefined,
        });
        setResetKey(prev => prev + 1);
    };

    const handleApply = () => {
        onApplyFilters(filters as CourseCoachFilterModel);
        onClose();
    };

    return (<div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onClose}>
        <div className="relative flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[450px] h-full max-h-[90vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 right-0">
                <Button variant="text" size="medium" hasIconLeft iconLeft={<IconClose size="8" />} onClick={onClose} />
            </div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{dictionary.title}</h2>
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Name Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.nameFilter}</h3>
                <TextInput
                    label=""
                    key={`name-${resetKey}`}
                    inputField={{
                        id: 'name',
                        className: "w-full text-white border-input-stroke",
                        defaultValue: filters.name,
                        setValue: (value: string) => handleChange('name', value || undefined),
                        inputText: dictionary.namePlaceholder,
                    }}
                />
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Rating Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.ratingFilter}</h3>
                <div className="flex gap-2">
                    <TextInput
                        label={dictionary.min}
                        key={`minRating-${resetKey}`}
                        inputField={{
                            id: 'minRating',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.minRating?.toString(),
                            setValue: (value: string) =>
                                handleChange('minRating', parseFloat(value) || undefined),
                            inputText: dictionary.minimumRatingPlaceholder,
                        }}
                    />
                    <TextInput
                        label={dictionary.max}
                        key={`maxRating-${resetKey}`}
                        inputField={{
                            id: 'maxRating',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.maxRating?.toString(),
                            setValue: (value: string) =>
                                handleChange('maxRating', parseFloat(value) || undefined),
                            inputText: dictionary.maximumRatingPlaceholder,
                        }}
                    />
                </div>
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Languages Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.languageFilter}</h3>
                <div className="grid grid-cols-2 gap-3 line-clamp-3">
                    {languages.map((language) => (
                        <CheckBox
                            key={language}
                            name={language}
                            value={language}
                            label={
                                <span
                                    className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                    title={language}
                                >
                                    {language}
                                </span>
                            }
                            labelClass="text-white text-sm w-full"
                            checked={(filters.languages || []).includes(language)}
                            withText
                            onChange={() => handleLanguageToggle(language)}
                        />
                    ))}
                </div>
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Skills Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.skillsFilter}</h3>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {skills.map((skill) => (
                        <CheckBox
                            key={skill}
                            name={skill}
                            value={skill}
                            label={
                                <span
                                    className="block w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                    title={skill}
                                >
                                    {skill}
                                </span>
                            }
                            labelClass="text-white text-sm w-full"
                            checked={(filters.skills || []).includes(skill)}
                            withText
                            onChange={() => handleSkillToggle(skill)}
                        />
                    ))}
                </div>
            </div>
            <div className="h-px w-full bg-divider"></div>

            {/* Session Count Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold">{dictionary.sessionCountFilter}</h3>
                <div className="flex gap-2">
                    <TextInput
                        key={`minSessionCount-${resetKey}`}
                        label={dictionary.min}
                        inputField={{
                            id: 'minSessionCount',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.minSessionCount?.toString(),
                            setValue: (value: string) =>
                                handleChange('minSessionCount', parseInt(value) || undefined),
                            inputText: dictionary.minimumSessionCountPlaceholder,
                        }}
                    />
                    <TextInput
                        key={`maxSessionCount-${resetKey}`}
                        label={dictionary.max}
                        inputField={{
                            id: 'maxSessionCount',
                            className: "w-full text-white border-input-stroke",
                            defaultValue: filters.maxSessionCount?.toString(),
                            setValue: (value: string) =>
                                handleChange('maxSessionCount', parseInt(value) || undefined),
                            inputText: dictionary.maximumSessionCountPlaceholder,
                        }}
                    />
                </div>                </div>
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
