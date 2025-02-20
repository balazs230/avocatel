import { withIronSession } from "next-iron-session";

import { NextApiHandler } from 'next';

export const withSession = (handler: NextApiHandler) => withIronSession(handler, {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: "avocatel-auth",
  cookieOptions: {
    httpOnly: true,
  },
});