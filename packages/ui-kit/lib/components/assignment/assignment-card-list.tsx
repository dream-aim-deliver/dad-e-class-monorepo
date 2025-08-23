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
import { fileMetadata, shared } from '@maany_shr/e-class-models';

interface AssignmentCardListProps extends isLocalAware {
  assignments: AssignmentCardProps[];
  onClickViewProfile?: (assignment: AssignmentCardProps) => void;
  onClickBookSession?: (assignment: AssignmentCardProps) => void;
  onFileDownload: (id: string) => void;
  onFileDelete: (assignmentId: number, fileId: string) => void;
  onLinkDelete: (assignmentId: number, linkId: number) => void;
  onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLinkWithId[], linkEditIndex: number) => void;
  onImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
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

/**
 * 
 * @param assignments Array of assignment data objects to display in the grid
 * @param onClickViewProfile Optional callback for viewing assignment creator's profile
 * @param onClickBookSession Optional callback for booking tutoring sessions related to assignments
 * @param onFileDownload Callback to download files attached to assignments
 * @param onFileDelete Callback to delete files from assignments (assignmentId, fileId, type)
 * @param onLinkDelete Callback to delete resource links from assignments (assignmentId, linkId, type)
 * @param onChange Callback for assignment file/link modifications (files, links, optional edit index)
 * @param onImageChange Callback for updating assignment images with optional abort signal
 * @param onClickCourse Callback triggered when user clicks course information in assignment cards
 * @param onClickUser Callback triggered when user clicks student information in assignment cards
 * @param onClickGroup Callback triggered when user clicks group information in assignment cards
 * @param onClickView Callback triggered when user clicks "View" button on assignment cards
 * @param onDownloadAll Optional callback to download all visible assignments in bulk
 * @param availableStatuses Array of status options for filter modal (defaults to standard statuses)
 * @param availableCourses Array of available courses for filter validation
 * @param availableModules Array of available modules for filter validation
 * @param availableLessons Array of available lessons for filter validation
 * @param locale Locale string for internationalization of UI text and labels
 *
 * @example
 * <AssignmentCardList
 *   assignments={assignmentData}
 *   onFileDownload={(id) => downloadFile(id)}
 *   onFileDelete={(assignmentId, fileId) => removeFile(assignmentId, fileId)}
 *   onLinkDelete={(assignmentId, linkId) => removeLink(assignmentId, linkId)}
 *   onChange={(files, links) => updateAssignment(files, links)}
 *   onImageChange={(image) => updateImage(image)}
 *   onClickCourse={() => navigateToCourse()}
 *   onClickUser={() => navigateToUser()}
 *   onClickGroup={() => navigateToGroup()}
 *   onClickView={() => navigateToAssignment()}
 *   onDownloadAll={() => downloadAllAssignments()}
 *   availableStatuses={['pending', 'completed', 'overdue', 'submitted']}
 *   availableCourses={courseList}
 *   availableModules={moduleList}
 *   availableLessons={lessonList}
 *   locale="en"
 * />
 */
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
        (assignment.title as string).toLowerCase().includes(search.toLowerCase()) ||
        assignment.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
        assignment.groupName?.toLowerCase().includes(search.toLowerCase());

      // Apply filter modal filters
      let matches = true;

      if (filters.title && !(assignment.title as string).toLowerCase().includes(filters.title.toLowerCase())) {
        matches = false;
      }

      if (filters.status && filters.status.length > 0 && !filters.status.includes(assignment.status as string)) {
        matches = false;
      }

      if (filters.course && !assignment.course?.title?.toLowerCase().includes(filters.course.toLowerCase())) {
        matches = false;
      }

      if (filters.module && (assignment.module as number).toString() !== filters.module) {
        matches = false;
      }

      if (filters.lesson && (assignment.lesson as number).toString() !== filters.lesson) {
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
      if (sortBy === 'title') return (a.title as string).localeCompare(b.title as string);
      if (sortBy === 'status') return (a.status as string).localeCompare(b.status as string);
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
    <div className="flex flex-col gap-4 w-full p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-2 w-full">
        {/* All header controls in one row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 gap-3 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary w-full sm:w-auto">{dictionary.title}</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {/* Sort by label and dropdown on one line for small screens */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-md text-text-primary whitespace-nowrap">{dictionary.sortByLabel}</span>
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
                className="min-w-[120px] w-full sm:w-auto"
              />
            </div>
            <Button
              variant="secondary"
              size="medium"
              className="w-full sm:w-auto min-w-[100px]"
              text={dictionary.filterButton}
              hasIconLeft
              iconLeft={<IconFilter size="4" />}
              onClick={() => setShowFilter(true)}
            />
            {onDownloadAll && (
              <Button
                variant="primary"
                size="medium"
                className="w-full sm:w-auto min-w-[140px]"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start p-1 sm:p-2">
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