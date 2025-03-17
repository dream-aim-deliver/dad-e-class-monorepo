import { z } from 'zod'

export const ActionSchema = z.object({
    title: z.string(),
    url: z.string(),
});

/**
 * Schema for action.
 * 
 * This schema validates the structure of action objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `title`: A string representing the title of the action.
 * - `url`: A string representing the URL of the action.
 */
export type TAction = z.infer<typeof ActionSchema>


export const NotificationSchema = z.object({
    message: z.string(),
    action: ActionSchema,
    timestamp: z.string().datetime({ offset: true }),
    isRead: z.boolean(),
});

/**
 * Schema for notification.
 * 
 * This schema validates the structure of notification objects, ensuring they contain
 * the required properties with the correct types.
 *  
 * Properties:
 * - `from`: A number representing the User ID of the sender.
 * - `to`: A number representing the User ID of the recipient.
 * - `message`: A string representing the content of the notification.
 * - `action`: An object containing the action details. It has the following properties:
 *  - `title`: A string representing the title of the action.
 *  - `url`: A string representing the URL of the action.
 * - `timestamp`: A string representing the timestamp of the notification. It should contain a valid date and time, with a timezone offset.
 * - `isRead`: A boolean indicating whether the notification has been read.
*/
export type TNotification = z.infer<typeof NotificationSchema>
