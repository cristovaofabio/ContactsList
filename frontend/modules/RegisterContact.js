export default class RegisterContact{
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const firstNameInput = el.querySelector('input[name="firstName"]');
        const lastNamedInput = el.querySelector('input[name="lastName"]');
        let error = false;

        if (!firstNameInput.value) {
            alert('Invalid first name!');
            error = true;
        }

        if (!lastNamedInput.value) {
            alert('Invalid last name!');
            error = true;
        }

        if (!error) el.submit();
    }
}