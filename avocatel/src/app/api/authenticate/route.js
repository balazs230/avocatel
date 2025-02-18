import { withSession } from '@/lib/withSession';
import { client } from '@/lib/client';

async function GETHandler(req, res) {
    const { token } = req.query;

    try {
        const response = await client.magicLinks.authenticate(token);
        req.session.destroy();
        res.session.set('user', {
            user_id: response.user_id,
        });
        await req.session.save();
        return res.redirect('/');

    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({ error: 'Internal Server Error', details: error.message }),
            { status: 400 }
        );
    }
}

// Wrapping postHandler with session management for POST requests
export const GET = withSession(GETHandler);

