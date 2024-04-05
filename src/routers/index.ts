import { FastifyInstance } from 'fastify';
import {EndPoints} from "@constants/endPoints";
import {userRoute} from "@routers/routes/user.route";
import {authRoute} from "@routers/routes/auth.route";
import {postRoute} from "@routers/routes/post.route";
import {postTermRoute} from "@routers/routes/postTerm.route";
import {galleryRoute} from "@routers/routes/gallery.route";
import {settingRoute} from "@routers/routes/setting.route";
import {languageRoute} from "@routers/routes/language.route";
import {serverInfoRoute} from "@routers/routes/serverInfo.route";
import {viewRoute} from "@routers/routes/view.route";
import {mailerRoute} from "@routers/routes/mailer.route";
import {subscriberRoute} from "@routers/routes/subscriber.route";
import {sitemapRoute} from "@routers/routes/sitemap.route";
import {navigationRoute} from "@routers/routes/navigation.route";
import {componentRoute} from "@routers/routes/component.route";

export const routers = function (fastify: FastifyInstance, opts: any, done: () => void) {
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
    fastify.register(sitemapRoute, { prefix: EndPoints.SITEMAP });
    fastify.register(navigationRoute, { prefix: EndPoints.NAVIGATION });
    fastify.register(componentRoute, { prefix: EndPoints.COMPONENT });
    done();
}