import { FastifyInstance } from 'fastify';

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
    fastify.register(userRoute, { prefix: "/user" });
    fastify.register(authRoute, { prefix: "/auth" });
    fastify.register(postRoute, { prefix: "/post" });
    fastify.register(postTermRoute, { prefix: "/post-term" });
    fastify.register(galleryRoute, { prefix: "/gallery" });
    fastify.register(settingRoute, { prefix: "/setting" });
    fastify.register(languageRoute, { prefix: "/language" });
    fastify.register(serverInfoRoute, { prefix: "/server-info" });
    fastify.register(viewRoute, { prefix: "/view" });
    fastify.register(mailerRoute, { prefix: "/mailer" });
    fastify.register(subscriberRoute, { prefix: "/subscriber" });
    fastify.register(componentRoute, { prefix: "/component" });
    fastify.register(sitemapRoute, { prefix: "/sitemap" });
    fastify.register(navigationRoute, { prefix: "/navigation" });
    done();
}