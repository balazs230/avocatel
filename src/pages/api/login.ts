import supabaseClient from '@/lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Missing email in request body' });
  }

  // 1) Send the magic link
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: '/', // The page to redirect to after clicking the magic link
    },
  });

  // 2) Handle errors
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 3) Return success
  return res.status(200).json({ data });
}