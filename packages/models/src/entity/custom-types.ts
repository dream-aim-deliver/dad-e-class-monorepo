import { z } from 'zod';

export const RichText = z.string().brand<'RichText'>();
export type TRichText = z.infer<typeof RichText>;
