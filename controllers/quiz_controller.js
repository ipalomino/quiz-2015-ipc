//GET /quizes/question 
var models = require ('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
  	function(quiz) {
  		if(quiz) {
  			req.quiz = quiz;
  			next();
  		} else {
  			next(new Error('No existe quizId=' + quizId));
  		}
	}
  	).catch(function(error){next(error)});
};


// GET /users/:userId/quizes
exports.index = function(req, res) {  
  models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error){next(error);})
};


// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
}; 


// GET /quizes/:id/answer
exports.answer = function(req, res) {
	if(req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
	} else {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
	}
};


exports.new = function (req, res) {
	var quiz = models.Quiz.build({
		pregunta: 'Pregunta',
		respuesta: 'Respuesta'
	});

	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function (req, res) {
	var quiz= models.Quiz.build(req.body.quiz),
		errors = quiz.validate(),errorList = [];


	if (errors) {
		if(errors.hasOwnProperty('pregunta')) {
			errorList.push({message: errors.pregunta[0]});
		}
		if(errors.hasOwnProperty('respuesta')) {
			errorList.push({message: errors.respuesta[0]});
		}

		res.render('quizes/new', {quiz: quiz, errors: errorList});
	} else {
		quiz // save: guarda en DB campos pregunta y respuesta de quiz
			.save({fields: ["pregunta", "respuesta"]})
			.then(function () {
				res.redirect('/quizes')
			});
	}
};

//exports.create = function (req, res) {
//	var quiz = models.Quiz.build(req.body.quiz);
//
//	quiz.validate()
//		.then(function (err) {
//					if(err) {
//						res.render('quizes/new', {quiz: quiz, errors: err.errors});
//					} else {
//						quiz.save({fields: ["pregunta", "respuesta"]}).then(function (){res.redirect('/quizes');});
//					}
//	});
//};

exports.author = function (req, res) {
	res.render('author/author', {nombre: 'Isaac Palomino', email: 'isaac.palomino@hotmail.com', errors: []});
};


