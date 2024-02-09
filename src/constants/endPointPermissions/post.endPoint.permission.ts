import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {EndPointPermissionDocument} from "../../types/constants/endPoint.permissions";

const addSlider: EndPointPermissionDocument = {
    permissionId: [PermissionId.SliderAdd],
    minUserRoleId: UserRoleId.Author
}

const updateSlider: EndPointPermissionDocument = {
    permissionId: [PermissionId.SliderEdit],
    minUserRoleId: UserRoleId.Author
}

const removeSlider: EndPointPermissionDocument = {
    permissionId: [PermissionId.SliderDelete],
    minUserRoleId: UserRoleId.Author
}

const addPage: EndPointPermissionDocument = {
    permissionId: [PermissionId.PageAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePage: EndPointPermissionDocument = {
    permissionId: [PermissionId.PageEdit],
    minUserRoleId: UserRoleId.Author
}

const removePage: EndPointPermissionDocument = {
    permissionId: [PermissionId.PageDelete],
    minUserRoleId: UserRoleId.Author
}

const addBlog: EndPointPermissionDocument = {
    permissionId: [PermissionId.BlogAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBlog: EndPointPermissionDocument = {
    permissionId: [PermissionId.BlogEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBlog: EndPointPermissionDocument = {
    permissionId: [PermissionId.BlogDelete],
    minUserRoleId: UserRoleId.Author
}

const addReference: EndPointPermissionDocument = {
    permissionId: [PermissionId.ReferenceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateReference: EndPointPermissionDocument = {
    permissionId: [PermissionId.ReferenceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeReference: EndPointPermissionDocument = {
    permissionId: [PermissionId.ReferenceDelete],
    minUserRoleId: UserRoleId.Author
}

const addPortfolio: EndPointPermissionDocument = {
    permissionId: [PermissionId.PortfolioAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePortfolio: EndPointPermissionDocument = {
    permissionId: [PermissionId.PortfolioEdit],
    minUserRoleId: UserRoleId.Author
}

const removePortfolio: EndPointPermissionDocument = {
    permissionId: [PermissionId.PortfolioDelete],
    minUserRoleId: UserRoleId.Author
}

const addTestimonial: EndPointPermissionDocument = {
    permissionId: [PermissionId.TestimonialAdd],
    minUserRoleId: UserRoleId.Author
}

const updateTestimonial: EndPointPermissionDocument = {
    permissionId: [PermissionId.TestimonialEdit],
    minUserRoleId: UserRoleId.Author
}

const removeTestimonial: EndPointPermissionDocument = {
    permissionId: [PermissionId.TestimonialDelete],
    minUserRoleId: UserRoleId.Author
}

const addService: EndPointPermissionDocument = {
    permissionId: [PermissionId.ServiceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateService: EndPointPermissionDocument = {
    permissionId: [PermissionId.ServiceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeService: EndPointPermissionDocument = {
    permissionId: [PermissionId.ServiceDelete],
    minUserRoleId: UserRoleId.Author
}

const addProduct: EndPointPermissionDocument = {
    permissionId: [PermissionId.ProductAdd],
    minUserRoleId: UserRoleId.Author
}

const updateProduct: EndPointPermissionDocument = {
    permissionId: [PermissionId.ProductEdit],
    minUserRoleId: UserRoleId.Author
}

const removeProduct: EndPointPermissionDocument = {
    permissionId: [PermissionId.ProductDelete],
    minUserRoleId: UserRoleId.Author
}

const addBeforeAndAfter: EndPointPermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBeforeAndAfter: EndPointPermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBeforeAndAfter: EndPointPermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterDelete],
    minUserRoleId: UserRoleId.Author
}

export const PostEndPointPermission = {
    ADD_SLIDER: addSlider,
    UPDATE_SLIDER: updateSlider,
    DELETE_SLIDER: removeSlider,
    ADD_PAGE: addPage,
    UPDATE_PAGE: updatePage,
    DELETE_PAGE: removePage,
    ADD_BLOG: addBlog,
    UPDATE_BLOG: updateBlog,
    DELETE_BLOG: removeBlog,
    ADD_REFERENCE: addReference,
    UPDATE_REFERENCE: updateReference,
    DELETE_REFERENCE: removeReference,
    ADD_PORTFOLIO: addPortfolio,
    UPDATE_PORTFOLIO: updatePortfolio,
    DELETE_PORTFOLIO: removePortfolio,
    ADD_TESTIMONIAL: addTestimonial,
    UPDATE_TESTIMONIAL: updateTestimonial,
    DELETE_TESTIMONIAL: removeTestimonial,
    ADD_SERVICE: addService,
    UPDATE_SERVICE: updateService,
    DELETE_SERVICE: removeService,
    ADD_PRODUCT: addProduct,
    UPDATE_PRODUCT: updateProduct,
    DELETE_PRODUCT: removeProduct,
    ADD_BEFORE_AND_AFTER: addBeforeAndAfter,
    UPDATE_BEFORE_AND_AFTER: updateBeforeAndAfter,
    DELETE_BEFORE_AND_AFTER: removeBeforeAndAfter
}