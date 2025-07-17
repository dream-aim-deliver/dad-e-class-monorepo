import { z } from "zod";
import { FileMetadataSchema } from "./file-metadata";

export const LinkSchema = z.object({
    url: z.string().url(),
    title: z.string(),  // plain text
    customIcon: FileMetadataSchema.optional(),  // custom icon, if any
});

export const LinkWithIdSchema = LinkSchema.extend({
    linkId: z.number(),
});

export type TLink = z.infer<typeof LinkSchema>;

export type TLinkWithId = z.infer<typeof LinkWithIdSchema>;