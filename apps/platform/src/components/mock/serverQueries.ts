import { getApiV1RepositoryFileIdGet, listApiV1RepositoryHomePageGet } from '@maany_shr/e-class-cms-fastapi-sdk';
import { models } from '@maany_shr/e-class-core';
import { minioRepository } from '../../lib/infrastructure/minio/demo-minio';
import { TLocale } from '@maany_shr/e-class-translations';
import { homePage, topic } from '@maany_shr/e-class-models';

const getSignedUrl = async (fileId: number): Promise<string> => {
  const result = await getApiV1RepositoryFileIdGet({
    headers: {
      "x-auth-token": "test123",
    },
    query: { id: fileId },
  })
  const data = result.data;
  if (!data || !data.success) {
    throw Error('Cannot load file');
  }
  const lfn = data.data.lfn;
  const file: models.file.TFile = {
    id: String(fileId),
    externalId: data.data.external_id,
    provider: data.data.provider,
    lfn: lfn,
  }
  const resultSigned = await minioRepository.getClientDataForDownload(file);
  if (!resultSigned.success) {
    throw Error('Cannot load file');
  }
  return resultSigned.data.credentials;
}

const getExternalId = async (fileId: number): Promise<string> => {
  const result = await getApiV1RepositoryFileIdGet({
    headers: {
      "x-auth-token": "test123",
    },
    query: { id: fileId },
  })
  const data = result.data;
  if (!data || !data.success) {
    throw Error('Cannot load file');
  }
  return data.data.external_id;
}

export const getRealHomePage = async (locale: TLocale): Promise<homePage.THomePage> => {
  const result = await listApiV1RepositoryHomePageGet({
    headers: {
      "x-auth-token": "test123",
    },
    query: { platform_language_id: 1 },
  });
  const data = result.data;
  if (!data || !data.success || data.data.length === 0) {
    throw Error('Cannot load a home page');
  }
  const homePage = data.data[0];
  // TODO: load file IDs from MinIO
  const transformedHomePage: homePage.THomePage = {
    banner: {
      title: homePage.hero.title,
      description: homePage.hero.description,
      videoId: await getExternalId(homePage.hero.video_file_id),
      thumbnailUrl: await getSignedUrl(homePage.hero.thumbnail_file_id),
    },
    carousel: await Promise.all(homePage.carousel.map(async item => ({
      title: item.title,
      description: item.description,
      imageUrl: await getSignedUrl(item.image_file_id), // Convert file_id to URL
      buttonText: item.button_text,
      buttonUrl: item.button_link,
      badge: item.badge,
    }))),
    coachingOnDemand: {
      title: homePage.coaching_on_demand.title,
      description: homePage.coaching_on_demand.description,
      desktopImageUrl: await getSignedUrl(homePage.coaching_on_demand.desktop_img_file_id),
      tabletImageUrl: await getSignedUrl(homePage.coaching_on_demand.tablet_img_file_id),
      mobileImageUrl: await getSignedUrl(homePage.coaching_on_demand.mobile_img_file_id),
    },
    accordion: {
      title: homePage.accordion.title,
      showNumbers: homePage.accordion.show_numbers,
      items: await Promise.all(homePage.accordion.list.map(async item => ({
        title: item.title,
        content: item.description,
        position: item.position,
        iconImageUrl: await getSignedUrl(item.icon_img_file_id), // Convert file_id to URL
      }))),
    },
  };
  console.log(transformedHomePage)
  return transformedHomePage;
}
