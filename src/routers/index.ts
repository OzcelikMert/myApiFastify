import { FastifyInstance } from 'fastify';
import {EndPoint} from "../constants/EndPoints";

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
    fastify.register(userRoute, { prefix: EndPoint.USER });
    fastify.register(authRoute, { prefix: EndPoint.AUTH });
    fastify.register(postRoute, { prefix: EndPoint.POST  });
    fastify.register(postTermRoute, { prefix: EndPoint.POST_TERM });
    fastify.register(galleryRoute, { prefix: EndPoint.GALLERY });
    fastify.register(settingRoute, { prefix: EndPoint.SETTING });
    fastify.register(languageRoute, { prefix: EndPoint.LANGUAGE });
    fastify.register(serverInfoRoute, { prefix: EndPoint.SERVER_INFO });
    fastify.register(viewRoute, { prefix: EndPoint.VIEW });
    fastify.register(mailerRoute, { prefix: EndPoint.MAILER });
    fastify.register(subscriberRoute, { prefix: EndPoint.SUBSCRIBER });
    fastify.register(componentRoute, { prefix: EndPoint.COMPONENT });
    fastify.register(sitemapRoute, { prefix: EndPoint.SITEMAP });
    fastify.register(navigationRoute, { prefix: EndPoint.NAVIGATION });
    done();
}