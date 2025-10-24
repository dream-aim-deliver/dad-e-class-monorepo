'use client';

import { Dropdown } from '../../dropdown';

type PackageType = {
    id: string;
    title: string;
};

interface PackageSectionProps {
    onChange: (packages: PackageType[]) => void;
    packages: PackageType[];
    linkedPackages: PackageType[];
}

export default function PackageSection({
    onChange,
    packages,
    linkedPackages,
}: PackageSectionProps) {
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
            <h3>Packages Section</h3>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm text-text-secondary">Select Packages</label>
                    <Dropdown
                        type="multiple-choice-and-search"
                        options={options}
                        onSelectionChange={handleSelectionChange}
                        defaultValue={linkedPackages.map(pkg => pkg.id)}
                        text={{ multiText: "Select packages to link" }}
                    />
                </div>
            </div>
        </div>
    );
}