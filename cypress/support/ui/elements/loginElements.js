/**
 * @file loginElements.js
 * Mapeamento de elementos da tela de Login.
 * Clean Code: nomes claros, imutabilidade, fonte única de verdade.
 */

const TEST_IDS = Object.freeze({
  email: 'email',
  password: 'senha',
  submit: 'entrar',
  signup: 'cadastrar'
});

const SELECTORS = Object.freeze({
  inputEmail: `[data-testid="${TEST_IDS.email}"], #email`,
  inputPassword: `[data-testid="${TEST_IDS.password}"], #password`,
  submitButton: `[data-testid="${TEST_IDS.submit}"]`,
  signupLink: `[data-testid="${TEST_IDS.signup}"]`,
  form: 'form.form',
  alertMessage: '.alert[role="alert"], .alert.alert-secondary',
  alertClose: '.alert[role="alert"] .btn-close-error-alert, .alert .btn-close-error-alert, .alert [data-dismiss="alert"]'
});

module.exports = SELECTORS;
