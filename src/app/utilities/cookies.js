export default class cookies {

    static getAll() {
        const cookies = document.cookie.split(';');
        const cookiesObject = {};
        
        cookies.forEach(cookie => {
            const parts = cookie.split("=");
            cookiesObject[parts[0].trim()] = parts[1];
        });
        return cookiesObject;
    }

    static get(name) {
        if (!name || typeof name !== 'string') {
            console.error(`cookie.get() requires a cookie name (type=string) as an argument`);
            return false;
        }
        const allCookies = this.getAll();
        const cookie = allCookies[name];

        if (!cookie) {
            console.error(`Unable to find '${name}' cookie`);
            return false; 
        }

        return cookie;
    }

    static remove(name) {
        if (!name || typeof name !== 'string') {
            console.error(`cookie.get() requires a cookie name (type=string) as an argument`);
            return false;
        }
        if (!this.get(name)) {
            console.error(`Unable to find '${name}' cookie`);
            return false; 
        }
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log(`Removed cookie: '${name}'`);
        return true;
    }
}