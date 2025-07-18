import React, { useState } from 'react';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { IconFilter } from '../icons/icon-filter';
import { IconClose } from '../icons/icon-close';
import { IconCloudDownload } from '../icons/icon-cloud-download';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { AssignmentCardFilterModal, AssignmentFilterModel } from './assignment-card-filter-modal';
import { AssignmentCard, AssignmentCardProps } from './assignment-card';
import { Dropdown } from '../dropdown';
import { IconSearch } from '../icons/icon-search';
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';

interface AssignmentCardListProps extends isLocalAware {
  assignments: AssignmentCardProps[];
  onClickViewProfile?: (assignment: AssignmentCardProps) => void;
  onClickBookSession?: (assignment: AssignmentCardProps) => void;
  onFileDownload: (id: string) => void;
  onFileDelete: (assignmentId: number, fileId: string, type: 'file') => void;
  onLinkDelete: (assignmentId: number, linkId: number, type: 'link') => void;
  onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLinkWithId[], linkEditIndex?: number) => void;
  onImageChange: (image: fileMetadata.TFileMetadata, abortSignal?: AbortSignal) => void;
  onClickCourse: () => void;
  onClickUser: () => void;
  onClickGroup: () => void;
  onClickView: () => void;
  onDownloadAll?: () => void;
  availableStatuses?: string[];
  availableCourses?: string[];
  availableModules?: string[];
  availableLessons?: string[];
}

export const AssignmentCardList: React.FC<AssignmentCardListProps> = ({
  assignments,
  locale,
  onFileDownload,
  onFileDelete,
  onLinkDelete,
  onChange,
  onImageChange,
  onClickCourse,
  onClickUser,
  onClickGroup,
  onClickView,
  onDownloadAll,
  availableStatuses = ['pending', 'completed', 'overdue', 'submitted'],
  availableCourses = [],
  availableModules = [],
  availableLessons = [],
}) => {
  const dictionary = getDictionary(locale).components.assignmentCardList;
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Partial<AssignmentFilterModel>>({});
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'course'>(dictionary.defaultSortBy as 'title' | 'status' | 'course');

  // Filter and sort logic
  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(search.toLowerCase()) ||
        assignment.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.groupName?.toLowerCase().includes(search.toLowerCase());

      // Apply filter modal filters
      let matches = true;
      
      if (filters.title && !assignment.title.toLowerCase().includes(filters.title.toLowerCase())) {
        matches = false;
      }
      
      if (filters.status && filters.status.length > 0 && !filters.status.includes(assignment.status)) {
        matches = false;
      }
      
      if (filters.course && !assignment.course?.title?.toLowerCase().includes(filters.course.toLowerCase())) {
        matches = false;
      }
      
      if (filters.module && assignment.module.toString() !== filters.module) {
        matches = false;
      }
      
      if (filters.lesson && assignment.lesson.toString() !== filters.lesson) {
        matches = false;
      }
      
      if (filters.student && !assignment.student?.name?.toLowerCase().includes(filters.student.toLowerCase())) {
        matches = false;
      }
      
      if (filters.groupName && !assignment.groupName?.toLowerCase().includes(filters.groupName.toLowerCase())) {
        matches = false;
      }

      return matchesSearch && matches;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'course') return (a.course?.title || '').localeCompare(b.course?.title || '');
      // Date sorting would require a date field in the assignment object
      return 0;
    });

  const handleClear = () => {
    setSearch('');
    setFilters({});
    setSortBy(dictionary.defaultSortBy as 'title' | 'status' | 'course');
  };

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2 w-full">
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-text-primary">{dictionary.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-primary mr-1">{dictionary.sortByLabel}</span>
            <Dropdown
              type="simple"
              options={[
                { label: dictionary.sortOptions.title, value: 'title' },
                { label: dictionary.sortOptions.status, value: 'status' },
                { label: dictionary.sortOptions.course, value: 'course' },
              ]}
              onSelectionChange={(val) => setSortBy(val as 'title' | 'status' | 'course')}
              defaultValue={sortBy}
              text={{ simpleText: dictionary.sortOptions.title }}
              className="min-w-[120px]"
            />
            <Button
              variant="secondary"
              size="small"
              className="min-w-[100px]"
              text={dictionary.filterButton}
              hasIconLeft
              iconLeft={<IconFilter size="4" />}
              onClick={() => setShowFilter(true)}
            />
            {onDownloadAll && (
              <Button
                variant="primary"
                size="small"
                className="min-w-[140px]"
                text={dictionary.downloadAllButton}
                hasIconLeft
                iconLeft={<IconCloudDownload size="4" />}
                onClick={onDownloadAll}
              />
            )}
          </div>
        </div>
        
        <div className="flex w-full items-center gap-2">
          <div className="flex-1">
            <TextInput
              inputField={{
                id: 'search',
                className: 'w-full',
                value: search,
                setValue: setSearch,
                inputText: dictionary.searchPlaceholder,
                hasLeftContent: true,
                leftContent: <IconSearch />,
              }}
            />
          </div>
        </div>
        
        <div className="flex w-full">
          <Button
            variant="text"
            size="small"
            className="min-w-[80px]"
            text={dictionary.clearButton}
            hasIconLeft
            iconLeft={<IconClose size="4" />}
            onClick={handleClear}
          />
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <AssignmentCardFilterModal
          onApplyFilters={(f) => { setFilters(f); setShowFilter(false); }}
          onClose={() => setShowFilter(false)}
          initialFilters={filters}
          availableStatuses={availableStatuses}
          availableCourses={availableCourses}
          availableModules={availableModules}
          availableLessons={availableLessons}
          locale={locale}
        />
      )}

      {/* Assignment Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            {dictionary.noAssignmentsFound}
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.assignmentId}
              {...assignment}
              onFileDownload={onFileDownload}
              onFileDelete={onFileDelete}
              onLinkDelete={onLinkDelete}
              onChange={onChange}
              onImageChange={onImageChange}
              onClickCourse={onClickCourse}
              onClickUser={onClickUser}
              onClickGroup={onClickGroup}
              onClickView={onClickView}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentCardList;
