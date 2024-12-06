import { FastifyInstance } from 'fastify';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import http from 'http';
import https from 'https';
import * as path from 'path';
import { generate } from 'generate-password';
import chalk from 'chalk';
import fs from 'fs';
import { IConfig } from 'types/config';
import { UserService } from '@services/user.service';
import { UserRoleId } from '@constants/userRoles';
import { StatusId } from '@constants/status';
import { LanguageService } from '@services/language.service';
import { SettingService } from '@services/setting.service';
import { PathUtil } from '@utils/path.util';
import { sessionAuthConfig } from '@configs/session/session.auth.config';
import { dbConnect } from '@configs/db';
import { Timers } from '@timers/index';
import config from 'config';

const Config: IConfig = {
  passwordSalt: '_@QffsDh14Q',
  publicFolders: [['uploads']],
  onlineUsers: [],
  paths: {
    root: '',
    uploads: {
      get images() {
        return path.resolve(Config.paths.root, 'uploads', 'images');
      },
      get flags() {
        return path.resolve(Config.paths.root, 'uploads', 'flags');
      },
      get video() {
        return path.resolve(Config.paths.root, 'uploads', 'video');
      },
      get static() {
        return path.resolve(Config.paths.root, 'uploads', 'static');
      },
    },
  },
  defaultLangId: '',
};

class InitConfig {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
    Config.paths.root = path.resolve('./', 'src');
  }

  async init() {
    await this.setPublicFolders();
    await this.setSession();
    await this.security();
    await this.mongodbConnect();
    await this.checkSuperAdminUser();
    await this.checkLanguages();
    await this.checkSettings(); 
    await this.initTimers();

    return this.app;
  }

  private security() {
    http.globalAgent.maxSockets = Infinity;
    https.globalAgent.maxSockets = Infinity;
  }

  private async setPublicFolders() {
    console.log(chalk.green('#Public Folders'));

    for (const publicFolder of Config.publicFolders) {
      let folderPath = '';

      publicFolder.forEach((publicFolderPath) => {
        folderPath = PathUtil.createPath(folderPath, publicFolderPath);
      });
      folderPath = folderPath.slice(1);

      if (!fs.existsSync(path.resolve(Config.paths.root, folderPath))) {
        fs.mkdirSync(path.resolve(Config.paths.root, folderPath));
      }

      await this.app.register(fastifyStatic, {
        root: path.resolve(Config.paths.root, folderPath),
        prefix: `/${folderPath}`,
      });

      console.log(
        chalk.blue(` - /${folderPath}`) +
          ` : ${path.resolve(Config.paths.root, folderPath)}`
      );
    }
  }

  private async setSession() {
    await this.app.register(fastifyCookie, {
      secret: sessionAuthConfig.secret,
    });
    await this.app.register(fastifySecureSession, sessionAuthConfig as any);
  }

  private async mongodbConnect() {
    try {
      await dbConnect();
      console.log(chalk.green(`#MongoDB`));
      console.log(chalk.blue(`- Connected`));
    } catch (e) {
      console.error('MongoDB Connection Error');
      console.error(e);
    }
  }

  private async checkSuperAdminUser() {
    if (!(await UserService.get({ roleId: UserRoleId.SuperAdmin }))) {
      const password = generate({
        length: 10,
      });
      await UserService.add({
        name: 'Super Admin',
        email: 'admin@admin.com',
        statusId: StatusId.Active,
        password: password,
        roleId: UserRoleId.SuperAdmin,
        permissions: [],
      });
      console.log(chalk.green(`#Admin Account`));
      console.log(chalk.blue(`- Created`));
      console.log(chalk.blue(`- Password: ${password}`));
    }
  }

  private async checkLanguages() {
    const serviceResultGet = await LanguageService.get({ isDefault: true });
    if (serviceResultGet) {
      Config.defaultLangId = serviceResultGet._id.toString();
    } else {
      const serviceResultAdd = await LanguageService.add({
        title: 'English',
        image: 'gb.webp',
        shortKey: 'en',
        locale: 'gb',
        statusId: StatusId.Active,
        rank: -1,
        isDefault: true,
      });
      Config.defaultLangId = serviceResultAdd._id.toString();
      console.log(chalk.green(`#Language`));
      console.log(chalk.blue(`- Created`));
    }
  }

  private async checkSettings() {
    const settings = await SettingService.get({});
    if (!settings) {
      await SettingService.add({});
      console.log(chalk.green(`#Setting`));
      console.log(chalk.blue(`- Created`));
    }
  }

  private async initTimers() {
    Timers.initLongTimer();
  }
}

export { Config };
export default InitConfig;
