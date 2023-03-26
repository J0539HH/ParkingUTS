# bootstrap4 datetime picker rails

Makes [Tempus Dominus](https://github.com/tempusdominus/bootstrap-4) available to your rails appliation through the asset pipeline.

## Usage Instructions

Add the following to your `Gemfile` and then run `bundle`

`gem 'bootstrap4-datetime-picker-rails'`

Add the following to `application.js`

```
//= require moment
//= require tempusdominus-bootstrap-4.js
```

Add the following to `application.scss`

`@import "tempusdominus-bootstrap-4.css";`
