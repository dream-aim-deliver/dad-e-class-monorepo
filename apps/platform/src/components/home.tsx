'use client';
import { Hero, TopicList } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTranslations } from 'next-intl';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { getHomePage, listTopics } from './mock/queries';

export type HomeProps = isLocalAware & isSessionAware;

export default function Home(props: HomeProps) {
  const t = useTranslations('home');

  const homePage = getHomePage(props.locale);
  const topics = listTopics(props.locale);

  const linkTopics = topics.map((topic) => ({
    ...topic,
    url: `/topics/${topic.name}`,
  }));

  return (
    <div className="w-full flex flex-col items-center space-y-5">
      <Hero
        locale={props.locale}
        title={homePage.banner.title}
        description={homePage.banner.description}
        videoId={homePage.banner.videoId}
        thumbnailUrl={homePage.banner.thumbnailUrl}
      />
      <TopicList list={linkTopics} title={t('topicsTitle')}/>
    </div>
  );
}
