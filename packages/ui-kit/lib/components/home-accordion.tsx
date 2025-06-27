import React from 'react';
import Accordion from './accordion/accordion';
import AccordionItem from './accordion/accordion-item';
import { cn } from '../utils/style-utils';
import AccordionTrigger from './accordion/accordion-trigger';
import { homePage } from '@maany_shr/e-class-models';
import AccordionContent from './accordion/accordion-content';
import RichTextRenderer from './rich-text-element/renderer';

export interface HomeAccordionProps {
    title: string;
    items: homePage.TAccordionItem[];
    showNumbers?: boolean;
}

export function HomeAccordion({ title, items, showNumbers }: HomeAccordionProps) {
    const defaultValue = items?.length ? [items[0].title] : [];

    return (
        <Accordion className="flex flex-col gap-7" type="single" defaultValue={defaultValue}>
            <h3 className="text-text-primary lg:text-mega text-2xl">{title}</h3>
            <div className="w-full">
                {items?.map((item, index) => (
                    <AccordionItem
                        className={cn(
                            'py-6',
                            items.length - 1 !== index && 'border-b border-divider'
                        )}
                        key={item.title}
                        value={item.title}
                    >
                        <AccordionTrigger value={item.title}>
                            <div className="flex items-center gap-4">
                                {showNumbers && item.position &&
                                    <h4 className="text-action-default">{item.position}.</h4>}
                                <div className="flex items-center gap-4">
                                    {item.iconImageUrl && <img alt={item.title} src={item.iconImageUrl} className="w-8 h-8"/>}
                                    <h5 className="text-text-primary font-medium">{item.title}</h5>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent value={item.title} className={cn("pt-4", showNumbers && "pl-8")}>
                            <RichTextRenderer content={item.content}
                                              onDeserializationError={() => console.error('Error deserializing content')}
                                              className="lg:text-md text-normal leading-[150%]  text-text-secondary" />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </div>
        </Accordion>
    );
}
