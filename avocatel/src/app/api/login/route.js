import { client } from '../../../lib/client';

export async function POST(req) {
    try {
        const { email } = await req.json(); // Parsing the JSON body from the request

        const response = await client.magicLinks.email.loginOrCreate({
            email: email,
            login_magic_link_url: 'http://localhost:3002/api/authenticate',
            signup_magic_link_url: 'http://localhost:3002/api/authenticate',
        });

        console.log(response);
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error(error);

        // Return a 500 status code with an error message
        return new Response(
            JSON.stringify({ error: 'Internal Server Error', details: error.message }),
            { status: 500 }
        );
    }
}
