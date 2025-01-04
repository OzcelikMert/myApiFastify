import Crypto from 'crypto';
import { Config } from '@configs/index';

const mixWithSalt = (password: string): string => {
  const passwordSaltArray = Config.passwordSalt.split('');
  const passwordArray = password.split('');
  let encryptedPassword = '';
  let passwordSaltIndex = 0;
  for (let i = 0; i < passwordArray.length; i++) {
    encryptedPassword += passwordArray[i];
    encryptedPassword += passwordSaltArray[passwordSaltIndex];
    passwordSaltIndex =
      passwordSaltIndex < passwordSaltArray.length ? passwordSaltIndex + 1 : 0;
  }
  return encryptedPassword;
};

const encodePassword = (password: string): string => {
  const encryptedPassword = mixWithSalt(password);
  const hashedPassword = Crypto.createHash('sha256')
    .update(encryptedPassword)
    .digest('hex');
  return hashedPassword;
};

export const UserUtil = {
  encodePassword: encodePassword,
};
