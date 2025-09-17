import React, { useState } from 'react';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { IconFilter } from '../icons/icon-filter';
import { IconClose } from '../icons/icon-close';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { CourseCoachFilterModal, CourseCoachFilterModel } from './course-coach-filter-modal';
import CourseCoachCard, { CoachCardDetails } from './course-coach-card';
import { Dropdown } from '../dropdown';
import { IconSearch } from '../icons/icon-search';

interface CourseCoachCardListProps {
  coaches: CoachCardDetails[];
  locale: TLocale;
  onClickViewProfile?: (coach: CoachCardDetails) => void;
  onClickBookSession?: (coach: CoachCardDetails) => void;
  languages: string[];
  skills: string[];
}

export const CourseCoachCardList: React.FC<CourseCoachCardListProps> = ({
  coaches,
  locale,
  onClickViewProfile,
  onClickBookSession,
  languages,
  skills,
}) => {
  const dictionary = getDictionary(locale).components;
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Partial<CourseCoachFilterModel>>({});
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'sessionCount'>('name');

  // Filter and sort logic
  const filteredCoaches = coaches
    .filter((coach) => {
      const matchesSearch =
        coach.coachName.toLowerCase().includes(search.toLowerCase()) ||
        coach.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      // Apply filter modal filters
      let matches = true;
      if (filters.name && !coach.coachName.toLowerCase().includes(filters.name.toLowerCase())) matches = false;
      if (filters.minRating && coach.rating < filters.minRating) matches = false;
      if (filters.maxRating && coach.rating > filters.maxRating) matches = false;
      if (filters.languages && filters.languages.length > 0 && !filters.languages.some(l => coach.languages.includes(l))) matches = false;
      if (filters.skills && filters.skills.length > 0 && !filters.skills.some(s => coach.skills.includes(s))) matches = false;
      if (filters.minSessionCount && coach.sessionCount < filters.minSessionCount) matches = false;
      if (filters.maxSessionCount && coach.sessionCount > filters.maxSessionCount) matches = false;
      return matchesSearch && matches;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.coachName.localeCompare(b.coachName);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sessionCount') return b.sessionCount - a.sessionCount;
      return 0;
    });

  const handleClear = () => {
    setSearch('');
    setFilters({});
    setSortBy('name');
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2 w-full">
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <TextInput
              inputField={{
                id: 'search',
                className: 'w-full',
                value: search,
                setValue: setSearch,
                inputText: dictionary.userGrid.searchPlaceholder || 'Search',
                hasLeftContent: true,
                leftContent: <IconSearch />,
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-text-primary mr-1">{dictionary.courseCoachCard.sortBy}</span>
            <Dropdown
              type="simple"
              options={[
                { label: dictionary.userGrid.nameColumn || 'Name', value: 'name' },
                { label: dictionary.userGrid.ratingColumn || 'Rating', value: 'rating' },
                { label: dictionary.userGrid.coachingSessionsColumn || 'Sessions', value: 'sessionCount' },
              ]}
              onSelectionChange={(val) => setSortBy(val as 'name' | 'rating' | 'sessionCount')}
              defaultValue={sortBy}
              text={{ simpleText: dictionary.userGrid.nameColumn || 'Name' }}
              className="min-w-[120px]"
            />
            <Button
              variant="secondary"
              size="small"
              className="min-w-[100px]"
              text={dictionary.userGrid.filterButton || 'Filter'}
              hasIconLeft
              iconLeft={<IconFilter size="4" />}
              onClick={() => setShowFilter(true)}
            />
          </div>
        </div>
        <div className="flex w-full">
          <Button
            variant="text"
            size="small"
            className="min-w-[80px]"
            text={dictionary.userGrid.clearFilters || 'Clear'}
            hasIconLeft
            iconLeft={<IconClose size="4" />}
            onClick={handleClear}
          />
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <CourseCoachFilterModal
          onApplyFilters={(f) => { setFilters(f); setShowFilter(false); }}
          onClose={() => setShowFilter(false)}
          initialFilters={filters}
          languages={languages}
          skills={skills}
          locale={locale}
        />
      )}

      {/* Coach Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {filteredCoaches.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            {dictionary.baseGrid.noRows || 'No coaches found.'}
          </div>
        ) : (
          filteredCoaches.map((coach) => (
            <CourseCoachCard
              key={coach.coachName}
              cardDetails={coach}
              locale={locale}
              onClickViewProfile={() => onClickViewProfile?.(coach)}
              onClickBookSession={() => onClickBookSession?.(coach)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCoachCardList;