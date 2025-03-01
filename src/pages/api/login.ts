import supabaseClient from '@/lib/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: req.body.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'http://localhost:3002',
    }
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}