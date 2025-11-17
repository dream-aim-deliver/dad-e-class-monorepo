/**
 * Assignment types from cms-rest backend (authoritative source)
 *
 * This file re-exports types from @dream-aim-deliver/e-class-cms-rest
 * to provide a single source of truth for assignment-related types in the UI kit.
 *
 * DO NOT use the old assignment types from @maany_shr/e-class-models - they are outdated.
 *
 * KEY DIFFERENCES - OLD vs NEW:
 *
 * OLD (packages/models/src/assignment.ts):
 * - sender.name: string (email/username)
 * - sender.image: string
 * - Uses UserSchema { id, email, name, image }
 *
 * NEW (cms-rest - AUTHORITATIVE):
 * - sender.username: string (REQUIRED - use this for display)
 * - sender.name: string | null | undefined (optional first name)
 * - sender.surname: string | null | undefined (optional)
 * - sender.avatarUrl: string | null | undefined (use this, not 'image')
 * - sender.id: number
 * - sender.role: string
 * - sender.isCurrentUser: boolean
 *
 * DISPLAY RULES:
 * - ALWAYS use sender.username for display
 * - NEVER use sender.name for student display
 * - Use sender.avatarUrl (not image)
 * - Links use iconFile (not customIcon)
 */

export type {
    TAssignmentSenderResponse,
    TAssignmentReplyResponse,
    TAssignmentPassedResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Union type for all assignment reply types
 */
import type {
    TAssignmentReplyResponse,
    TAssignmentPassedResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

export type AssignmentReply = TAssignmentReplyResponse | TAssignmentPassedResponse;
