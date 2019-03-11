function HttpError(response) {
    this.name = 'HTTP_ERR';
    this.message = response ? response.message : ""
    this.response = response || {};
    this.stack = (new Error()).stack;
}
HttpError.prototype = Object.create(Error.prototype);
HttpError.prototype.constructor = HttpError;

export {HttpError};