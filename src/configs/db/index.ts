import mongoose, { ConnectOptions } from 'mongoose';
import config from 'config';

const dbProtocol = config.get<string>('dbProtocol');
const dbName = config.get<string>('dbName');
const dbHost = config.get<string>('dbHost');
const dbHostParams = config.get<string>('dbHostParams');
const dbPort = config.get<number>('dbPort');
const dbUser = config.get<string>('dbUser');
const dbPassword = config.get<string>('dbPassword');

export function getDBUri() {
  return `${dbProtocol}://${dbHost}${dbPort ? `:${dbPort}` : ''}${dbHostParams ? `${dbHostParams}` : ''}`;
}

export async function dbConnect() {
  mongoose.set('strictQuery', false);
  return mongoose.connect(getDBUri(),
    {
      noDelay: true,
      autoCreate: true,
      autoIndex: true,
      dbName: dbName,
      user: dbUser || undefined,
      pass: dbPassword || undefined,
    } as ConnectOptions
  );
}
