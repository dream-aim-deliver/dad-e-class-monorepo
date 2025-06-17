import { z } from "zod";

export const LinkSchema = z.object({
    url: z.string().url(),
    title: z.string(),  // plain text
    customIconUrl: z.string().optional(),  // URL to a custom icon, if any
});

export type TLink = z.infer<typeof LinkSchema>;

