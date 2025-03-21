import React from 'react'
import Accordion from '../accordion'
import AccordionItem from '../accordion-item'
import AccordionTrigger from '../accordion-trigger'
import AccordionContent from '../accordion-content'
import {cn} from "../../../utils/style-utils"

interface AccordionItemProps {
  value: string;
  title: string;
  content: any;
  number?: number;
  placeholderIcon?: React.ReactNode;
}

export interface HomeAccordionProps {
  accordionTitle: string;
  accordionItems: AccordionItemProps[];
  collapsedText?: string;
  position?: number;
}

const HomeAccordion: React.FC<HomeAccordionProps> = ({
  accordionTitle,
  accordionItems,
  collapsedText,
  position,
}) => {
  return (
    <Accordion
      
      type="single"
      defaultValue={["item-1"]}
    >
      <div className="text-[#FAFAF9] text-[42px] mb-4">{accordionTitle}</div>
<div
className="md:w-3/4 w-full bg-card-fill rounded-medium border-1 border-card-stroke py-4 md:py-4 px-6"
>
      {accordionItems.map((item, index) => (
        <AccordionItem className={cn('py-6', accordionItems.length - 1 !== index && 'border-b border-divider')} key={item.value} value={item.value}>
          <AccordionTrigger
            value={item.value}
            hasNumber={item.number !== undefined}
            number={item.number}
            hasIcon={item.placeholderIcon !== undefined}
            placeholderIcon={item.placeholderIcon}
          >
            <h5 className="text-  text-text-primary font-medium">{item.title}</h5>
          </AccordionTrigger>
          <AccordionContent value={item.value}>
            <p className="space-y-4 text-text-secondary  leading-7">{item.content}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
</div>
      {collapsedText && (
        <div className="mt-4 text-gray-500 italic">{collapsedText}</div>
      )}
    </Accordion>
  );
};

export default HomeAccordion;
