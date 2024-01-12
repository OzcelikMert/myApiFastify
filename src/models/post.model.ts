import * as mongoose from "mongoose";
import userModel from "./user.model";
import {StatusId} from "../constants/status";
import {PostTypeId} from "../constants/postTypes";
import languageModel from "./language.model";
import postTermModel from "./postTerm.model";
import {
    PostBeforeAndAfterDocument,
    PostContentButtonDocument,
    PostContentDocument,
    PostDocument,
    PostECommerceAttributeDocument,
    PostECommerceDocument,
    PostECommerceInventoryDocument,
    PostECommercePricingDocument,
    PostECommerceShippingDocument,
    PostECommerceVariationContentDocument,
    PostECommerceVariationDocument,
    PostECommerceVariationSelectedDocument
} from "../types/models/post.model";
import componentModel from "./component.model";
import {ProductTypeId} from "../constants/productTypes";
import {AttributeTypeId} from "../constants/attributeTypes";

const schemaPostECommerceVariationContent = new mongoose.Schema<PostECommerceVariationContentDocument>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        image: {type: String, default: ""},
        content: {type: String, default: ""},
        shortContent: {type: String, default: ""},
    }
).index({langId: 1});

const schemaECommerceVariationSelected = new mongoose.Schema<PostECommerceVariationSelectedDocument>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variationId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
    },
    {timestamps: true}
).index({attributeId: 1});

const schemaECommerceAttribute = new mongoose.Schema<PostECommerceAttributeDocument>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variations: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel, default: []},
        typeId: {type: Number, enum: AttributeTypeId, default: AttributeTypeId.Text}
    },
    {timestamps: true}
).index({attributeId: 1});

const schemaECommerceShipping = new mongoose.Schema<PostECommerceShippingDocument>(
    {
        width: {type: String, default: ""},
        height: {type: String, default: ""},
        depth: {type: String, default: ""},
        weight: {type: String, default: ""},
    }
);

const schemaECommerceInventory = new mongoose.Schema<PostECommerceInventoryDocument>(
    {
        sku: {type: String, default: ""},
        quantity: {type: Number, default: 0},
        isManageStock: {type: Boolean, default: false},
    }
);

const schemaECommercePricing = new mongoose.Schema<PostECommercePricingDocument>(
    {
        compared: {type: Number, default: 0},
        shipping: {type: Number, default: 0},
        taxExcluded: {type: Number, default: 0},
        taxIncluded: {type: Number, default: 0},
        taxRate: {type: Number, default: 0},
    }
);

const schemaECommerceVariation= new mongoose.Schema<PostECommerceVariationDocument>(
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

const schemaECommerce = new mongoose.Schema<PostECommerceDocument>(
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

const schemaContentButton = new mongoose.Schema<PostContentButtonDocument>(
    {
        title: {type: String, default: ""},
        url: {type: String, default: ""}
    }
);

const schemaBeforeAndAfter = new mongoose.Schema<PostBeforeAndAfterDocument>(
    {
        imageBefore: {type: String, default: ""},
        imageAfter: {type: String, default: ""},
        images: {type: [String], default: []}
    }
);


const schemaContent = new mongoose.Schema<PostContentDocument>(
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

const schema = new mongoose.Schema<PostDocument>(
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
        components: {type: [mongoose.Schema.Types.ObjectId], ref: componentModel},
        eCommerce: {type: schemaECommerce},
        beforeAndAfter: {type: schemaBeforeAndAfter}
    },
    {timestamps: true}
).index({typeId: 1, statusId: 1, authorId: 1});

export default mongoose.model<PostDocument, mongoose.Model<PostDocument>>("posts", schema)