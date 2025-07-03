import { z } from "zod";

export const LinkSchema = z.object({
    linkId: z.number(),
    url: z.string().url(),
    title: z.string(),  // plain text
    customIconUrl: z.string().optional(),  // URL to a custom icon, if any
});

export type TLink = z.infer<typeof LinkSchema>;

