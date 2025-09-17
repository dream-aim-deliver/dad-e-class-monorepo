import { useTranslations } from 'next-intl';
import CategoryTopics from '../common/category-topics';

interface OffersFiltersProps {
    selectedTopics: string[];
    setSelectedTopics: (selectedTopics: string[]) => void;
}

export default function OffersFilters({
    selectedTopics,
    setSelectedTopics,
}: OffersFiltersProps) {
    const t = useTranslations('pages.offers');

    return (
        <CategoryTopics
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            filterText={t('filterByTopic')}
            chooseCategoryText={t('chooseCategory')}
        />
    );
}
