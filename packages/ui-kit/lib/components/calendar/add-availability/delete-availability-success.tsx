import {Button} from "../../button";
import { FC } from "react";
import { TAvailability, TRecurringAvailability, TSingleAvailability } from "./availability-manager";
import { IconSuccess } from "../../icons/icon-success";
import { IconCalendar } from "../../icons/icon-calendar";
import { IconClock } from "../../icons/icon-clock";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { IconButton } from "../../icon-button";
import { IconClose } from "../../icons/icon-close";
interface DeleteAvailabilitySuccessProps extends isLocalAware {
  availability: TAvailability;
  onClose: () => void;
}

const getDurationInMinutes = (start: string, end: string) => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  return (endH * 60 + endM) - (startH * 60 + startM);
};

const DeleteAvailabilitySuccess: FC<DeleteAvailabilitySuccessProps> = ({
  availability,
  onClose,
  locale,
}) => {
  const dictionary = getDictionary(locale);
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
            onClick={onClose}
            className="text-button-text-text"
        />
      </div>
      <div className="flex flex-col items-start gap-4">
        <IconSuccess 
          classNames="text-feedback-success-primary" 
        />
        <p className="text-lg text-base-white font-bold leading-[120%]">
          {dictionary.components.calendar.availabilityManagement.availablitySlotDeletedText}
        </p>
        <div className="flex flex-col gap-3 p-4 bg-card-stroke border border-divider rounded-medium w-full">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <IconCalendar 
                size="4"
                classNames="text-text-secondary"
              />
              <p className="text-xs text-text-secondary">
                {dictionary.components.calendar.availabilityManagement.dateText}
              </p>
            </div>
            <p className="text-sm text-text-primary font-bold">{date}</p>
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
              {startTime}-{endTime} ({duration} {dictionary.components.calendar.availabilityManagement.minText})
            </p>
          </div>
        </div>
      </div>
      <Button 
        className="w-full" 
        onClick={onClose} 
        text={dictionary.components.calendar.availabilityManagement.closeText}
      />
    </div>
  );
};

export default DeleteAvailabilitySuccess;