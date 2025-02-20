/* eslint-disable @typescript-eslint/no-explicit-any */
import {client} from '@/lib/client';
import {withSession} from '@/lib/withSession';

async function handler(req: any, res: any) {
    
    const {token} = req.query;

    try{
        const response = await client.magicLinks.authenticate({token});
        req.session.destroy();
        req.session.set('user', {
            user_id: response.user_id
        });
        await req.session.save();
        return res.redirect('/');

    } catch (error) {
        const errorString = JSON.stringify(error);
        return res.status(469).json({errorString});
    }
}

export default withSession(handler);