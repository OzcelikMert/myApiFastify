export enum UserRoleId {
    User = 1,
    Author,
    Editor,
    Admin,
    SuperAdmin
}

export const userRoles = [
    {id: UserRoleId.User, rank: 1},
    {id: UserRoleId.Author, rank: 2},
    {id: UserRoleId.Editor, rank: 3},
    {id: UserRoleId.Admin, rank: 4},
    {id: UserRoleId.SuperAdmin, rank: 5}
];
