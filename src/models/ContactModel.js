const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false, default: '' },
    telephone: { type: String, required: false, default: '' },
    createdIn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.searchId = async function (id) {
    if(typeof id !== 'string') return;
    
    const user = await ContactModel.findById(id);

    return user;
}

Contact.prototype.register = async function () {
    this.valid();

    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(this.body);
};

Contact.prototype.valid = function () {
    this.cleanUpData();

    if (this.body.email && !validator.isEmail(this.body.email)) {
        this.errors.push('Invalid email');
    }

    if (!this.body.firstName || !this.body.lastName) {
        this.errors.push('First and last name are required');
    }

    if (!this.body.email && !this.body.telephone) {
        this.errors.push('Email or telephone is required');
    }
};

Contact.prototype.cleanUpData = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        firstName: this.body.firstName,
        lastName: this.body.lastName,
        email: this.body.email,
        telephone: this.body.telephone,
    };
};

module.exports = Contact;