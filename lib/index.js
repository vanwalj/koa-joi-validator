'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Promise = require('bluebird');
const Joi = module.exports.Joi = module.exports.joi = require('joi');
const coBody = require('co-body');

const _validate = Promise.promisify(Joi.validate, { context: Joi });

module.exports.validate = function (opts) {
  var _this = this;

  const _opts = _extends({
    failure: 400
  }, opts);

  return (() => {
    var ref = _asyncToGenerator(function* (ctx, next) {
      if (_opts.type && coBody[_opts.type]) {
        _this.request.body = yield coBody[_opts.type](_this);
      }
      try {
        if (_opts.body) {
          _this.request.body = yield _validate(_this.request.body, _opts.body, _opts.options);
        }
        if (_opts.headers) {
          Object.assign(_this.request.headers, (yield _validate(_this.request.headers, _opts.headers, _opts.options)));
        }
        if (_opts.query) {
          const query = yield _validate(_this.request.query, _opts.query, _opts.options);
          Object.defineProperty(_this.request, 'query', {
            get: function get() {
              return query;
            }
          });
        }
        if (_opts.params) {
          _this.params = yield _validate(_this.params, _opts.params, _opts.options);
        }
      } catch (e) {
        _this.throw(_opts.failure, e);
      }
      yield next();
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })();
};