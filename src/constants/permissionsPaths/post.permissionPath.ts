import PagePaths from "../pagePaths";
import {PostTypeId} from "../postTypes";
import {PermissionId} from "../permissions";
import {PermissionPathDocument} from "../../types/constants/permissionPaths";

export default [
    {
        path: PagePaths.post().withTypeId(PostTypeId.Slider).self(),
        methods: [
            {
                permissionId: PermissionId.SliderAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.SliderDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.SliderEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Page).self(),
        methods: [
            {
                permissionId: PermissionId.PageAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.PageDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.PageEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Blog).self(),
        methods: [
            {
                permissionId: PermissionId.BlogAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.BlogDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.BlogEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Reference).self(),
        methods: [
            {
                permissionId: PermissionId.ReferenceAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.ReferenceDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.ReferenceEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Portfolio).self(),
        methods: [
            {
                permissionId: PermissionId.PortfolioAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.PortfolioDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.PortfolioEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Testimonial).self(),
        methods: [
            {
                permissionId: PermissionId.TestimonialAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.TestimonialDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.TestimonialEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Service).self(),
        methods: [
            {
                permissionId: PermissionId.ServiceAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.ServiceDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.ServiceEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.Product).self(),
        methods: [
            {
                permissionId: PermissionId.ProductAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.ProductDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.ProductEdit,
                method: "PUT"
            },
        ]
    },
    {
        path: PagePaths.post().withTypeId(PostTypeId.BeforeAndAfter).self(),
        methods: [
            {
                permissionId: PermissionId.BeforeAndAfterAdd,
                method: "POST"
            },
            {
                permissionId: PermissionId.BeforeAndAfterDelete,
                method: "DELETE"
            },
            {
                permissionId: PermissionId.BeforeAndAfterEdit,
                method: "PUT"
            },
        ]
    }
] as PermissionPathDocument[]