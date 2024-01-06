import fs from "fs";
import {SitemapIndexChildrenDocument, SitemapIndexDocument} from "../types/sitemap/typeIndex";
import SitemapFolderPaths from "./paths";
import path from "path";

export default class SitemapTypeIndex {
    public constructor() {}

    private get getHeadIndex(): SitemapIndexDocument {
        return {
            sitemapindex: {
                $: {
                    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                    "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                }
            }
        }
    }

    private getNameIndex(withPath?: true) {
        let fileName = `sitemap.json`;
        return withPath ? path.resolve(SitemapFolderPaths.main, fileName) : fileName;
    }

    private async createIndex() {
        let json = this.getHeadIndex;
        await new Promise(resolve => {
            fs.writeFile(this.getNameIndex(true), JSON.stringify(json), function(err) {
                resolve(0)
            })
        })
    }

    private checkIndex() {
        return fs.existsSync(this.getNameIndex(true));
    }

    protected async addRowIndex(data: SitemapIndexChildrenDocument[]) {
        if(this.checkIndex()){
            let json = await new Promise<SitemapIndexDocument>(resolve => {
                fs.readFile(this.getNameIndex(true), "utf8", function (err, data) {
                    resolve(JSON.parse(data))
                });
            });

            if(typeof json.sitemapindex.sitemap === "undefined"){
                json.sitemapindex.sitemap = [];
            }

            json.sitemapindex.sitemap = json.sitemapindex.sitemap.concat(data)

            await new Promise(resolve => {
                fs.writeFile(this.getNameIndex(true), JSON.stringify(json), function(err) {
                    resolve(0)
                })
            })
        }else {
            await this.createIndex();
            await this.addRowIndex(data);
        }
    }
}