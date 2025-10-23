import { useState } from 'react';
import { Dropdown } from '../../dropdown';

type PackageType = {
    id: string;
    title: string;
};

interface PackageSectionProps {
    initialValue?: PackageType[];
    onChange: (packages: PackageType[]) => void;
    packages: PackageType[];
    linkedPackages: PackageType[];
}

export default function PackageSection({
    initialValue = [],
    onChange,
    packages,
    linkedPackages,
}: PackageSectionProps) {
    // Store selected package IDs for the dropdown
    const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>(
        initialValue.length > 0
            ? initialValue.map(pkg => pkg.id)
            : linkedPackages.map(pkg => pkg.id)
    );

    const handleSelectionChange = (selected: string | string[] | null) => {
        const newSelectedIds = Array.isArray(selected) ? selected : [];
        setSelectedPackageIds(newSelectedIds);

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
                        defaultValue={selectedPackageIds}
                        text={{ multiText: "Select packages to link" }}
                    />
                </div>
            </div>
        </div>
    );
}