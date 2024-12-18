import config from 'config';
import crypto from 'crypto';

const serverProtocol = config.get('serverProtocol') as string;

export const sessionAuthTTLMinutes = 60 * 24;
export const sessionAuthKey = crypto.randomBytes(32);
export const sessionAuthRefreshMinutes = 15;

export const sessionAuthConfig = {
  key: sessionAuthKey,
  secret: crypto.randomBytes(32).toString('hex'),
  salt: 'ShMf250ld@__45s1',
  sessionName: 'sessionAuth',
  cookieName: 'sessionAuthCookie',
  cookie: {
    path: '/',
    maxAge: Date.convertHoursToMS(24 * 365),
    sameSite: 'lax',
    httpOnly: true,
    secure: serverProtocol !== 'http',
  },
  /*store: {
        set: async (key: any, value: any) => {
            const session = new sessionAuthModel({ key, value });
            await session.save();
        },
        get: async (key: any) => {
            const session = await sessionAuthModel.findOne({ key }).lean().exec();
            return session ? session : undefined;
        },
        delete: async (key: any) => {
            await sessionAuthModel.delete({ key });
        },
    },*/
  /*storage: {
        db: mongoose.connection.db,
        collection: sessionAuthModel,
    },*/
};
