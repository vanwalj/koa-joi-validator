'use strict';

const Promise = require('bluebird');
const Joi = module.exports.Joi = module.exports.joi = require('joi');
const coBody = require('co-body');

const _validate = Promise.promisify(Joi.validate, { context: Joi });

module.exports.validator = function (opts) {
    const _opts = Object.assign({
        failure: 400
    }, opts);
    return function * (next) {
        this.request.validated = {};
        if (_opts.type && coBody[_opts.type]) {
            this.request.body = yield coBody[_opts.type](this);
        }
        try {
            if (_opts.body) {
                this.request.validated.body = yield _validate(this.request.body, _opts.body, _opts.options);
                this.request.body = this.request.validated.body;
            }
            if (_opts.headers) {
                this.request.validated.headers = yield _validate(this.request.headers, _opts.headers, _opts.options);
                this.request.headers = this.request.validated.headers;
            }
            if (_opts.query) {
                this.request.validated.query = yield _validate(this.request.query, _opts.query, _opts.options);
                this.request.query = this.request.validated.query;
            }
            if (_opts.params) {
                this.request.validated.params = yield _validate(this.request.params, _opts.params, _opts.options);
                this.request.params = this.request.validated.params;
            }
        } catch (e) {
            this.throw(_opts.failure, e);
        }
        yield next;
    };
};