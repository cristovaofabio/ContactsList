const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valid();

        if (this.errors.length > 0) return;

        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('User not found');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Wrong password');
            this.user = null;
            return;
        }

    }

    async checkReportedData() {
        this.valid();

        if (this.errors.length > 0) return;

        await this.existsUser();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    async existsUser() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('This email is already in use');
    }

    valid() {
        this.cleanUpData();

        if (!validator.isEmail(this.body.email)) {
            this.errors.push('Invalid email');
        }

        const passwordLength = this.body.password.length;

        if (passwordLength < 3 || passwordLength > 50) {
            this.errors.push('Invalid password');
        }
    }

    cleanUpData() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
        };
    }
}

module.exports = Login;