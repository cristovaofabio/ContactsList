const { async } = require('regenerator-runtime');
const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    });
    return;
};

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const idUser = req.session.user._id;

        if (!idUser) {
            req.flash('errors', 'You need to login');
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }

        await contact.register(idUser);

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }

        req.flash('success', 'Contact created');
        req.session.save(function () {
            return res.redirect(`/contact/index/${contact.contact._id}`);
        });
    } catch (e) {
        console.log('Errorrrr:', e);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404');

    const contact = await Contact.searchId(req.params.id)

    if (!contact) return res.render('404');

    res.render('contact', { contact });
}

exports.edit = async function (req, res) {

    try {
        if (!req.params.id) return res.render('404');

        const contact = new Contact(req.body);
        await contact.edit(req.params.id);

        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }

        req.flash('success', 'Edited contact');
        req.session.save(function () {
            return res.redirect(`/contact/index/${contact.contact._id}`);
        });
    } catch (e) {
        console.log('ERROR:', e);
        return res.render('404');
    }
}