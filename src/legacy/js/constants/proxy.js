const API_PROXY = {
    BASE_PATH: "/api",
    VERSION: window.getEnv().apiRouterVersion,
    get VERSIONED_PATH() {
        return `${this.BASE_PATH}/${this.VERSION}`;
    },
    get ZEBEDEE_DATA_ENDPOINT() {
        return `${this.VERSIONED_PATH}/data`;
    }
};
