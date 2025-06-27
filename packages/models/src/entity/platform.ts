import { z } from 'zod';
import {
    BaseModelDraftSchemaFactory,
    BaseModelCreatedSchemaFactory,
    BaseModelDeletedSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { FileMetadataCreatedSchema } from './file-model';
import { RichText } from './custom-types';

export const PlatformDraftSchema = BaseModelDraftSchemaFactory(
    z.object({
        name: z.string(),
        // TODO: how are we going to implement those? haven't we decided on not including these in the configuration?
        accentColor: z.string(),
        font: z.string(),
        hasOnlyFreeCourses: z.boolean(), // TBD, not really sure why would we need this
        public: z.boolean(),
        footerContent: RichText,
    }),
);

export const PlatformCreatedSchema =
    BaseModelCreatedSchemaFactory(PlatformDraftSchema);

export const PlatformDeletedSchema =
    BaseModelDeletedSchemaFactory(PlatformDraftSchema);

export const PlatformIndexSchema = z.object({
    byId: z.string(),
});

export const PlatformRelationsSchema = z.object({
    logo: FileMetadataCreatedSchema,
    backgroundImage: FileMetadataCreatedSchema,
});
