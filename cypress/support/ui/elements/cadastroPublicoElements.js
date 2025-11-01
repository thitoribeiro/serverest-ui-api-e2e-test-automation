/**
 * @file cadastroPublicoElements.js
 * Mapeamento de elementos da tela de Cadastro Público (sem login).
 * Clean Code: nomes claros, imutabilidade, fonte única de verdade.
 */

const TEST_IDS = Object.freeze({
  name: 'nome',
  email: 'email',
  password: 'password',
  adminCheckbox: 'checkbox',
  submit: 'cadastrar',
  signIn: 'entrar'
});

const SELECTORS = Object.freeze({
  // Campos do formulário
  inputName: `[data-testid="${TEST_IDS.name}"], #nome`,
  inputEmail: `[data-testid="${TEST_IDS.email}"], #email`,
  inputPassword: `[data-testid="${TEST_IDS.password}"], #password`,
  adminCheckbox: `[data-testid="${TEST_IDS.adminCheckbox}"], #administrador`,
  
  // Botões e links
  submitButton: `[data-testid="${TEST_IDS.submit}"]`,
  signInLink: `[data-testid="${TEST_IDS.signIn}"]`,
  
  // Estrutura do formulário
  form: 'form.form',
  
  // Mensagens e feedback
  feedbackMessage: '.message.form-text',
  alertMessage: '.alert.alert-secondary, .alert[role="alert"]',
  toastMessage: '.alert, [role="alert"], [role="status"], .toast, [data-testid*="toast"], [data-cy*="toast"]',
  toastClose: '.alert .btn-close-error-alert, .alert [data-dismiss="alert"], [data-testid*="toast-close"], [data-cy*="toast-close"], .toast [aria-label="close"], .toast .close'
});

module.exports = SELECTORS;

