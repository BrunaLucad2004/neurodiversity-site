export const ROLES = {
    visitor: "visitor",
    admin: "admin",
    super: "super"
};

export const CONTEXTS = {
    user: "user",
    art: "art",
    font: "font",
    comment: "comment",
    report: "report"
};

export const SCOPES = {
    canCreate: "can-create",
    canEdit: "can-edit",
    canDelete: "can-delete",
    canDeleteOwn: "can-delete-own",
    canView: "can-view"
};

export const PERMISSIONS = {
    [ROLES.visitor]: {
        [CONTEXTS.art]: [SCOPES.canView],
        [CONTEXTS.comment]: [SCOPES.canCreate, SCOPES.canDeleteOwn],
    },
    [ROLES.admin]: {
        [CONTEXTS.art]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.font]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.comment]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canDelete],
        [CONTEXTS.report]: [SCOPES.canView],
    },
    [ROLES.super]: {
        [CONTEXTS.user]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.art]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.font]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.comment]: [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete],
        [CONTEXTS.report]: [SCOPES.canView],
    }
};

export const hasPermission = (role, context, scopes) => {
    if (!role || !PERMISSIONS[role][context]) {
        return false
    }
    if (Array.isArray(scopes)) {
        return scopes.every(value => PERMISSIONS[role][context].includes(value));
    } else {
        return PERMISSIONS[role][context].includes(scopes);
    }
};