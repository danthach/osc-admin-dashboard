/*
Module Dependencies 
*/
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    uid = require('gen-uid'),
    session = require('express-session'),
    crypto = require('crypto');
    // csrf = require('csurf'),

var app = express();

/*
Database and Models
*/
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/oscDashDb");
var UserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    admin: Boolean
});
mongodb://heroku_ll7lq7jp:406uvnqqm2ma11kildcf4lgln7@ds047682.mongolab.com:47682/heroku_ll7lq7jp
ds047682.mongolab.com:47682/heroku_ll7lq7jp
heroku_ll7lq7jp
406uvnqqm2ma11kildcf4lgln7

var User = mongoose.model('users', UserSchema);
/*
Middlewares and configurations 
*/
// var csrfValue = function(req) {
//   var token = (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
//   return token;
// };
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('oscDashboard'));
app.use(session({
  genid: function(req) {
    return uid.token()
  },
  secret: 'oscdashsessionsecret',
  saveUninitialized: true,
  resave: true
}))
// app.use(csrf({value: csrfValue}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    // res.cookie('XSRF-TOKEN', req.csrfToken());
    var err = req.session.error,
        msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});
/*
Helper Functions
*/

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });

}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {
    User.count({
        username: req.body.email
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.send({"userAlreadyExists": true});
        }
    });
}

function stripUsers(users){
    var safeUsers = {};

    var usersLen = users.length;
    for(var i = 0; i < usersLen; i++) {
        safeUsers[i] = {
            username: users[i].username,
            _id: users[i]._id,
            admin: users[i].admin
        };
    }

    return safeUsers;
}

var len = 128;
var iterations = 12000;
function hash(pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, fn);
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash);
      });
    });
  }
};

/*
Routes
*/

app.get('/user', function (req, res) {
    res.send({"user": req.session.user});
});

app.get("/userList", function (req, res) {
    User.find().exec(function(err, users){

        var strippedUsers = stripUsers(users);

        if(err) return send(err);

        res.send(strippedUsers);
    });
});

app.post("/createUser", userExist, function (req, res) {
    var password = req.body.password;
    var username = req.body.email;
    var admin    = req.body.admin;

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
            admin: admin
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.username, password, function(err, user){
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.send({"newUser": newUser.username});
                    });
                }
            });
        });
    });
});

app.delete('/deleteUser/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
      if(err) return res.send(err);
      res.send({"deletedUser": user});
    });
});

app.post("/login", function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                var strippedUser = {
                    _id: user._id,
                    username: user.username,
                    admin: user.admin,
                };
                res.send(strippedUser);
            });
        } else {
            req.session.error = 'Authentication failed, please check your username and password.';
            res.send({"error": true});
        }
    });
});

app.post('/changePassword', function (req, res) {
    var newPassword = req.body.first;
    hash(newPassword, function (err, salt, hash) {
        if (err) throw err;

        var query = {"_id": req.body.userId};
        var update = {salt: salt, hash: hash};
        var options = {};
        User.findOneAndUpdate(query, update, options, function(err, user) {
          if (err) throw err;
          res.send({"changedPassword": true});
        });
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        res.send({"success": true});
    });
});


http.createServer(app).listen(process.env.PORT || 3000);