/**
 * @file cadastroAuthElements.js
 * Mapeamento de elementos da tela de Cadastro Autenticado (com login/admin).
 * Clean Code: nomes claros, imutabilidade, fonte única de verdade.
 */

const TEST_IDS = Object.freeze({
  name: 'nome',
  email: 'email',
  password: 'password',
  adminCheckbox: 'checkbox',
  submit: 'cadastrarUsuario'
});

const SELECTORS = Object.freeze({
  // Cabeçalho
  heading: 'h1',
  
  // Campos do formulário
  nome: `[data-testid="${TEST_IDS.name}"], #nome`,
  email: `[data-testid="${TEST_IDS.email}"], #email`,
  password: `[data-testid="${TEST_IDS.password}"], #password`,
  admin: `[data-testid="${TEST_IDS.adminCheckbox}"], #administrador`,
  
  // Botão de submissão
  submit: `[data-testid="${TEST_IDS.submit}"]`,
  
  // Mensagens de alerta
  alert: '.alert[role="alert"]',
  alertClose: '.alert[role="alert"] .btn-close-error-alert'
});

module.exports = SELECTORS;

