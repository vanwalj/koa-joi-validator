'use strict';

const Promise = require('bluebird');
const Joi = module.exports.Joi = module.exports.joi = require('joi');
const coBody = require('co-body');

const _validate = Promise.promisify(Joi.validate, { context: Joi });

module.exports.validate = opts => {
  const _opts = {
    failure: 400,
    ...opts
  };

  return async (ctx, next) => {
    if (_opts.type && coBody[_opts.type]) {
      ctx.request.body = await coBody[_opts.type](ctx);
    }
    try {
      if (_opts.body) {
        ctx.request.body = await _validate(ctx.request.body, _opts.body, _opts.options);
      }
      if (_opts.headers) {
        Object.assign(ctx.request.headers, await _validate(ctx.request.headers, _opts.headers, _opts.options));
      }
      if (_opts.query) {
        const query = await _validate(ctx.request.query, _opts.query, _opts.options);
        Object.defineProperty(ctx.request, 'query', {
          get () {
            return query;
          }
        });
      }
      if (_opts.params) {
        ctx.params = await _validate(ctx.params, _opts.params, _opts.options);
      }
    } catch (e) {
      ctx.throw(_opts.failure, e);
    }
    await next();
  };
};
