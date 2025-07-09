import { homePage } from '@maany_shr/e-class-models';
import { DefaultAccordion } from './accordion/default-accordion';

export interface HomeAccordionProps {
    title: string;
    items: homePage.TAccordionItem[];
    showNumbers?: boolean;
}

export function HomeAccordion({
    title,
    items,
    showNumbers,
}: HomeAccordionProps) {
    return <DefaultAccordion items={items.map((item) => ({
        title: item.title,
        iconImageUrl: item.iconImageUrl,
        content: item.content,
        position: item.position,
    }))} showNumbers={showNumbers}>
        <h3 className="text-text-primary lg:text-mega text-2xl">{title}</h3>
    </DefaultAccordion>;
}
