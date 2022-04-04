const { async } = require('regenerator-runtime');
const Contact = require('../models/ContactModel');

exports.index = async (req, res) => {

    if (!req.session.user) {
        req.flash('errors', 'Log in to see your contacts');
        res.render('index', { contacts: null });
        return;
    }

    const idUser = req.session.user._id;
    const contacts = await Contact.searchContacts(idUser);
    res.render('index', { contacts });
    return;
};