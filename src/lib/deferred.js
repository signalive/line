const LineError = require('./error');


class Deferred {
    constructor({
        handler = () => {},
        onExpire = () => {},
        timeout = 0
    } = {}) {
        this.resolve_ = null;
        this.reject_ = null;

        this.timeout_ = null;
        this.timeoutDuration_ = timeout;
        this.onExpire_ = onExpire;
        this.isFinished_ = false;

        this.promise = new Promise((resolve, reject) => {
            this.resolve_ = resolve;
            this.reject_ = reject;

            try {
                handler(this);
            } catch (err) {
                this.reject(err);
            }
        });

        if (timeout > 0) {
            this.timeout_ = setTimeout(this.expire.bind(this), timeout);
        }
    }


    resolve(data) {
        if (this.isFinished_) return;

        this.isFinished_ = true;
        this.clearTimeout_();
        this.resolve_(data);
    }


    reject(err) {
        if (this.isFinished_) return;

        this.isFinished_ = true;
        this.clearTimeout_();
        this.reject_(err);
    }


    expire() {
        this.isFinished_ = true;
        this.clearTimeout_();
        this.onExpire_();
        this.reject_(new LineError(Deferred.ErrorCode.EXPIRED, `Timeout ${this.timeoutDuration_} ms exceed`));
    }


    dispose() {
        this.isFinished_ = true;
        this.clearTimeout_();
    }


    then(...args) {
        return this.promise.then.apply(this.promise, args);
    }


    catch(...args) {
        return this.promise.catch.apply(this.promise, args);
    }


    clearTimeout_() {
        if (this.timeout_) {
            clearTimeout(this.timeout_);
            this.timeout_ = null;
        }
    }
}


Deferred.ErrorCode = {
    EXPIRED: 'dExpired'
};


module.exports = Deferred;
