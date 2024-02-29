import * as mongoose from "mongoose";
import {userModel} from "./user.model";
import {StatusId} from "../constants/status";
import {PostTypeId} from "../constants/postTypes";
import {languageModel} from "./language.model";
import {postTermModel} from "./postTerm.model";
import {
    IPostBeforeAndAfterModel,
    IPostContentButtonModel,
    IPostContentModel,
    IPostModel,
    IPostECommerceAttributeModel,
    IPostECommerceModel,
    IPostECommerceInventoryModel,
    IPostECommercePricingModel,
    IPostECommerceShippingModel,
    IPostECommerceVariationContentModel,
    IPostECommerceVariationModel,
    IPostECommerceVariationSelectedModel
} from "../types/models/post.model";
import {ProductTypeId} from "../constants/productTypes";
import {AttributeTypeId} from "../constants/attributeTypes";

const schemaPostECommerceVariationContent = new mongoose.Schema<IPostECommerceVariationContentModel>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        image: {type: String, default: ""},
        content: {type: String, default: ""},
        shortContent: {type: String, default: ""},
    }
).index({langId: 1});

const schemaECommerceVariationSelected = new mongoose.Schema<IPostECommerceVariationSelectedModel>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variationId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
    },
    {timestamps: true}
).index({attributeId: 1});

const schemaECommerceAttribute = new mongoose.Schema<IPostECommerceAttributeModel>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variations: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel, default: []},
        typeId: {type: Number, enum: AttributeTypeId, default: AttributeTypeId.Text}
    },
    {timestamps: true}
).index({attributeId: 1});

const schemaECommerceShipping = new mongoose.Schema<IPostECommerceShippingModel>(
    {
        width: {type: String, default: ""},
        height: {type: String, default: ""},
        depth: {type: String, default: ""},
        weight: {type: String, default: ""},
    }
);

const schemaECommerceInventory = new mongoose.Schema<IPostECommerceInventoryModel>(
    {
        sku: {type: String, default: ""},
        quantity: {type: Number, default: 0},
        isManageStock: {type: Boolean, default: false},
    }
);

const schemaECommercePricing = new mongoose.Schema<IPostECommercePricingModel>(
    {
        compared: {type: Number, default: 0},
        shipping: {type: Number, default: 0},
        taxExcluded: {type: Number, default: 0},
        taxIncluded: {type: Number, default: 0},
        taxRate: {type: Number, default: 0},
    }
);

const schemaECommerceVariation= new mongoose.Schema<IPostECommerceVariationModel>(
    {
        rank: {type: Number, default: 0},
        selectedVariations: {type: [schemaECommerceVariationSelected], default: []},
        images: {type: [String], default: []},
        inventory: {type: schemaECommerceInventory, required: true},
        pricing: {type: schemaECommercePricing, required: true},
        shipping: {type: schemaECommerceShipping, required: true},
        contents: {type: [schemaPostECommerceVariationContent], required: true},
    },
    {timestamps: true}
);

const schemaECommerce = new mongoose.Schema<IPostECommerceModel>(
    {
        typeId: {type: Number, enum: ProductTypeId, required: true},
        images: {type: [String], default: []},
        inventory: {type: schemaECommerceInventory},
        pricing: {type: schemaECommercePricing},
        shipping: {type: schemaECommerceShipping},
        attributes: {type: [schemaECommerceAttribute], default: []},
        variations: {type: [schemaECommerceVariation], default: []},
        variationDefaults: {type: [schemaECommerceVariationSelected], default: []}
    }
);

const schemaContentButton = new mongoose.Schema<IPostContentButtonModel>(
    {
        title: {type: String, default: ""},
        url: {type: String, default: ""}
    }
);

const schemaBeforeAndAfter = new mongoose.Schema<IPostBeforeAndAfterModel>(
    {
        imageBefore: {type: String, default: ""},
        imageAfter: {type: String, default: ""},
        images: {type: [String], default: []}
    }
);


const schemaContent = new mongoose.Schema<IPostContentModel>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        image: {type: String, default: ""},
        icon: {type: String},
        title: {type: String, default: ""},
        content: {type: String, default: ""},
        shortContent: {type: String, default: ""},
        url: {type: String, default: ""},
        views: {type: Number, default: 0},
        buttons: {type: [schemaContentButton]},
    }
).index({langId: 1});

const schema = new mongoose.Schema<IPostModel>(
    {
        typeId: {type: Number, enum: PostTypeId, default: PostTypeId.Blog},
        statusId: {type: Number, required: true, enum: StatusId},
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        dateStart: {type: Date, default: new Date()},
        rank: {type: Number, default: 0},
        isFixed: {type: Boolean},
        pageTypeId: {type: Number},
        categories: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel},
        tags: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel},
        contents: {type: [schemaContent], default: []},
        eCommerce: {type: schemaECommerce},
        beforeAndAfter: {type: schemaBeforeAndAfter}
    },
    {timestamps: true}
).index({typeId: 1, statusId: 1, authorId: 1});

export const postModel = mongoose.model<IPostModel, mongoose.Model<IPostModel>>("posts", schema)