const isUndefined = require('lodash/isUndefined');
const isString = require('lodash/isString');
const isObject = require('lodash/isObject');
const isFunction = require('lodash/isFunction');
const values = require('lodash/values');
const assign = require('lodash/assign');
const {generateDummyId} = require('./utils');
const EventEmitterExtra = require('event-emitter-extra');
const LineError = require('./error');


/**
 * Message class.
 *
 * @private
 * @class Message
 * @extends {EventEmitterExtra}
 */
class Message extends EventEmitterExtra {
    static parse(raw) {
        try {
            const data = JSON.parse(raw);

            // If error is error-like object, construct real error
            if (isObject(data.e) && isString(data.e.name) && isString(data.e.message)) {
                data.e = assign(new Error(), data.e);
            }

            return new Message({
                name: data.n,
                payload: data.p,
                err: data.e,
                id: data.i
            });
        } catch(err) {
            throw new LineError(Message.ErrorCode.INVALID_JSON, `Could not parse incoming message.`);
        }
    }


    constructor({name, payload, id, err}) {
        super();

        try {
            JSON.stringify(payload);
            JSON.stringify(err);
        } catch (err) {
            throw new LineError(
                Message.ErrorCode.INVALID_JSON,
                `Message payload or error must be json-friendly. Maybe circular json?`
            );
        }

        this.name = name;
        this.payload = payload;
        this.id = id;
        this.err = err;

        this.isResponded_ = false;
    }


    setId(id = generateDummyId()) {
        this.id = id;
        return id;
    }


    createResponse(err, payload) {
        return new Message({name: '_r', payload, err, id: this.id});
    }


    /**
     * Resolves the message with sending a response back. If the source
     * does not expecting a response, you don't need to call these methods.
     *
     * This method can throw:
     * - `Message.ErrorCode.MISSING_ID`: Message source is not expecting a response.
     * - `Message.ErrorCode.ALREADY_RESPONDED`: This message is already responded.
     * - `Message.ErrorCode.INVALID_JSON`: Could not stringify payload. Probably circular json.
     *
     * @param {any=} payload
     */
    resolve(payload) {
        if (isUndefined(this.id)) {
            throw new LineError(Message.ErrorCode.MISSING_ID, `This message could not be resolved (no id)`);
        }

        if (this.isResponded_) {
            throw new LineError(Message.ErrorCode.ALREADY_RESPONDED, `This message has already responded`);
        }

        try {
            JSON.stringify(payload);
        } catch (err_) {
            throw new LineError(
                Message.ErrorCode.INVALID_JSON,
                `Message must be resolved with json-friendly payload. Maybe circular json?`
            );
        }

        this.isResponded_ = true;
        this.emit('resolved', payload);
    }


    /**
     * Rejects the message, with sending error response back to the source.
     *
     * This method can throw:
     * - `Message.ErrorCode.MISSING_ID`: Message source is not expecting a response.
     * - `Message.ErrorCode.ALREADY_RESPONDED`: This message is already responded.
     * - `Message.ErrorCode.INVALID_JSON`: Could not stringify payload. Probably circular json.
     *
     * @param {any=} err
     */
    reject(err) {
        if (isUndefined(this.id)) {
            throw new LineError(Message.ErrorCode.MISSING_ID, `This message could not be rejected (no id)`);
        }

        if (this.isResponded_) {
            throw new LineError(Message.ErrorCode.ALREADY_RESPONDED, `This message has already responded`);
        }


        try {
            JSON.stringify(err);
        } catch (err_) {
            throw new LineError(
                Message.ErrorCode.INVALID_JSON,
                `Message must be resolved with json-friendly payload. Maybe circular json?`
            );
        }

        this.isResponded_ = true;
        this.emit('rejected', err);
    }


    toString() {
        const data = {n: this.name};

        if (!isUndefined(this.payload))
            data.p = this.payload;

        if (!isUndefined(this.id))
            data.i = this.id;

        if (!isUndefined(this.err)) {
            data.e = this.err instanceof Error ? assign({
                name: this.err.name,
                message: this.err.message
            }, this.err) : this.err;
        }

        // We're sure the data is json-friendly
        return JSON.stringify(data);
    }


    dispose() {
        const events = this.eventNames();
        events.forEach(event => this.removeAllListeners(event));
    }
}


/**
 * These message names are reserved for internal usage.
 * We recommend to not use any message name starts with `_` (underscore).
 *
 * @static
 * @readonly
 * @enum {string}
 */
Message.Name = {
    /**
     * `_r`
     */
    RESPONSE: '_r',
    /**
     * `_h`
     */
    HANDSHAKE: '_h',
    /**
     * `_p`
     */
    PING: '_p'
};


Message.ReservedNames = values(Message.Name);


/**
 * @static
 * @readonly
 * @enum {string}
 */
Message.ErrorCode = {
    /**
     * `mInvalidJson`
     */
    INVALID_JSON: 'mInvalidJson',
    /**
     * `mMissingId`
     */
    MISSING_ID: 'mMissingId',
    /**
     * `mAlreadyResponded`
     */
    ALREADY_RESPONDED: 'mAlreadyResponded',
};


module.exports = Message;
