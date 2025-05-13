import {Button} from "../../button";
import React, { FC } from "react";
import { TAvailability, TRecurringAvailability, TSingleAvailability } from "./availability-manager";
import { IconCalendar } from "../../icons/icon-calendar";
import { IconClock } from "../../icons/icon-clock";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

interface DeleteAvailabilityConfirmationProps extends isLocalAware {
  availability: TAvailability;
  isLoading?: boolean;
  isError?: boolean;
  onConfirm: (id: number) => void;
  onCancel: () => void;
}

const DeleteAvailabilityConfirmation: FC<DeleteAvailabilityConfirmationProps> = ({
  availability,
  isLoading = false,
  isError = false,
  onConfirm,
  onCancel,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const isRecurring = availability.type === "recurring";
  const date = isRecurring
    ? (availability as TRecurringAvailability).startDate
    : (availability as TSingleAvailability).date;
  const startTime = availability.startTime;
  const endTime = availability.endTime;

  return (
    <div className="flex flex-col gap-6 w-[340px] p-6 bg-card-fill border-[1px] border-card-stroke rounded-medium shadow-[0px_4px_12px_0px_#09090B]">
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
              <IconCalendar 
                size="4"
                classNames="text-text-secondary"
              />
              <p className="text-[12px] text-text-secondary">
                {dictionary.components.calendar.availabilityManagement.dateText}
              </p>
            </div>
            <p className="text-xs text-text-secondary font-bold">{date}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <IconClock 
                size="4"
                classNames="text-text-secondary"
              />
              <p className="text-xs text-text-secondary">
                {dictionary.components.calendar.availabilityManagement.timeSlotText}
              </p>
            </div>
            <p className="text-sm text-text-primary font-bold">
              {startTime}-{endTime}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onCancel}
          disabled={isLoading}
          text={dictionary.components.calendar.availabilityManagement.backText}
        />
        
        <Button
          className="w-full"
          onClick={() => onConfirm(availability.id)}
          disabled={isLoading}
          text={isLoading ? dictionary.components.calendar.availabilityManagement.deletingText : dictionary.components.calendar.availabilityManagement.confirmText}
        />
         
      </div>
    </div>
  );
};

export default DeleteAvailabilityConfirmation;