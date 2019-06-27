export default class auth {
    static isAuthenticated(user) {
        return user.isAuthenticated;
    }

    static isViewer(user) {
        return user.userType == "VIEWER";
    }

    static isAdminOrEditor(user) {
        return user.userType == "ADMIN" || user.userType == "EDITOR";
    }

    static isAdmin(user) {
        return user.userType === "ADMIN";
    }

    static canViewCollectionsDetails(user) {
        return user.userType == "ADMIN" || user.userType == "EDITOR";
    }
}
