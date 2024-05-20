import * as mongoose from "mongoose";
import {userModel} from "@models/user.model";
import {StatusId} from "@constants/status";
import {PostTypeId} from "@constants/postTypes";
import {languageModel} from "@models/language.model";
import {postTermModel} from "@models/postTerm.model";
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
    IPostECommerceVariationModel,
    IPostECommerceVariationSelectedModel
} from "types/models/post.model";
import {ProductTypeId} from "@constants/productTypes";
import {AttributeTypeId} from "@constants/attributeTypes";
import {componentModel} from "@models/component.model";

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
).index({sku: 1, quantity: 1, isManageStock: 1});

const schemaECommercePricing = new mongoose.Schema<IPostECommercePricingModel>(
    {
        compared: {type: Number, default: 0},
        shipping: {type: Number, default: 0},
        taxExcluded: {type: Number, default: 0},
        taxIncluded: {type: Number, default: 0},
        taxRate: {type: Number, default: 0},
    }
);

const schemaECommerceAttribute = new mongoose.Schema<IPostECommerceAttributeModel>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variations: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel, default: []},
        typeId: {type: Number, enum: AttributeTypeId, default: AttributeTypeId.Text}
    },
    {timestamps: true}
).index({typeId: 1, variations: 1, attributeId: 1});

const schemaECommerceVariationSelected = new mongoose.Schema<IPostECommerceVariationSelectedModel>(
    {
        attributeId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
        variationId: {type: mongoose.Schema.Types.ObjectId, ref: postTermModel, required: true},
    },
    {timestamps: true}
).index({attributeId: 1, variationId: 1});

const schemaECommerceVariation = new mongoose.Schema<IPostECommerceVariationModel>(
    {
        rank: {type: Number, default: 0},
        selectedVariations: {type: [schemaECommerceVariationSelected], default: []},
        itemId: {type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true}
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
).index({typeId: 1});

const schemaContentButton = new mongoose.Schema<IPostContentButtonModel>(
    {
        title: {type: String, default: ""},
        url: {type: String, default: ""}
    },
    {timestamps: true}
);

const schemaBeforeAndAfter = new mongoose.Schema<IPostBeforeAndAfterModel>(
    {
        imageBefore: {type: String, default: ""},
        imageAfter: {type: String, default: ""},
        images: {type: [String], default: []}
    },
    {timestamps: true}
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
    },
    {timestamps: true}
)

const schema = new mongoose.Schema<IPostModel>(
    {
        parentId: {type: mongoose.Schema.Types.ObjectId, ref: "posts"},
        typeId: {type: Number, enum: PostTypeId, default: PostTypeId.Blog},
        statusId: {type: Number, required: true, enum: StatusId},
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        authors: {type: [mongoose.Schema.Types.ObjectId], ref: userModel},
        dateStart: {type: Date},
        rank: {type: Number, default: 0},
        isFixed: {type: Boolean},
        isNoIndex: {type: Boolean},
        pageTypeId: {type: Number},
        categories: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel},
        tags: {type: [mongoose.Schema.Types.ObjectId], ref: postTermModel},
        contents: {type: [schemaContent], default: []},
        eCommerce: {type: schemaECommerce},
        beforeAndAfter: {type: schemaBeforeAndAfter},
        components: {type: [mongoose.Schema.Types.ObjectId], ref: componentModel},
        similarItems: {type: [mongoose.Schema.Types.ObjectId], ref: "posts"}
    },
    {timestamps: true}
).index({
    parentId: 1,
    typeId: 1,
    statusId: 1,
    authorId: 1,
    pageTypeId: 1,
    categories: 1,
});

export const postModel = mongoose.model<IPostModel, mongoose.Model<IPostModel>>("posts", schema)