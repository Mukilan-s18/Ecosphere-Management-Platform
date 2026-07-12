/**
 * Ecosphere ESG Platform — Core API Helpers
 *
 * These functions simulate backend API calls for the gamification system.
 * In production, these would connect to Supabase or your backend service.
 */

export interface ApproveResult {
  success: boolean;
  xpAwarded: number;
}

/**
 * Approve a gamification proof submission and award XP to the participant.
 *
 * @param participationId - The ID of the challenge participation record
 * @param userId - The ID of the user receiving the XP
 * @param xp - The amount of XP to award
 * @returns Promise resolving to the approval result
 */
export async function approveProof(
  participationId: string,
  userId: string,
  xp: number
): Promise<ApproveResult> {
  // Simulated API call — replace with Supabase RPC in production
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, xpAwarded: xp };
}

/**
 * Reject a gamification proof submission with optional feedback.
 *
 * @param participationId - The ID of the challenge participation record
 * @param reason - Optional reason for rejection
 * @returns Promise resolving to success status
 */
export async function rejectProof(
  participationId: string,
  reason?: string
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true };
}
