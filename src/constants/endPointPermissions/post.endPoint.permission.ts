import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {IEndPointPermission} from "../../types/constants/endPoint.permissions";

const addSlider: IEndPointPermission = {
    permissionId: [PermissionId.SliderAdd],
    minUserRoleId: UserRoleId.Author
}

const updateSlider: IEndPointPermission = {
    permissionId: [PermissionId.SliderEdit],
    minUserRoleId: UserRoleId.Author
}

const removeSlider: IEndPointPermission = {
    permissionId: [PermissionId.SliderDelete],
    minUserRoleId: UserRoleId.Author
}

const addPage: IEndPointPermission = {
    permissionId: [PermissionId.PageAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePage: IEndPointPermission = {
    permissionId: [PermissionId.PageEdit],
    minUserRoleId: UserRoleId.Author
}

const removePage: IEndPointPermission = {
    permissionId: [PermissionId.PageDelete],
    minUserRoleId: UserRoleId.Author
}

const addBlog: IEndPointPermission = {
    permissionId: [PermissionId.BlogAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBlog: IEndPointPermission = {
    permissionId: [PermissionId.BlogEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBlog: IEndPointPermission = {
    permissionId: [PermissionId.BlogDelete],
    minUserRoleId: UserRoleId.Author
}

const addReference: IEndPointPermission = {
    permissionId: [PermissionId.ReferenceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateReference: IEndPointPermission = {
    permissionId: [PermissionId.ReferenceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeReference: IEndPointPermission = {
    permissionId: [PermissionId.ReferenceDelete],
    minUserRoleId: UserRoleId.Author
}

const addPortfolio: IEndPointPermission = {
    permissionId: [PermissionId.PortfolioAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePortfolio: IEndPointPermission = {
    permissionId: [PermissionId.PortfolioEdit],
    minUserRoleId: UserRoleId.Author
}

const removePortfolio: IEndPointPermission = {
    permissionId: [PermissionId.PortfolioDelete],
    minUserRoleId: UserRoleId.Author
}

const addTestimonial: IEndPointPermission = {
    permissionId: [PermissionId.TestimonialAdd],
    minUserRoleId: UserRoleId.Author
}

const updateTestimonial: IEndPointPermission = {
    permissionId: [PermissionId.TestimonialEdit],
    minUserRoleId: UserRoleId.Author
}

const removeTestimonial: IEndPointPermission = {
    permissionId: [PermissionId.TestimonialDelete],
    minUserRoleId: UserRoleId.Author
}

const addService: IEndPointPermission = {
    permissionId: [PermissionId.ServiceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateService: IEndPointPermission = {
    permissionId: [PermissionId.ServiceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeService: IEndPointPermission = {
    permissionId: [PermissionId.ServiceDelete],
    minUserRoleId: UserRoleId.Author
}

const addProduct: IEndPointPermission = {
    permissionId: [PermissionId.ProductAdd],
    minUserRoleId: UserRoleId.Author
}

const updateProduct: IEndPointPermission = {
    permissionId: [PermissionId.ProductEdit],
    minUserRoleId: UserRoleId.Author
}

const removeProduct: IEndPointPermission = {
    permissionId: [PermissionId.ProductDelete],
    minUserRoleId: UserRoleId.Author
}

const addBeforeAndAfter: IEndPointPermission = {
    permissionId: [PermissionId.BeforeAndAfterAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBeforeAndAfter: IEndPointPermission = {
    permissionId: [PermissionId.BeforeAndAfterEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBeforeAndAfter: IEndPointPermission = {
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