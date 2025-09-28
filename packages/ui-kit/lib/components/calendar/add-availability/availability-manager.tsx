import { getDictionary, isLocalAware, TLocale } from "@maany_shr/e-class-translations";
import { Button } from "../../button";
import { CheckBox } from "../../checkbox";
import { DateInput } from "../../date-input";
import { Tabs } from "../../tabs/tab";
import { FC, useState, useEffect } from "react";
import { IconButton } from "../../icon-button";
import { IconClose } from "../../icons/icon-close";
import { TextInput } from "../../text-input";
import { IconLoaderSpinner } from "../../icons/icon-loader-spinner";

export type TSingleAvailability = {
  id: number;
  type: "single";
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; // 24-hour format: HH:MM
  endTime: string; // 24-hour format: HH:MM
};

export type TRecurringAvailability = {
  id: number;
  type: "recurring";
  days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  startTime: string; // 24-hour format: HH:MM
  endTime: string; // 24-hour format: HH:MM
  startDate: string; // ISO format: YYYY-MM-DD
  expirationDate: string; // ISO format: YYYY-MM-DD
};

export type TAvailability = TSingleAvailability | TRecurringAvailability;

interface AvailabilityManagerProps extends isLocalAware {
  availability?: TAvailability;
  isLoading?: boolean;
  isError?: boolean;
  onSave: (availability: TAvailability) => void;
  onDelete?: (id: number) => void;
  onCancel: () => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Helper function to get current date in ISO format (YYYY-MM-DD)
const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Helper function to get date 1 year from now in ISO format
const getOneYearFromNow = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0];
};

// Helper function to validate time format (HH:MM)
const isValidTimeFormat = (time: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

// Helper function to check if end time is after start time
const isEndTimeAfterStartTime = (startTime: string, endTime: string): boolean => {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) return false;

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (endHour > startHour) return true;
  if (endHour === startHour && endMinute > startMinute) return true;
  return false;
};

export const AvailabilityManager: FC<AvailabilityManagerProps> = ({
  availability,
  isLoading = false,
  isError = false,
  onSave,
  onDelete,
  onCancel,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const isEdit = !!availability;
  const isRecurring = availability?.type === "recurring";

  // Default values
  const defaultStartTime = "09:00";
  const defaultEndTime = "17:00";
  const defaultStartDate = getCurrentDate();
  const defaultExpirationDate = getOneYearFromNow();

  // State for recurring availability
  const [selectedDays, setSelectedDays] = useState<
    ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[]
  >(isRecurring ? (availability as TRecurringAvailability).days : []);
  const [recurringStartTime, setRecurringStartTime] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).startTime : defaultStartTime
  );
  const [recurringEndTime, setRecurringEndTime] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).endTime : defaultEndTime
  );
  const [startDate, setStartDate] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).startDate : defaultStartDate
  );
  const [expirationDate, setExpirationDate] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).expirationDate : defaultExpirationDate
  );

  // State for single availability
  const [singleDate, setSingleDate] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).date
      : defaultStartDate
  );
  const [singleStartTime, setSingleStartTime] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).startTime
      : defaultStartTime
  );
  const [singleEndTime, setSingleEndTime] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).endTime
      : defaultEndTime
  );

  const [tab, setTab] = useState<"recurring" | "single">(
    availability?.type || "recurring"
  );

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    days?: string;
    startTime?: string;
    endTime?: string;
    timeRange?: string;
    date?: string;
    expirationDate?: string;
  }>({});

  // Reset validation errors when tab changes
  useEffect(() => {
    setValidationErrors({});
  }, [tab]);

  const handleDaySelection = (day: string): void => {
    setSelectedDays((prev) =>
      prev.includes(
        day as
          | "Monday"
          | "Tuesday"
          | "Wednesday"
          | "Thursday"
          | "Friday"
          | "Saturday"
          | "Sunday"
      )
        ? (prev.filter((d) => d !== day) as (
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday"
            | "Sunday"
          )[])
        : ([
            ...prev,
            day as
              | "Monday"
              | "Tuesday"
              | "Wednesday"
              | "Thursday"
              | "Friday"
              | "Saturday"
              | "Sunday",
          ] as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[])
    );
  };

  const validateRecurringForm = (): boolean => {
    const errors: {
      days?: string;
      startTime?: string;
      endTime?: string;
      timeRange?: string;
      expirationDate?: string;
    } = {};

    // Validate selected days
    if (selectedDays.length === 0) {
      errors.days = "Please select at least one day";
    }

    // Validate start time
    if (!isValidTimeFormat(recurringStartTime)) {
      errors.startTime = "Invalid time format";
    }

    // Validate end time
    if (!isValidTimeFormat(recurringEndTime)) {
      errors.endTime = "Invalid time format";
    }

    // Validate time range
    if (!isEndTimeAfterStartTime(recurringStartTime, recurringEndTime)) {
      errors.timeRange = "End time must be after start time";
    }

    // Validate dates
    if (new Date(expirationDate) <= new Date(startDate)) {
      errors.expirationDate = "Expiration date must be after start date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSingleForm = (): boolean => {
    const errors: {
      startTime?: string;
      endTime?: string;
      timeRange?: string;
      date?: string;
    } = {};

    // Validate single date
    if (!singleDate) {
      errors.date = "Please select a date";
    }

    // Validate start time
    if (!isValidTimeFormat(singleStartTime)) {
      errors.startTime = "Invalid time format";
    }

    // Validate end time
    if (!isValidTimeFormat(singleEndTime)) {
      errors.endTime = "Invalid time format";
    }

    // Validate time range
    if (!isEndTimeAfterStartTime(singleStartTime, singleEndTime)) {
      errors.timeRange = "End time must be after start time";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveRecurring = () => {
    if (!validateRecurringForm()) {
      return;
    }

    const id = availability?.id || Date.now();
    const recurringAvailability: TRecurringAvailability = {
      id,
      type: "recurring",
      days: selectedDays,
      startTime: recurringStartTime,
      endTime: recurringEndTime,
      startDate,
      expirationDate,
    };
    console.log("Sending recurring to backend:", recurringAvailability);
    onSave(recurringAvailability);
  };

  const handleSaveSingle = () => {
    if (!validateSingleForm()) {
      return;
    }

    const id = availability?.id || Date.now();
    const singleAvailability: TSingleAvailability = {
      id,
      type: "single",
      date: singleDate,
      startTime: singleStartTime,
      endTime: singleEndTime,
    };
    console.log("Sending single to backend:", singleAvailability);
    onSave(singleAvailability);
  };

  const handleDelete = () => {
    if (availability && onDelete) {
      onDelete(availability.id);
    }
  };

  const renderValidationError = (key: keyof typeof validationErrors) => {
    return validationErrors[key] ? (
      <p className="text-sm text-feedback-error-primary mt-1">
        {validationErrors[key]}
      </p>
    ) : null;
  };

  return (
    <div className="flex flex-col gap-6 w-fit p-6 bg-card-fill border-[1px] border-card-stroke rounded-medium shadow-[0px_4px_12px_0px_#09090B] relative max-w-[360px] max-h-[650px] overflow-y-auto">
      <div className="absolute right-0 top-0">
        <IconButton
          data-testid="close-modal-button"
          styles="text"
          icon={<IconClose />}
          size="small"
          onClick={onCancel}
          className="text-button-text-text"
        />
      </div>
      <p className="text-2xl text-base-white font-bold leading-[110%]">
        {isEdit
          ? dictionary.components.calendar.availabilityManagement.editAvailability
          : dictionary.components.calendar.availabilityManagement.addAvailability}
      </p>
      {isError && (
        <p className="text-feedback-error-primary">
          {dictionary.components.calendar.availabilityManagement.errorText}
        </p>
      )}
      {!isEdit && (
        <Tabs.Root
          defaultTab="recurring"
          onChange={(event) =>
            setTab((event.target as HTMLInputElement).value as "recurring" | "single")
          }
        >
          <Tabs.List>
            <Tabs.Trigger value="recurring" isLast={false}>
              {dictionary.components.calendar.availabilityManagement.recurringText}
            </Tabs.Trigger>
            <Tabs.Trigger value="single" isLast>
              {dictionary.components.calendar.availabilityManagement.singleText}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="recurring">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <p className="text-md text-base-white font-bold leading-[120%]">
                  {dictionary.components.calendar.availabilityManagement.chooseDaysText}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {daysOfWeek.map((day, index) => (
                    <CheckBox
                      key={index}
                      name={`checklist-${index}`}
                      value={day}
                      checked={selectedDays.includes(
                        day as
                          | "Monday"
                          | "Tuesday"
                          | "Wednesday"
                          | "Thursday"
                          | "Friday"
                          | "Saturday"
                          | "Sunday"
                      )}
                      onChange={() => handleDaySelection(day)}
                      withText
                      label={day}
                      labelClass="text-md text-text-primary leading-[150%]"
                      data-testid={`day-checkbox-${day.toLowerCase()}`}
                    />
                  ))}
                </div>
                {renderValidationError("days")}

                <div className="flex flex-col gap-2">
                  <p className="text-md text-base-white font-bold leading-[120%]">
                    {dictionary.components.calendar.availabilityManagement.chooseTimeText}
                  </p>
                  <div className="flex gap-2">
                    <TextInput
                      label={dictionary.components.calendar.availabilityManagement.startText}
                      inputField={{
                        value: recurringStartTime,
                        setValue: setRecurringStartTime,
                        inputText: defaultStartTime,
                        className: "w-full",
                      }}
                      id="recurring-start-time"
                      data-testid="recurring-start-time"
                    />
                    <TextInput
                      label={dictionary.components.calendar.availabilityManagement.endText}
                      inputField={{
                        value: recurringEndTime,
                        setValue: setRecurringEndTime,
                        inputText: defaultEndTime,
                        className: "w-full",
                      }}
                      id="recurring-end-time"
                      data-testid="recurring-end-time"
                    />
                  </div>
                  {renderValidationError("startTime") ||
                    renderValidationError("endTime") ||
                    renderValidationError("timeRange")}
                </div>

                <DateInput
                  label={`${dictionary.components.calendar.availabilityManagement.startText || "Start Date"} (YYYY-MM-DD)`}
                  value={startDate}
                  onChange={setStartDate}
                  data-testid="recurring-start-date"
                  locale={locale as TLocale}
                />

                <DateInput
                  label={`${dictionary.components.calendar.availabilityManagement.expirationDateText || "Expiration Date"} (YYYY-MM-DD)`}
                  value={expirationDate}
                  onChange={setExpirationDate}
                  data-testid="recurring-expiration-date"
                  locale={locale as TLocale}
                />
                {renderValidationError("expirationDate")}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onCancel}
                  disabled={isLoading}
                  text={dictionary.components.calendar.availabilityManagement.goBackText}
                  data-testid="cancel-button"
                />
                <div className="relative w-full">
                  <Button
                    className="w-full"
                    onClick={handleSaveRecurring}
                    disabled={isLoading}
                    text={
                      isEdit
                        ? dictionary.components.calendar.availabilityManagement
                            .confirmChangesText
                        : dictionary.components.calendar.availabilityManagement.addText
                    }
                    data-testid="save-recurring-button"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="single">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-md text-base-white font-bold leading-[120%]">
                    {dictionary.components.calendar.availabilityManagement.chooseDateText}
                  </p>
                  <DateInput
                    value={singleDate}
                    onChange={setSingleDate}
                    data-testid="single-date"
                    locale={locale as TLocale}
                  />
                  {renderValidationError("date")}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-md text-base-white font-bold leading-[120%]">
                    {dictionary.components.calendar.availabilityManagement.chooseTimeText}
                  </p>
                  <div className="flex gap-2">
                    <TextInput
                      label={dictionary.components.calendar.availabilityManagement.startText}
                      inputField={{
                        value: singleStartTime,
                        setValue: setSingleStartTime,
                        inputText: defaultStartTime,
                        className: "w-full",
                      }}
                      id="single-start-time"
                      data-testid="single-start-time"
                    />
                    <TextInput
                      label={dictionary.components.calendar.availabilityManagement.endText}
                      inputField={{
                        value: singleEndTime,
                        setValue: setSingleEndTime,
                        inputText: defaultEndTime,
                        className: "w-full",
                      }}
                      id="single-end-time"
                      data-testid="single-end-time"
                    />
                  </div>
                  {renderValidationError("startTime") ||
                    renderValidationError("endTime") ||
                    renderValidationError("timeRange")}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onCancel}
                  disabled={isLoading}
                  text={dictionary.components.calendar.availabilityManagement.goBackText}
                  data-testid="cancel-button"
                />
                <div className="relative w-full">
                  <Button
                    className="w-full"
                    onClick={handleSaveSingle}
                    disabled={isLoading}
                    text={
                      isEdit
                        ? dictionary.components.calendar.availabilityManagement
                            .confirmChangesText
                        : dictionary.components.calendar.availabilityManagement.addText
                    }
                    data-testid="save-single-button"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      )}
      {isEdit && (
        <div className="flex flex-col gap-6">
          {isRecurring && (
            <>
              <p className="text-md text-base-white font-bold leading-[120%]">
                {dictionary.components.calendar.availabilityManagement.chooseDaysText}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map((day, index) => (
                  <CheckBox
                    key={index}
                    name={`checklist-${index}`}
                    value={day}
                    checked={selectedDays.includes(
                      day as
                        | "Monday"
                        | "Tuesday"
                        | "Wednesday"
                        | "Thursday"
                        | "Friday"
                        | "Saturday"
                        | "Sunday"
                    )}
                    onChange={() => handleDaySelection(day)}
                    withText
                    label={day}
                    labelClass="text-md text-text-primary leading-[150%]"
                    data-testid={`day-checkbox-${day.toLowerCase()}`}
                  />
                ))}
              </div>
              {renderValidationError("days")}
            </>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-md text-base-white font-bold leading-[120%]">
              {dictionary.components.calendar.availabilityManagement.chooseTimeText}
            </p>
            <div className="flex gap-2">
              <TextInput
                label={dictionary.components.calendar.availabilityManagement.startText}
                inputField={{
                  value: isRecurring ? recurringStartTime : singleStartTime,
                  setValue: isRecurring ? setRecurringStartTime : setSingleStartTime,
                  inputText: defaultStartTime,
                  className: "w-full",
                }}
                id={isRecurring ? "recurring-start-time" : "single-start-time"}
                data-testid={isRecurring ? "recurring-start-time" : "single-start-time"}
              />
              <TextInput
                label={dictionary.components.calendar.availabilityManagement.endText}
                inputField={{
                  value: isRecurring ? recurringEndTime : singleEndTime,
                  setValue: isRecurring ? setRecurringEndTime : setSingleEndTime,
                  inputText: defaultEndTime,
                  className: "w-full",
                }}
                id={isRecurring ? "recurring-end-time" : "single-end-time"}
                data-testid={isRecurring ? "recurring-end-time" : "single-end-time"}
              />
            </div>
            {renderValidationError("startTime") ||
              renderValidationError("endTime") ||
              renderValidationError("timeRange")}
          </div>
          {isRecurring ? (
            <>
              <DateInput
                label={`${dictionary.components.calendar.availabilityManagement.startText || "Start Date"} (YYYY-MM-DD)`}
                value={startDate}
                onChange={setStartDate}
                data-testid="recurring-start-date"
                locale={locale as TLocale}
              />
              <DateInput
                label={`${dictionary.components.calendar.availabilityManagement.expirationDateText || "Expiration Date"} (YYYY-MM-DD)`}
                value={expirationDate}
                onChange={setExpirationDate}
                data-testid="recurring-expiration-date"
                locale={locale as TLocale}
              />
              {renderValidationError("expirationDate")}
            </>
          ) : (
            <>
              <DateInput
                label={dictionary.components.calendar.availabilityManagement.chooseDateText}
                value={singleDate}
                onChange={setSingleDate}
                data-testid="single-date"
                locale={locale as TLocale}
              />
              {renderValidationError("date")}
            </>
          )}
          <div className="flex gap-2">
            {onDelete && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleDelete}
                disabled={isLoading}
                text={
                  dictionary.components.calendar.availabilityManagement.deleteText ||
                  "Delete"
                }
                data-testid="delete-button"
              />
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={onCancel}
              disabled={isLoading}
              text={dictionary.components.calendar.availabilityManagement.goBackText}
              data-testid="cancel-button"
            />
            <div className="relative w-full">
              <Button
                className="w-full"
                onClick={isRecurring ? handleSaveRecurring : handleSaveSingle}
                disabled={isLoading}
                text={
                  dictionary.components.calendar.availabilityManagement.confirmChangesText
                }
                data-testid={isRecurring ? "save-recurring-button" : "save-single-button"}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;