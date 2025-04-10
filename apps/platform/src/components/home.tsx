'use client';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Carousel,
  CoachingOnDemandBanner,
  Divider,
  GeneralCard,
  Hero,
  TopicList
} from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { getHomePage, listTopics } from './mock/queries';
import React from 'react';
import { homePage, topic } from '@maany_shr/e-class-models';
import { TAccordionList } from '../../../../packages/models/src/home-page';
import { cn } from '../../../../packages/ui-kit/lib/utils/style-utils';
import { UserAvatar } from '../../../../packages/ui-kit/lib/components/avatar/user-avatar';
import RichTextRenderer from '../../../../packages/ui-kit/lib/components/rich-text-element/renderer';

export type HomeProps = isLocalAware & isSessionAware & {
  homePage: homePage.THomePage,
  topics: topic.TTopic[],
};

// TODO: move into a separate component in UI Kit
const HomeAccordion: React.FC<TAccordionList> = ({
                                                   title,
                                                   showNumbers,
                                                   items
                                                 }) => {
  return (
    <Accordion className="flex flex-col gap-7" type="single" defaultValue={[items[0].title]}>
      <h2 className="text-text-primary">{title}</h2>
      <div className="w-full bg-card-fill rounded-medium border border-card-stroke py-4 px-6">
        {items?.map((item, index) => (
          <AccordionItem
            className={cn(
              'py-6',
              items.length - 1 !== index && 'border-b border-divider'
            )}
            key={item.title}
            value={item.title}
          >
            <AccordionTrigger
              value={item.title}


            >
              <div className="flex items-center gap-4">
                {showNumbers && item.position && <h4 className="text-action-default">{item.position}.</h4>}
                <div className="flex items-center gap-2">
                  {item.iconImageUrl && (
                    <UserAvatar imageUrl={item.iconImageUrl} size="small" />
                  )}
                  <h5 className="text-text-primary font-medium">{item.title}</h5>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent value={item.title} className="pl-8 pt-2 ">
              <RichTextRenderer content={item.content}
                                className="lg:text-md text-normal leading-[150%]  text-text-secondary" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </div>
    </Accordion>
  );
};

export default function Home(props: HomeProps) {
  const t = useTranslations('home');

  const homePage = props.homePage;
  const linkTopics = props.topics.map((topic) => ({
    ...topic,
    url: `/topics/${topic.name}`
  }));

  return (
    <div className="w-full flex flex-col items-center space-y-5">
      <Hero
        locale={props.locale}
        {...homePage.banner}
      />
      <Divider />
      <Carousel locale={props.locale}>
        {homePage.carousel.map((item) => {
          const onClick = () => {

          };
          return (
            <GeneralCard
              key={item.title}
              locale={props.locale}
              onButtonClick={onClick}
              {...item}
            />
          );
        })}
      </Carousel>
      <Divider />
      <TopicList list={linkTopics} title={t('topicsTitle')} />
      <Divider />
      <CoachingOnDemandBanner locale={props.locale} {...homePage.coachingOnDemand} />
      <Divider />
      <HomeAccordion {...homePage.accordion} />
    </div>
  );
}
