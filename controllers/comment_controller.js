var models = require('../models/models.js');

exports.new = function (req, res) {
    res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

exports.create = function (req, res) {
    var comment = models.Comment.build({
            texto: req.body.texto,
            QuizId: req.params.quizId
        }),
        errors = comment.validate(), errorList = [];

    if (errors) {
        if (errors.hasOwnProperty('texto')) {
            errorList.push({message: errors.pregunta[0]});
        }

        res.render('comments/new', {quiz: quiz, errors: errorList});
    } else {
        comment
            .save()
            .then(function () {
                res.redirect('/quizes/' + req.params.quizId);
            });
    }
};

exports.load = function (req, res, next, commentId) {
    models.Comment.find({
        where: {
            id: Number(commentId)
        }
    }).then(function (comment) {
        if (comment) {
            req.comment = comment;
            next();
        } else {
            next(new Error('No existe commentId=' + commentId))
        }
    }).catch(function (error) {
        next(error)
    });
};

exports.publish = function (req, res) {
    req.comment.publicado = true;

    req.comment.save({fields: ["publicado"]})
        .then(function () {
        res.redirect('/quizes/' + req.params.quizId);
    })
        .catch(function (error) {
        next(error);
    });

}