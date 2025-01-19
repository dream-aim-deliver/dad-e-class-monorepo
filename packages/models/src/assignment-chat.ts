import { z } from 'zod'


export const AssignmentUploadedFileSchema = z.object({
    url: z.instanceof(File).or(z.string()),
    name: z.string(),
    size: z.number(),  // in bytes
})

export type TAssignmentUploadedFile = z.infer<typeof AssignmentUploadedFileSchema>

export const AssignmentLinksSchema = z.object({
    link: z.string(),
    title: z.string(),
    image: z.instanceof(File).or(z.string()),
})

export type TAssignmentLinks = z.infer<typeof AssignmentLinksSchema>


export const AssignmentMessageSchema = z.object({
    timedate: z.string().datetime(),
    message: z.string(),
    description: z.string(),
    links: z.array(AssignmentLinksSchema).default([]),
    files: z.array(AssignmentUploadedFileSchema).default([]),
})

export type TAssignmentMessage = z.infer<typeof AssignmentMessageSchema>

export const AssignmentChatSchema = z.object({
    isStudent: z.boolean(),
    message: AssignmentMessageSchema,
})

/**
 * Schema for an Assignment Chat
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */
export type TAssignmentChat = z.infer<typeof AssignmentChatSchema>
