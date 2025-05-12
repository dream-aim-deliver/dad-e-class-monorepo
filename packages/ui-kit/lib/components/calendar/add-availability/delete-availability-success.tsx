import {Button} from "../../button";
import React, { FC } from "react";
import { TAvailability, TRecurringAvailability, TSingleAvailability } from "./availability-manager";
interface DeleteAvailabilitySuccessProps {
  availability: TAvailability;
  onClose: () => void;
}

const DeleteAvailabilitySuccess: FC<DeleteAvailabilitySuccessProps> = ({
  availability,
  onClose,
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="32"
          viewBox="0 0 33 32"
          className="fill-successprimary"
        >
          <path d="M16.5 3.00195C13.9288 3.00195 11.4154 3.76439 9.27758 5.19285C7.13975 6.62131 5.47351 8.65163 4.48957 11.0271C3.50563 13.4025 3.24819 16.0164 3.7498 18.5381C4.2514 21.0599 5.48953 23.3763 7.30761 25.1943C9.12569 27.0124 11.4421 28.2506 13.9638 28.7522C16.4856 29.2538 19.0994 28.9963 21.4749 28.0124C23.8503 27.0285 25.8806 25.3622 27.3091 23.2244C28.7375 21.0865 29.5 18.5731 29.5 16.002C29.4934 12.5562 28.1216 9.25341 25.6851 6.81686C23.2485 4.38032 19.9458 3.00856 16.5 3.00195ZM22.6875 13.727L15.3625 20.727C15.1731 20.9051 14.9225 21.0036 14.6625 21.002C14.5354 21.0038 14.4092 20.9804 14.2912 20.9332C14.1732 20.886 14.0658 20.8159 13.975 20.727L10.3125 17.227C10.2109 17.1383 10.1283 17.30.0696 16.9087C10.0109 16.7873 9.9774 16.6553 9.97103 16.5207C9.96466 16.386 9.98558 16.2515 10.0325 16.1251C10.0795 15.9987 10.1515 15.8832 10.2443 15.7853C10.3371 15.6875 10.4486 15.6095 10.5723 15.5559C10.696 15.5023 10.8293 15.4742 10.9641 15.4734C11.0989 15.4727 11.2325 15.4991 11.3568 15.5513C11.4811 15.6035 11.5936 15.6802 11.6875 15.777L14.6625 18.6145L21.3125 12.277C21.5069 12.1073 21.7594 12.0194 22.0172 12.0316C22.2749 12.0438 22.518 12.1552 22.6955 12.3424C22.8731 12.5296 22.9714 12.7783 22.9699 13.0363C22.9684 13.2943 22.8672 13.5418 22.6875 13.727Z" />
        </svg>
        <p className="text-[18px] text-[#FFF] font-bold leading-[120%]">
          Availability Slot deleted
        </p>
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
      <Button className="w-full" onClick={onClose} text="Close"/>
    </div>
  );
};

export default DeleteAvailabilitySuccess;