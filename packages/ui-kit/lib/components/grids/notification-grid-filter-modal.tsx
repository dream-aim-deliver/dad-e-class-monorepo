import React, { useState } from 'react';
import { Button } from '../button';
import { DateInput } from '../date-input';
import { CheckBox } from '../checkbox';
import { TextInput } from '../text-input';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

// Notification filter model
export interface NotificationFilterModel {
  platform?: string[];
  isRead?: boolean;
  search?: string;
  dateAfter?: string;
  dateBefore?: string;
}

interface NotificationGridFilterModalProps extends isLocalAware {
  onApplyFilters: (filters: NotificationFilterModel) => void;
  onClose: () => void;
  initialFilters?: Partial<NotificationFilterModel>;
  platforms: string[];
}

export const NotificationGridFilterModal: React.FC<NotificationGridFilterModalProps> = ({
  onApplyFilters,
  onClose,
  initialFilters = {},
  platforms,
  locale,
}) => {
  const dictionary = getDictionary(locale).components.notificationGridFilterModal;
  const [filters, setFilters] = useState<Partial<NotificationFilterModel>>({
    platform: initialFilters.platform || [],
    isRead: initialFilters.isRead,
    search: initialFilters.search || '',
    dateAfter: initialFilters.dateAfter,
    dateBefore: initialFilters.dateBefore,
  });
  const [resetKey, setResetKey] = useState(0);

  const handleChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFilters((prev) => {
      const currentPlatforms = prev.platform || [];
      const updatedPlatforms = currentPlatforms.includes(platform)
        ? currentPlatforms.filter((p) => p !== platform)
        : [...currentPlatforms, platform];
      return { ...prev, platform: updatedPlatforms };
    });
  };

  const handleReset = () => {
    setFilters({
      platform: [],
      isRead: undefined,
      search: '',
      dateAfter: undefined,
      dateBefore: undefined,
    });
    setResetKey((prev) => prev + 1);
  };

  const handleApply = () => {
    onApplyFilters(filters as NotificationFilterModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-50" onClick={onClose}>
      <div className="flex flex-col gap-2 p-6 bg-card-fill text-text-primary w-full max-w-[370px] h-full max-h-[90vh] overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{dictionary.title}</h2>
          <div className="flex top-0 right-0 p-0">
            <Button variant="text" size="small" onClick={onClose} text="✕" />
          </div>
        </div>
        <div className="h-px w-full bg-divider"></div>

        {/* Platform Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{dictionary.platformFilter}</h3>
          <div className="grid grid-cols-2 gap-3 line-clamp-3">
            {platforms.map((platform) => (
              <CheckBox
                key={platform}
                name={platform}
                value={platform}
                label={<span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap" title={platform}>{platform}</span>}
                labelClass="text-white text-sm truncate"
                checked={(filters.platform || []).includes(platform)}
                withText
                onChange={() => handlePlatformToggle(platform)}
              />
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-divider"></div>

        {/* Read Status Section (true/false checkbox) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{dictionary.readStatusFilter}</h3>
          <div className="flex gap-4 items-center">
            <CheckBox
              name="isRead"
              value="read"
              label={dictionary.read}
              checked={filters.isRead === true}
              onChange={() => handleChange('isRead', filters.isRead === true ? undefined : true)}
              withText
              labelClass="text-white text-sm"
            />
            <CheckBox
              name="isUnread"
              value="unread"
              label={dictionary.unread || "Unread"}
              checked={filters.isRead === false}
              onChange={() => handleChange('isRead', filters.isRead === false ? undefined : false)}
              withText
              labelClass="text-white text-sm"
            />
          </div>
        </div>
        <div className="h-px w-full bg-divider"></div>

        {/* Search Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{dictionary.searchFilter}</h3>
          <TextInput
            key={`search-${resetKey}`}
            inputField={{
              id: 'search',
              className: 'w-full text-white border-input-stroke',
              defaultValue: filters.search,
              setValue: (value: string) => handleChange('search', value),
              inputPlaceholder: dictionary.searchPlaceholder,
            }}
          />
        </div>
        <div className="h-px w-full bg-divider"></div>

        {/* Date Range Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">{dictionary.dateFilter}</h3>
          <DateInput
            label={dictionary.after}
            value={filters.dateAfter || ''}
            onChange={(value: string) => handleChange('dateAfter', value)}
            locale={locale}
          />
          <DateInput
            label={dictionary.before}
            value={filters.dateBefore || ''}
            onChange={(value: string) => handleChange('dateBefore', value)}
            locale={locale}
          />
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
