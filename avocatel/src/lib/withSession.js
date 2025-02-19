import {withIronSession} from 'next-iron-session'

export const withSession = (handler) => withIronSession(handler, {
    password: "complex_password_at_least_32_characters_long",
    cookieName: 'avocatel-auth',
    cookieOptions: {
        httpOnly: true,
    }
})