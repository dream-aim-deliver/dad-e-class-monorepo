import { Button } from "../../button";
import { CheckBox } from "../../checkbox";
import { DateInput } from "../../date-input";
import { InputField } from "../../input-field";
import { Tabs } from "../../tabs/tab";
import React, { FC, useState } from "react";

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

interface AvailabilityManagerProps {
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
}) => {
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
    <div className="flex flex-col gap-6 w-[340px] p-6 bg-[#1C1917] border-[1px] border-[#27272A] rounded-[8px] shadow-[0px_4px_12px_0px_#09090B]">
      <p className="text-[26px] text-[#FFF] font-bold leading-[110%]">
        {isEdit ? "Edit Availability" : "Add Availability"}
      </p>
      {isError && (
        <p className="text-red-500">An error occurred. Please try again.</p>
      )}
      {!isEdit && (
        <Tabs.Root
          defaultTab="recurring"
          onChange={(event) => setTab((event.target as HTMLInputElement).value as "recurring" | "single")}
        >
          <Tabs.List>
            <Tabs.Trigger value="recurring">Recurring</Tabs.Trigger>
            <Tabs.Trigger value="single">Single</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="recurring">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <p className="text-[16px] text-[#FFF] font-bold leading-[120%]">
                  Choose days
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
                      labelClass="text-[16px] text-[#FAFAF9] leading-[150%]"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] text-[#FFF] font-bold leading-[120%]">
                    Choose time
                  </p>
                  <div className="flex gap-2">
                    <InputField
                      className="w-full"
                      inputText="12:00"
                      type="text"
                      value={recurringStartTime}
                      setValue={setRecurringStartTime}
                      id="recurring-start-time"
                    />
                    <InputField
                      className="w-full"
                      inputText="14:00"
                      type="text"
                      value={recurringEndTime}
                      setValue={setRecurringEndTime}
                      id="recurring-end-time"
                    />
                  </div>
                </div>
                <DateInput
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <DateInput
                  label="Expiration date"
                  value={expirationDate}
                  onChange={setExpirationDate}
                />
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="single">
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <DateInput
                  label="Date"
                  value={singleDate}
                  onChange={setSingleDate}
                />
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] text-[#FFF] font-bold leading-[120%]">
                    Choose time
                  </p>
                  <div className="flex gap-2">
                    <InputField
                      className="w-full"
                      inputText="12:00"
                      type="text"
                      value={singleStartTime}
                      setValue={setSingleStartTime}
                      id="single-start-time"
                    />
                    <InputField
                      className="w-full"
                      inputText="14:00"
                      type="text"
                      value={singleEndTime}
                      setValue={setSingleEndTime}
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
              <p className="text-[16px] text-[#FFF] font-bold leading-[120%]">
                Choose days
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
                    labelClass="text-[16px] text-[#FAFAF9] leading-[150%]"
                  />
                ))}
              </div>
              <DateInput
                label="Start date"
                value={startDate}
                onChange={setStartDate}
              />
              <DateInput
                label="Expiration date"
                value={expirationDate}
                onChange={setExpirationDate}
              />
            </>
          )}
          {!isRecurring && (
            <DateInput
              label="Date"
              value={singleDate}
              onChange={setSingleDate}
            />
          )}
          <div className="flex flex-col gap-2">
            <p className="text-[16px] text-[#FFF] font-bold leading-[120%]">
              Choose time
            </p>
            <div className="flex gap-2">
              <InputField
                className="w-full"
                inputText="12:00"
                type="text"
                value={isRecurring ? recurringStartTime : singleStartTime}
                setValue={
                  isRecurring ? setRecurringStartTime : setSingleStartTime
                }
                id={isRecurring ? "recurring-start-time" : "single-start-time"}
              />
              <InputField
                className="w-full"
                inputText="14:00"
                type="text"
                value={isRecurring ? recurringEndTime : singleEndTime}
                setValue={isRecurring ? setRecurringEndTime : setSingleEndTime}
                id={isRecurring ? "recurring-end-time" : "single-end-time"}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 w-full">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onCancel}
          disabled={isLoading}
          text={isEdit ? "Cancel" : "Go back"}
        />

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={isLoading}
          text={isLoading ? "Saving..." : isEdit ? "Confirm changes" : "Save"}
        />

        {isEdit && onDelete && (
          <Button
            variant="primary"
            className="w-full"
            onClick={handleDelete}
            disabled={isLoading}
            text="Delete"
          />
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;