import { createClient } from '@supabase/supabase-js';

// Access environment variables for Supabase connection (Next.js client-side prefix)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetch all challenges
 */
export const getChallenges = async () => {
  return await supabase.from('challenges').select('*');
};

/**
 * Upload a proof file to the 'proofs' bucket and return its public URL
 */
export const uploadProof = async (file: File) => {
  const fileName = `${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('proofs')
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('proofs')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

/**
 * Approve a task and award XP
 */
export const approveProof = async (partId: number, userId: number, xpToAdd: number) => {
  // 1. Update participation status
  const { error: partError } = await supabase
    .from('participations')
    .update({ status: 'approved' })
    .eq('id', partId);

  if (partError) throw partError;

  // 2. Add XP to user
  // Fetch current XP first since we can't do "xp = xp + X" directly in standard update
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('xp')
    .eq('id', userId)
    .single();

  if (fetchError) throw fetchError;

  const newXp = (user?.xp || 0) + xpToAdd;

  const { error: userError } = await supabase
    .from('users')
    .update({ xp: newXp })
    .eq('id', userId);

  if (userError) throw userError;

  return { success: true, newXp };
};
