import * as path from "path";

const SitemapFolderPaths = {
    get main() {
        return path.resolve(__dirname, "..", "..", "sitemaps/");
    }
}

export default SitemapFolderPaths;