import React from "react";
import { Button } from "./button";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

/**
 * A reusable CoachBanner component that displays a promotional banner with text, an image, and a call-to-action button.
 *
 * @param locale The locale string used to fetch the appropriate translations.
 *
 * @returns A styled banner component containing a heading, description, image, and a button.
 *
 * @example <CoachBanner locale={props.locale as TLocale} />
 */
export const CoachBanner: React.FC<isLocalAware> = ({locale}) => {
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-col items-start self-stretch max-w-7xl mx-auto py-8 md:py-12 px-[40px] rounded-[16px] border border-solid border-card-stroke bg-card-fill">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start w-full h-full sm:gap-3">
        <div className="order-2 md:order-1 flex flex-col justify-start gap-4">
          <h2 className="text-2xl font-bold leading-[150%] text-base-white">
            {dictionary.components.coachBanner.title}: <br className="hidden md:block" /> {dictionary.components.coachBanner.subtitle}
          </h2>
          <p className="text-gray-300 text-md md:text-base leading-[150%] mb-6">
            {dictionary.components.coachBanner.description}
          </p>
          <Button
            variant="primary"
            size="big"
            text={dictionary.components.coachBanner.buttontext}
            className="self-start"
          />
        </div>

        <div className="order-1 md:order-2 h-full p-0 md:ml-10">
          <img
            src="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
            alt="People working together"
            className="rounded-xl w-full h-auto lg:max-h-[320px] md:h-auto object-cover mb-4 md:mb-0"
          />
        </div>
      </div>
    </div>
  );
};