import {FastifyInstance} from 'fastify';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import http from "http";
import https from "https";
import sessionAuthConfig from "./session/session.auth.config";
import {IConfig} from "../types/config";
import dbConnect from "./db";
import {UserService} from "../services/user.service";
import {UserRoleId} from "../constants/userRoles";
import {StatusId} from "../constants/status";
import {LanguageService} from "../services/language.service";
import {SettingService} from "../services/setting.service";
import * as path from "path"
import {generate} from "generate-password";
import chalk from "chalk";
import fs from "fs";

const setPath = (...paths: (number | string | undefined)[]) => {
    let returnPath = "";
    for (let path of paths) {
        if (path) {
            if (
                typeof path === "string" &&
                path.length > 0 &&
                path.startsWith("/")
            ) {
                path = path.slice(1);
            }
            
            returnPath += `/${path}`;
        }
    }
    return returnPath;
}

let Config: IConfig = {
    passwordSalt: "_@QffsDh14Q",
    publicFolders: [
        ["uploads"]
    ],
    onlineUsers: [],
    paths: {
        root: "",
        uploads: {
            get images() {return path.resolve(Config.paths.root, "uploads", "images");},
            get flags() {return path.resolve(Config.paths.root, "uploads", "flags");},
            get video() {return path.resolve(Config.paths.root, "uploads", "video");},
            get static() {return path.resolve(Config.paths.root, "uploads", "static");}
        }
    },
    defaultLangId: ""
}

class InitConfig {
    private server: FastifyInstance;

    constructor(server: FastifyInstance) {
        this.server = server;
        Config.paths.root = path.resolve('./', "src");
    }

    async init() {
        return new Promise<void>(async resolve => {
            await this.setPublicFolders();
            await this.setSession();
            this.security();
            await this.mongodbConnect();
            await this.checkSuperAdminUser();
            await this.checkLanguages();
            await this.checkSettings();
            resolve();
        });
    }

    private security() {
        http.globalAgent.maxSockets = Infinity;
        https.globalAgent.maxSockets = Infinity;
    }

    private async setPublicFolders() {
        console.log(chalk.green("#Public Folders"));

        Config.publicFolders.forEach(async (publicFolder, index) => {
            let folderPath = "";

            publicFolder.forEach(publicFolderPath => {
                folderPath = setPath(folderPath, publicFolderPath);
            });
            folderPath = folderPath.slice(1);

            if(!fs.existsSync(path.resolve(Config.paths.root, folderPath))){
                fs.mkdirSync(path.resolve(Config.paths.root, folderPath));
            }

            console.log(chalk.blue(` - /${folderPath}`) + ` : ${path.resolve(Config.paths.root, folderPath)}`)

            await this.server.register(fastifyStatic, {
                root: path.resolve(Config.paths.root, folderPath),
                prefix: `/${folderPath}`,
            });
            //console.log(chalk.blue(` - /${folderPath}`) + ` : ${path.resolve(Config.paths.root, folderPath)}`)
        });
    }

    private async setSession() {
        await this.server.register(fastifyCookie, {
            secret: sessionAuthConfig.secret
        });
        await this.server.register(fastifySecureSession, sessionAuthConfig as any)
    }

    private async mongodbConnect() {
        try {
            await dbConnect();
            console.log(chalk.green(`#MongoDB`))
            console.log(chalk.blue(`- Connected`))
        } catch (e) {
            console.error("MongoDB Connection Error")
            console.error(e)
        }
    }

    private async checkSuperAdminUser() {
        if (!(await UserService.getOne({roleId: UserRoleId.SuperAdmin}))) {
            let password = generate({
                length: 10
            })
            await UserService.add({
                name: "Super Admin",
                email: "admin@admin.com",
                statusId: StatusId.Active,
                password: password,
                roleId: UserRoleId.SuperAdmin,
                permissions: []
            })
            console.log(chalk.green(`#Admin Account`))
            console.log(chalk.blue(`- Created`))
            console.log(chalk.blue(`- Password: ${password}`))
        }
    }

    private async checkLanguages() {
        if (!(await LanguageService.getOne({isDefault: true}))) {
            let serviceResult = await LanguageService.add({
                title: "English",
                image: "gb.webp",
                shortKey: "en",
                locale: "us",
                statusId: StatusId.Active,
                rank: -1,
                isDefault: true
            });
            Config.defaultLangId = serviceResult._id.toString();
            console.log(chalk.green(`#Language`))
            console.log(chalk.blue(`- Created`))
        }
    }

    private async checkSettings() {
        let settings = await SettingService.get({});
        if (!settings) {
            await SettingService.add({
                contactForms: [],
                staticContents: [],
                socialMedia: [],
            });
            console.log(chalk.green(`#Setting`))
            console.log(chalk.blue(`- Created`))
        }
    }
}

export {Config};
export default InitConfig;