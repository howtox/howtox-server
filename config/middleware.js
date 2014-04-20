var path = require('path'),
  express = require('express'),
  hbs = require('express-hbs');

module.exports = function(app) {
  // Use `.hbs` for extensions and find partials in `views/partials`.
  app.engine('hbs', hbs.express3({
    partialsDir: path.join(__dirname, '..', '/views/partials')
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '..', '/views'));

  app.use(express.favicon( path.join(__dirname, 'public/images/favicon.ico') ));
  app.use(express.logger('dev'));

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());

  app.use(express.cookieParser('your secret here'));
  app.use(express.session());

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(app.router);
  app.use(require('stylus').middleware(path.join(__dirname, '..', 'public')));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.set('port', process.env.PORT || 3000);
};
