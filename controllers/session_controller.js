
exports.new = function (req, res) {
	var errors = req.session.errors ||{};
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};

exports.create = function (req, res) {
	var login = req.body.login,
		password = req.body.password,
		userController = require('./user_controller');

	userController.autenticar(login, password, function (error, user) {
		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect('/login');
			return;
		}

		//Crear req.session.user y guardar campos id y username
		//La session se define por la existenia de: req.session.user
		req.session.user = {
			id: user.id,
			username: user.username
		};

		res.redirect(req.session.redir.toString());
	});
};

exports.destroy = function (req, res) {
	delete req.session.user;
	res.redirect (req.session.redir.toString());
};