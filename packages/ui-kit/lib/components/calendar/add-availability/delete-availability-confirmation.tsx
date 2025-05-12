import {Button} from "../../button";
import React, { FC } from "react";
import { TAvailability, TRecurringAvailability, TSingleAvailability } from "./availability-manager";

interface DeleteAvailabilityConfirmationProps {
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
}) => {
  const isRecurring = availability.type === "recurring";
  const date = isRecurring
    ? (availability as TRecurringAvailability).startDate
    : (availability as TSingleAvailability).date;
  const startTime = availability.startTime;
  const endTime = availability.endTime;

  return (
    <div className="flex flex-col gap-6 w-[340px] p-6 bg-[#18181B] border-[1px] border-[#27272A] rounded-[8px] shadow-[0px_4px_12px_0px_#09090B]">
      <div className="flex flex-col items-start gap-4">
        <p className="text-[18px] text-[#FFF] font-bold leading-[120%]">
          Delete Availability Slot?
        </p>
        {isError && (
          <p className="text-red-500">Failed to delete. Please try again.</p>
        )}
        <div className="flex flex-col gap-3 p-4 bg-[#292524] border border-[#44403C] rounded-[8px] w-full">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                className="fill-tbase"
              >
                <path d="M2.5 4.0026V13.3359C2.5 13.6896 2.64048 14.0287 2.89052 14.2787C3.14057 14.5288 3.47971 14.6693 3.83333 14.6693H13.1667C13.5203 14.6693 13.8594 14.5288 14.1095 14.2787C14.3595 14.0287 14.5 13.6896 14.5 13.3359V4.0026C14.5 3.64898 14.3595 3.30984 14.1095 3.0598C13.8594 2.80975 13.5203 2.66927 13.1667 2.66927H11.8333V1.33594H10.5V2.66927H6.5V1.33594H5.16667V2.66927H3.83333C3.47971 2.66927 3.14057 2.80975 2.89052 3.0598C2.64048 3.30984 2.5 3.64898 2.5 4.0026ZM13.1667 13.3359H3.83333V5.33594H13.1667V13.3359Z" />
              </svg>
              <p className="text-[12px] text-tbase">Date</p>
            </div>
            <p className="text-[14px] text-[#FAFAF9] font-bold">{date}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                className="fill-tbase"
              >
                <path d="M9.13158 4.63353C9.13158 4.28472 8.84881 4.00195 8.5 4.00195C8.15119 4.00195 7.86842 4.28472 7.86842 4.63353V7.79143C7.86842 8.25651 8.24544 8.63353 8.71053 8.63353H11.8684C12.2172 8.63353 12.5 8.35076 12.5 8.00195C12.5 7.65314 12.2172 7.37037 11.8684 7.37037H9.13158V4.63353Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.5 16.002C12.9183 16.002 16.5 12.4202 16.5 8.00195C16.5 3.58368 12.9183 0.00195312 8.5 0.00195312C4.08172 0.00195312 0.5 3.58368 0.5 8.00195C0.5 12.4202 4.08172 16.002 8.5 16.002ZM12.2207 14.7388C4.77935 14.7388 1.76316 11.7226 1.76316 8.00195C1.76316 4.2813 4.77935 1.26511 8.5 1.26511C12.2207 1.26511 15.2368 4.2813 15.2368 8.00195Z"
                />
              </svg>
              <p className="text-[12px] text-tbase">Time slot</p>
            </div>
            <p className="text-[14px] text-[#FAFAF9] font-bold">
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
          text="Back"
        />
        
        <Button
          className="w-full"
          onClick={() => onConfirm(availability.id)}
          disabled={isLoading}
          text={isLoading ? "Deleting..." : "Confirm"}
        />
         
      </div>
    </div>
  );
};

export default DeleteAvailabilityConfirmation;