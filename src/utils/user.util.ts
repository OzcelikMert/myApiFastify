import Crypto from 'crypto';
import { Config } from '@configs/index';

const encodePassword = (password: string): string => {
  const passwordSaltArray = Config.passwordSalt.split('');
  const passwordArray = password.split('');
  let encryptedPassword = "";
  let passwordSaltIndex = 0;
  for (let i = 0; i < passwordArray.length; i++) {
    encryptedPassword += passwordArray[i];
    encryptedPassword += passwordSaltArray[passwordSaltIndex];
    passwordSaltIndex = passwordSaltIndex < passwordSaltArray.length ? passwordSaltIndex + 1 : 0;
  }
  return Crypto.createHash('sha256')
    .update(encryptedPassword)
    .digest('hex');
};

export const UserUtil = {
  encodePassword: encodePassword,
};