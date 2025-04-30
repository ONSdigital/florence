export const API_PROXY = {
    BASE_PATH: "/api",
    VERSION: window.getEnv().apiRouterVersion,
    get VERSIONED_PATH() {
        return `${this.BASE_PATH}/${this.VERSION}`;
    },
};
