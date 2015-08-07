var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    partials = require('express-partials'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    routes = require('./routes/index'),
    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser("semilla"));
app.use(session({
    secret: 'semilla',
    resave: false,
    saveUninitialized: true
}));

//auto-logout
app.use (function (req,res, next) {
    var margin = 2*60*1000,
        now = new Date().getTime(),
        lastOp = Number(req.session.lastOpDate) + Number(margin);

    if(req.session.lastOpDate) {
        if( lastOp < now) {
            //session expirada
            console.log("Session has expired...");
            delete req.session.user;
            next();
        } else {
            next();
        }
    } else {
        req.session.lastOpDate = now;
        next();
    }
});

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function (req, res, next){
    //guarda el path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    //hace visible la sesion en las vistas
    res.locals.session = req.session;
    next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
