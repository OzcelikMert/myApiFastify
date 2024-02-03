import { FastifyInstance } from 'fastify';
import {EndPoints} from "../constants/endPoints";

import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";
import postRoute from "./routes/post.route";
import postTermRoute from "./routes/postTerm.route";
import galleryRoute from "./routes/gallery.route";
import settingRoute from "./routes/setting.route";
import languageRoute from "./routes/language.route";
import serverInfoRoute from "./routes/serverInfo.route";
import viewRoute from "./routes/view.route";
import mailerRoute from "./routes/mailer.route";
import subscriberRoute from "./routes/subscriber.route";
import componentRoute from "./routes/component.route";
import sitemapRoute from "./routes/sitemap.route";
import navigationRoute from "./routes/navigation.route";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.register(userRoute, { prefix: EndPoints.USER });
    fastify.register(authRoute, { prefix: EndPoints.AUTH });
    fastify.register(postRoute, { prefix: EndPoints.POST  });
    fastify.register(postTermRoute, { prefix: EndPoints.POST_TERM });
    fastify.register(galleryRoute, { prefix: EndPoints.GALLERY });
    fastify.register(settingRoute, { prefix: EndPoints.SETTING });
    fastify.register(languageRoute, { prefix: EndPoints.LANGUAGE });
    fastify.register(serverInfoRoute, { prefix: EndPoints.SERVER_INFO });
    fastify.register(viewRoute, { prefix: EndPoints.VIEW });
    fastify.register(mailerRoute, { prefix: EndPoints.MAILER });
    fastify.register(subscriberRoute, { prefix: EndPoints.SUBSCRIBER });
    fastify.register(componentRoute, { prefix: EndPoints.COMPONENT });
    fastify.register(sitemapRoute, { prefix: EndPoints.SITEMAP });
    fastify.register(navigationRoute, { prefix: EndPoints.NAVIGATION });
    done();
}