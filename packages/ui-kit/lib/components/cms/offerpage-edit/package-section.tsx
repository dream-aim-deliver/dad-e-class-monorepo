'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Dropdown } from '../../dropdown';

type PackageType = {
    id: string;
    title: string;
};

interface PackageSectionProps extends isLocalAware {
    onChange: (packages: PackageType[]) => void;
    packages: PackageType[];
    linkedPackages: PackageType[];
}

export default function PackageSection({
    onChange,
    packages,
    linkedPackages,
    locale
}: PackageSectionProps) {
    const dictionary = getDictionary(locale);
    const handleSelectionChange = (selected: string | string[] | null) => {
        const newSelectedIds = Array.isArray(selected) ? selected : [];
        const selectedPackages = packages.filter(pkg => newSelectedIds.includes(pkg.id));
        onChange(selectedPackages);
    };

    const options = packages.map(pkg => ({
        label: pkg.title,
        value: pkg.id,
    }));

    return (
        <div className="w-full p-6 border border-card-fill rounded-medium bg-card-fill flex flex-col gap-6">
            <h3>{dictionary.components.cmsSections.packageSection.heading}</h3>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm text-text-secondary">{dictionary.components.cmsSections.packageSection.selectPackagesLabel}</label>
                    {packages.length === 0 ? (
                        <div className="p-4 text-start text-text-secondary border border-border-default rounded-medium">
                            {dictionary.components.cmsSections.packageSection.noPackagesFound}
                        </div>
                    ) : (
                        <Dropdown
                            type="multiple-choice-and-search"
                            options={options}
                            onSelectionChange={handleSelectionChange}
                            defaultValue={linkedPackages.map(pkg => pkg.id)}
                            text={{ multiText: dictionary.components.cmsSections.packageSection.dropdownMultiText }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}