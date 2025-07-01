import { z } from "zod";

export const DefaultPaginationSchema = z.object({
    pagination: z.object({
        pageSize: z.number().int().min(1),
        page: z.number().int().min(1),
    }).optional(),
});
