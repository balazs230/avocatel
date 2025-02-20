import { client } from '@/lib/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 const response = await client.magicLinks.email.loginOrCreate({
   email: req.body.email,
   login_magic_link_url: 'http://localhost:3002/api/authenticate',
   signup_magic_link_url: 'http://localhost:3002/api/authenticate',
 });

 console.log(response);
 res.json(response);
}