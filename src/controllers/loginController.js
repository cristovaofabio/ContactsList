const { async } = require('regenerator-runtime');
const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-inside');
    return res.render('login');
};

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'I am happy to see you here!');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/login/index');
        });

    } catch (e) {
        return res.render('404');
    }
};

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.checkReportedData();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'User created successfully!');
        req.session.save(function () {
            return res.redirect('/login/index');
        });

    } catch (e) {
        return res.render('404');
    }
};

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
}