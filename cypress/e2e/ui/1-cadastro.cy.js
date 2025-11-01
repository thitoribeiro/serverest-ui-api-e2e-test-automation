/// <reference types="cypress" />

const messages = require('../../fixtures/ui/messages.json');
const testData = require('../../fixtures/ui/testData.json');
const elements = require('../../support/ui/elements/cadastroPublicoElements');
const { buildUser } = require('../../support/ui/utils/userPayload');

describe('Cadastro de Usuário', () => {
  beforeEach(() => {
    cy.visitCadastro();
  });

  // Negativos
  it('Tentativa de cadastro com campos vazios', () => {
    cy.get(elements.submitButton).click();
    cy.get(elements.alertMessage).should('be.visible');
    cy.contains(messages.requiredName).should('exist');
    cy.contains(messages.requiredEmail).should('exist');
    cy.contains(messages.requiredPassword).should('exist');
  });

  it('Tentativa de cadastro com e-mail inválido', () => {
    cy.get(elements.inputName).type('Teste');
    cy.get(elements.inputEmail).type('invalido@');
    cy.get(elements.inputPassword).type('Teste@123');
    cy.get(elements.adminCheckbox).click();
    cy.get(elements.submitButton).click();
    // Verifica se aparece alert com mensagem ou se o campo está inválido (validação HTML5)
    cy.get('body').should(($body) => {
      const hasAlert = $body.find(elements.alertMessage).length > 0;
      const emailField = $body.find(elements.inputEmail)[0];
      const isInvalid = emailField && (emailField.validity?.valid === false || emailField.getAttribute('aria-invalid') === 'true');
      expect(hasAlert || isInvalid).to.be.true;
    });
  });

  it('Tentativa de cadastro com formulário vazio', () => {
    cy.get(elements.submitButton).click();
    cy.get(elements.alertMessage).should('be.visible');
    cy.contains(messages.requiredName).should('exist');
    cy.contains(messages.requiredEmail).should('exist');
    cy.contains(messages.requiredPassword).should('exist');
  });

  it('Tentativa de cadastro com e-mail já cadastrado', () => {
    cy.get(elements.inputName).type('Usuário Teste');
    cy.get(elements.inputEmail).type(testData.existingUser.email);
    cy.get(elements.inputPassword).type('Teste@123');
    cy.get(elements.adminCheckbox).click();
    cy.get(elements.submitButton).click();

    // Validar mensagem de email já usado
    cy.get(elements.alertMessage).should('be.visible');
    cy.contains(messages.emailAlreadyUsed).should('exist');
    cy.url().should('include', '/cadastrarusuarios');
  });

  // Positivo (dados sempre novos)
  it('Cadastro de usuário com sucesso', () => {
    const user = buildUser(); // gera e-mail único
    cy.preencherCadastro(user);
    cy.submeterCadastro();

    // Ajuste a asserção conforme sua UI/Back
    cy.assertToast(messages.successRegister);
    cy.fecharToast();

    // Exemplo de verificação pós-cadastro (ajuste seletor/rota real)
    // cy.url().should('include', '/dashboard');
  });
});
