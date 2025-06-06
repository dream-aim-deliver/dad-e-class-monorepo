import { FC } from "react";
import { TSingleAvailability, TRecurringAvailability } from "./availability-manager";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconCalendar } from "../../icons/icon-calendar";
import { IconClock } from "../../icons/icon-clock";
import { Button } from "../../button";
import { IconTrashAlt } from "../../icons/icon-trash-alt";
import { IconRepeat } from "../../icons/icon-repeat";
import { IconButton } from "../../icon-button";
import { IconClose } from "../../icons/icon-close";
import { IconLoaderSpinner } from "../../icons/icon-loader-spinner";

// Props for single and recurring
export interface AvailabilityDetailsSingleProps extends isLocalAware {
  availability: TSingleAvailability;
  onClickCancel: () => void;
  onClickClose: () => void;
  isError?: boolean;
  isLoading?: boolean;
}

export interface AvailabilityDetailsRecurringProps extends isLocalAware {
  availability: TRecurringAvailability;
  onClickCancel: () => void;
  onClickEdit: () => void;
  onClickClose: () => void;
  isError?: boolean;
  isLoading?: boolean;  
}

export type AvailabilityDetailsProps =
  | AvailabilityDetailsSingleProps
  | AvailabilityDetailsRecurringProps;

// Utility: Calculate duration in minutes
const getDurationInMinutes = (start: string, end: string) => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  return endH * 60 + endM - (startH * 60 + startM);
};

export const AvailabilityDetails: FC<AvailabilityDetailsProps> = (props) => {
  const { availability, isError, isLoading, onClickCancel, onClickClose , locale } = props;
  const dictionary = getDictionary(locale);

  // Discriminated union
  const isRecurring = availability.type === "recurring";
  const date = isRecurring
    ? (availability as TRecurringAvailability).startDate
    : (availability as TSingleAvailability).date;
  const startTime = availability.startTime;
  const endTime = availability.endTime;
  const duration = getDurationInMinutes(startTime, endTime);

  return (
    <div className="flex flex-col gap-6 w-[340px] p-6 bg-card-fill border-[1px] border-card-stroke rounded-medium shadow-[0px_4px_12px_0px_#09090B] relative">
      <div className="absolute right-0 top-0">
        <IconButton
            data-testid="close-modal-button"
            styles="text"
            icon={<IconClose />}
            size="small"
            onClick={onClickClose}
            className="text-button-text-text"
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg text-base-white font-bold leading-[120%]">
          {dictionary.components.calendar.availabilityManagement.deleteAvailabilityText}
        </p>
        {isError && (
          <p className="text-feedback-error-primary">
            {dictionary.components.calendar.availabilityManagement.failedToDeleteText}
          </p>
        )}
        <div className="flex flex-col gap-3 p-4 bg-card-stroke border border-divider rounded-medium w-full">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <IconCalendar size="4" classNames="text-text-secondary" />
              <p className="text-[12px] text-text-secondary">
                {dictionary.components.calendar.availabilityManagement.dateText}
              </p>
            </div>
            <p className="text-xs text-text-secondary font-bold">{date}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <IconClock size="4" classNames="text-text-secondary" />
              <p className="text-xs text-text-secondary">
                {dictionary.components.calendar.availabilityManagement.timeSlotText}
              </p>
            </div>
            <p className="text-sm text-text-primary font-bold">
              {startTime}-{endTime} ({duration} {dictionary.components.calendar.availabilityManagement.minText})
            </p>
          </div>
        </div>
        {isRecurring && (
            <div className="flex flex-col gap-2 p-4 bg-card-stroke border border-divider rounded-medium w-full">
                <div className="flex gap-1">
                    <IconRepeat 
                        size="4" 
                        classNames="text-text-secondary" 
                    />
                    <p className="text-xs text-text-secondary">
                        {dictionary.components.calendar.availabilityManagement.repeatsEveryText}
                    </p>
                </div>
                <div className="flex gap-1 items-center">
                    {availability.days.map((day, index) => (
                        <>
                            <span
                                key={index} 
                                className="text-sm text-text-primary font-bold"
                            >
                                {day}
                            </span>
                            {index < availability.days.length - 1 && (
                                <span className="text-sm text-text-primary font-bold">, </span>
                            )}
                        </>
                    ))}
                </div>
            </div>
        )}
      </div>
      <div className="relative flex flex-col gap-2 w-full">
        <Button
          variant="primary"
          className="w-full"
          onClick={onClickCancel}
          hasIconLeft
          iconLeft={<IconTrashAlt />}
          disabled={isLoading}
          text={dictionary.components.calendar.availabilityManagement.cancelThisSlotText}
        />
        {isRecurring && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={(props as AvailabilityDetailsRecurringProps).onClickEdit}
            hasIconLeft
            iconLeft={<IconRepeat />}
            disabled={isLoading}
            text={dictionary.components.calendar.availabilityManagement.editRecurringAvailabilityText}
          />
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};
