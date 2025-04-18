import React, { useState, useEffect } from "react";
import CardListLayout from "../card-list-layout";
import CoachCard, { CoachCardDetails } from "./coach-card";
import { isLocalAware } from "@maany_shr/e-class-translations";

/**
 * A component that displays a list of coach cards in a responsive grid format.
 *
 * @param {Object} props - The component props.
 * @param {CoachCardDetails[]} props.coachCard - The array of coach card data to be displayed.
 *
 * @returns {JSX.Element} A responsive grid layout containing the coach cards.
 */
interface CoachListProps extends isLocalAware {
    title?: string;
    coaches: CoachCardDetails[];
    onClickBookSession?: () => void;
    onClickViewProfile?: () => void;
}

export default function CoachList({ coaches,title,onClickBookSession,onClickViewProfile,locale }: CoachListProps) {
  const [visibleCards, setVisibleCards] = useState(6);
  const allCoaches = [...coaches];
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(6);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(4);
      } else {
        setVisibleCards(2);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const displayedCoaches = allCoaches.slice(0, visibleCards);
  
  return (
    <div className="flex flex-col gap-10">
    <h3 className="text-text-primary lg:text-[40px] text-2xl">{title}</h3>
    <CardListLayout>
      {displayedCoaches.map(coach => (
        <CoachCard
          cardDetails={coach}
           onClickBookSession={onClickBookSession}
           onClickViewProfile={onClickViewProfile}
            locale={locale}
           />
      ))}
    </CardListLayout>
    </div>
  );
}