import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Button } from "../../button";
import { CheckBox } from "../../checkbox";
import { DateInput } from "../../date-input";
import { Tabs } from "../../tabs/tab";
import { FC, useState } from "react";
import { IconButton } from "../../icon-button";
import { IconClose } from "../../icons/icon-close";
import { TextInput } from "../../text-input";
import { IconLoaderSpinner } from "../../icons/icon-loader-spinner";

export type TSingleAvailability = {
  id: number;
  type: "single";
  date: string;
  startTime: string;
  endTime: string;
};

export type TRecurringAvailability = {
  id: number;
  type: "recurring";
  days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
  startTime: string;
  endTime: string;
  startDate: string;
  expirationDate: string;
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

const AvailabilityManager: FC<AvailabilityManagerProps> = ({
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

  // State for recurring availability
  const [selectedDays, setSelectedDays] = useState<("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[]>(
    isRecurring ? (availability as TRecurringAvailability).days : []
  );
  const [recurringStartTime, setRecurringStartTime] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).startTime : "12:00"
  );
  const [recurringEndTime, setRecurringEndTime] = useState<string>(
    isRecurring ? (availability as TRecurringAvailability).endTime : "14:00"
  );
  const [startDate, setStartDate] = useState<string>(
    isRecurring
      ? (availability as TRecurringAvailability).startDate
      : "2025-12-31" // Adjusted to ISO format
  );
  const [expirationDate, setExpirationDate] = useState<string>(
    isRecurring
      ? (availability as TRecurringAvailability).expirationDate
      : "2025-12-31" // Adjusted to ISO format
  );

  // State for single availability
  const [singleDate, setSingleDate] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).date
      : "2025-12-31" // Adjusted to ISO format
  );
  const [singleStartTime, setSingleStartTime] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).startTime
      : "12:00"
  );
  const [singleEndTime, setSingleEndTime] = useState<string>(
    !isRecurring && availability
      ? (availability as TSingleAvailability).endTime
      : "14:00"
  );

  const [tab, setTab] = useState<"recurring" | "single">(
    availability?.type || "recurring"
  );

  const handleDaySelection = (day: string): void => {
    setSelectedDays((prev) =>
      prev.includes(day as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"))
        ? prev.filter((d) => d !== day) as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[]
        : [...prev, day as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")]
    );
  };

  const handleSave = () => {
    if (tab === "recurring") {
      onSave({
        id: availability?.id || Date.now(),
        type: "recurring",
        days: selectedDays,
        startTime: recurringStartTime,
        endTime: recurringEndTime,
        startDate,
        expirationDate,
      });
    } else {
      onSave({
        id: availability?.id || Date.now(),
        type: "single",
        date: singleDate,
        startTime: singleStartTime,
        endTime: singleEndTime,
      });
    }
  };

  const handleDelete = () => {
    if (availability && onDelete) {
      onDelete(availability.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-fit p-6 bg-card-fill border-[1px] border-card-stroke rounded-medium shadow-[0px_4px_12px_0px_#09090B] relative">
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
        {isEdit ? dictionary.components.calendar.availabilityManagement.editAvailability : dictionary.components.calendar.availabilityManagement.addAvailability}
      </p>
      {isError && (
        <p className="text-feedback-error-primary">{dictionary.components.calendar.availabilityManagement.errorText}</p>
      )}
      {!isEdit && (
        <Tabs.Root
          defaultTab="recurring"
          onChange={(event) => setTab((event.target as HTMLInputElement).value as "recurring" | "single")}
        >
          <Tabs.List>
            <Tabs.Trigger value="recurring">{dictionary.components.calendar.availabilityManagement.recurringText}</Tabs.Trigger>
            <Tabs.Trigger value="single">{dictionary.components.calendar.availabilityManagement.singleText}</Tabs.Trigger>
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
                      checked={selectedDays.includes(day as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"))}
                      onChange={() => handleDaySelection(day)}
                      withText
                      label={day}
                      labelClass="text-md text-text-primary leading-[150%]"
                    />
                  ))}
                </div>
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
                        inputText: "12:00",
                        className: "w-full"
                      }}
                      id="recurring-start-time"
                    />
                    <TextInput 
                      label={dictionary.components.calendar.availabilityManagement.endText}
                      inputField={{
                        value: recurringEndTime,
                        setValue: setRecurringEndTime,
                        inputText: "14:00",
                        className: "w-full"
                      }}
                      id="recurring-end-time"
                    />
                  </div>
                </div>
                <DateInput
                  label={`${dictionary.components.calendar.availabilityManagement.expirationDateText} (YYYY/MM/DD)`}
                  value={expirationDate}
                  onChange={setExpirationDate}
                />
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
                  />
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
                        inputText: "12:00",
                        className: "w-full"
                      }}
                      id="single-start-time"
                    />
                    <TextInput 
                      label={dictionary.components.calendar.availabilityManagement.endText}
                      inputField={{
                        value: singleEndTime,
                        setValue: setSingleEndTime,
                        inputText: "14:00",
                        className: "w-full"
                      }}
                      id="single-end-time"
                    />
                  </div>
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
                    checked={selectedDays.includes(day as ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"))}
                    onChange={() => handleDaySelection(day)}
                    withText
                    label={day}
                    labelClass="text-md text-text-primary leading-[150%]"
                  />
                ))}
              </div>
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
                  inputText: "12:00",
                  className: "w-full"
                }}
                id={isRecurring ? "recurring-start-time" : "single-start-time"}
              />
              <TextInput 
                label={dictionary.components.calendar.availabilityManagement.endText}
                inputField={{
                  value: isRecurring ? recurringEndTime : singleEndTime,
                  setValue: isRecurring ? setRecurringEndTime : setSingleEndTime,
                  inputText: "14:00",
                  className: "w-full"
                }}
                id={isRecurring ? "recurring-end-time" : "single-end-time"}
              />
            </div>
          </div>
          {isRecurring ? (
              <DateInput
                label={dictionary.components.calendar.availabilityManagement.expirationDateText}
                value={expirationDate}
                onChange={setExpirationDate}
              />
            ) : (
              <DateInput
                label={dictionary.components.calendar.availabilityManagement.chooseDateText}
                value={singleDate}
                onChange={setSingleDate}
              />
            )
          }
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onCancel}
          disabled={isLoading}
          text={dictionary.components.calendar.availabilityManagement.goBackText}
        />
        <div className="relative w-full">
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isLoading}
            text={isEdit ? dictionary.components.calendar.availabilityManagement.confirmChangesText : dictionary.components.calendar.availabilityManagement.addText}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;