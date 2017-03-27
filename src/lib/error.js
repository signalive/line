function LineError(code, message, payload) {
    this.name = 'LineError';
    this.message = message;
    this.code = code;
    this.payload = payload;
    this.stack = (new Error()).stack;
}
LineError.prototype = new Error;


module.exports = LineError;
