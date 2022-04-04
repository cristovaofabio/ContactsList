import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Login from './modules/Login';
import RegisterContact from './modules/RegisterContact';
//import './assets/css/style.css';

const login = new Login('.formLogin');
const register = new Login('.formRegister');
const registerContact = new RegisterContact('.formRegisterContact');

login.init();
register.init();
registerContact.init();