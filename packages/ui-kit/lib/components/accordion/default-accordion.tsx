import Accordion from "./accordion";
import AccordionItem from "./accordion-item";
import { cn } from '../../utils/style-utils';
import AccordionTrigger from "./accordion-trigger";
import AccordionContent from "./accordion-content";
import RichTextRenderer from "./../rich-text-element/renderer";
import { useImageComponent } from '../../contexts/image-component-context';

interface DefaultAccordionProps {
    items: {
        title: string;
        iconImageUrl?: string;
        content: string;
        position?: number;
    }[]
    children?: React.ReactNode;
    showNumbers?: boolean;
    className?: string;
}

export function DefaultAccordion({ items, children, showNumbers, className }: DefaultAccordionProps) {
    const ImageComponent = useImageComponent();
    const defaultValue = items?.length ? [items[0].title] : [];

    return <Accordion
            className={cn("flex flex-col gap-7", className)}
            type="single"
            defaultValue={defaultValue}
        >
            {children}
            <div className="w-full">
                {items?.map((item, index) => (
                    <AccordionItem
                        className={cn(
                            'py-6',
                            items.length - 1 !== index &&
                                'border-b border-divider',
                        )}
                        key={item.title}
                        value={item.title}
                    >
                        <AccordionTrigger value={item.title}>
                            <div className="flex items-center gap-4">
                                {showNumbers && item.position && (
                                    <h4 className="text-action-default">
                                        {item.position}.
                                    </h4>
                                )}
                                <div className="flex items-center gap-4">
                                    {item.iconImageUrl && (
                                        <ImageComponent
                                            alt={item.title}
                                            src={item.iconImageUrl}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8"
                                        />
                                    )}
                                    <h5 className="text-text-primary font-medium">
                                        {item.title}
                                    </h5>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent
                            value={item.title}
                            className={cn('pt-4', showNumbers && 'pl-8')}
                        >
                            <RichTextRenderer
                                content={item.content}
                                className="lg:text-md text-normal leading-[150%]  text-text-secondary"
                                onDeserializationError={(message, error) => {
                                    console.error(
                                        'Error deserializing content:',
                                        message,
                                        error,
                                    );
                                }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </div>
        </Accordion>
}