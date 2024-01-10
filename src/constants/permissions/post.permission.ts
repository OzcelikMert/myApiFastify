import {PermissionId} from "../permissions";
import {UserRoleId} from "../userRoles";
import {PermissionDocument} from "../../types/constants/permissions";

const addSlider: PermissionDocument = {
    permissionId: [PermissionId.SliderAdd],
    minUserRoleId: UserRoleId.Author
}

const updateSlider: PermissionDocument = {
    permissionId: [PermissionId.SliderEdit],
    minUserRoleId: UserRoleId.Author
}

const removeSlider: PermissionDocument = {
    permissionId: [PermissionId.SliderDelete],
    minUserRoleId: UserRoleId.Author
}

const addPage: PermissionDocument = {
    permissionId: [PermissionId.PageAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePage: PermissionDocument = {
    permissionId: [PermissionId.PageEdit],
    minUserRoleId: UserRoleId.Author
}

const removePage: PermissionDocument = {
    permissionId: [PermissionId.PageDelete],
    minUserRoleId: UserRoleId.Author
}

const addBlog: PermissionDocument = {
    permissionId: [PermissionId.BlogAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBlog: PermissionDocument = {
    permissionId: [PermissionId.BlogEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBlog: PermissionDocument = {
    permissionId: [PermissionId.BlogDelete],
    minUserRoleId: UserRoleId.Author
}

const addReference: PermissionDocument = {
    permissionId: [PermissionId.ReferenceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateReference: PermissionDocument = {
    permissionId: [PermissionId.ReferenceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeReference: PermissionDocument = {
    permissionId: [PermissionId.ReferenceDelete],
    minUserRoleId: UserRoleId.Author
}

const addPortfolio: PermissionDocument = {
    permissionId: [PermissionId.PortfolioAdd],
    minUserRoleId: UserRoleId.Author
}

const updatePortfolio: PermissionDocument = {
    permissionId: [PermissionId.PortfolioEdit],
    minUserRoleId: UserRoleId.Author
}

const removePortfolio: PermissionDocument = {
    permissionId: [PermissionId.PortfolioDelete],
    minUserRoleId: UserRoleId.Author
}

const addTestimonial: PermissionDocument = {
    permissionId: [PermissionId.TestimonialAdd],
    minUserRoleId: UserRoleId.Author
}

const updateTestimonial: PermissionDocument = {
    permissionId: [PermissionId.TestimonialEdit],
    minUserRoleId: UserRoleId.Author
}

const removeTestimonial: PermissionDocument = {
    permissionId: [PermissionId.TestimonialDelete],
    minUserRoleId: UserRoleId.Author
}

const addService: PermissionDocument = {
    permissionId: [PermissionId.ServiceAdd],
    minUserRoleId: UserRoleId.Author
}

const updateService: PermissionDocument = {
    permissionId: [PermissionId.ServiceEdit],
    minUserRoleId: UserRoleId.Author
}

const removeService: PermissionDocument = {
    permissionId: [PermissionId.ServiceDelete],
    minUserRoleId: UserRoleId.Author
}

const addProduct: PermissionDocument = {
    permissionId: [PermissionId.ProductAdd],
    minUserRoleId: UserRoleId.Author
}

const updateProduct: PermissionDocument = {
    permissionId: [PermissionId.ProductEdit],
    minUserRoleId: UserRoleId.Author
}

const removeProduct: PermissionDocument = {
    permissionId: [PermissionId.ProductDelete],
    minUserRoleId: UserRoleId.Author
}

const addBeforeAndAfter: PermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterAdd],
    minUserRoleId: UserRoleId.Author
}

const updateBeforeAndAfter: PermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterEdit],
    minUserRoleId: UserRoleId.Author
}

const removeBeforeAndAfter: PermissionDocument = {
    permissionId: [PermissionId.BeforeAndAfterDelete],
    minUserRoleId: UserRoleId.Author
}

export default {
    addSlider: addSlider,
    updateSlider: updateSlider,
    deleteSlider: removeSlider,
    addPage: addPage,
    updatePage: updatePage,
    deletePage: removePage,
    addBlog: addBlog,
    updateBlog: updateBlog,
    deleteBlog: removeBlog,
    addReference: addReference,
    updateReference: updateReference,
    deleteReference: removeReference,
    addPortfolio: addPortfolio,
    updatePortfolio: updatePortfolio,
    deletePortfolio: removePortfolio,
    addTestimonial: addTestimonial,
    updateTestimonial: updateTestimonial,
    deleteTestimonial: removeTestimonial,
    addService: addService,
    updateService: updateService,
    deleteService: removeService,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: removeProduct,
    addBeforeAndAfter: addBeforeAndAfter,
    updateBeforeAndAfter: updateBeforeAndAfter,
    deleteBeforeAndAfter: removeBeforeAndAfter
}