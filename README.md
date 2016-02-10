# koa-joi-validator
A simple validator for your awesome koa application

## API

```
validator.Joi
```
The package Joi version (prefer this version over your custom version in case of breaking changes)

```
validator.validate(options)
```
A koa middleware which will validate and transform the request

| param | type | required | description |
|-------|------|------------------|-------------|
| options | {} | true | |
| options.type | string | Only if you want the request body to be parsed | the coBody parser to call, can be `json` `form` or `text` |
| options.failure | int | false | The error code to throw on case of validation error, default to 400 |
| options.options | {} | false | Options passed to Joi validator, such as `allowUnknown` |
| options.body | Joi.object | false | A joi schema validated against the request body | 
| options.params | Joi.object | false | A joi schema validated against the request params | 
| options.headers | Joi.object | false | A joi schema validated against the request headers | 
| options.query | Joi.object | false | A joi schema validated against the request query | 
 
## Usage

``` es6
router.post('/:number/:string/:date',
  validator.validate({
    type: 'json',
    params: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    },
    body: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    },
    headers: validator.Joi.object({
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    }).options({ allowUnknown: true }),
    query: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    }
  }),
  function * () {
    this.assert(typeof this.params.number === 'number');
    this.assert(typeof this.params.string === 'string');
    this.assert(this.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach(el => {
      this.assert(typeof this.request[el].number === 'number');
      this.assert(typeof this.request[el].string === 'string');
      this.assert(this.request[el].date instanceof Date);
    });

    this.status = 204;
  }
);
```
