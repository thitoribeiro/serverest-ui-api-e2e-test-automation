/// <reference types="cypress" />

/**
 * @file cadastro-usuario-auth.cy.js
 * Testes de Cadastro de Usuário via UI na área autenticada (admin).
 * Este spec testa o fluxo após login, diferente do cadastro público.
 */

const messages = require('../../fixtures/ui/messages.json');
const testData = require('../../fixtures/ui/testData.json');
const homeElements = require('../../support/ui/elements/homeElements');
const cadastroAuthElements = require('../../support/ui/elements/cadastroAuthElements');
const listUsersElements = require('../../support/ui/elements/listUsersElements');
const { buildUser } = require('../../support/ui/utils/userPayload');

describe('Cadastro de Usuário (UI - autenticado)', () => {
  beforeEach(() => {
    // Login via comando customizado
    cy.loginUI();

    // Na Home, clicar no card para cadastro
    cy.get(homeElements.cardCadastrarUsuariosBtn).should('be.visible').click();

    // Validar URL e H1
    cy.url().should('include', '/admin/cadastrarusuarios');
    cy.get(cadastroAuthElements.heading).should('contain.text', 'Cadastro de usuários');
  });

  // Helper para fechar alerts se existirem
  const closeAlertsIfAny = () => {
    cy.get('body').then(($body) => {
      if ($body.find(cadastroAuthElements.alertClose).length > 0) {
        cy.get(cadastroAuthElements.alertClose).each(($btn) => {
          cy.wrap($btn).click({ force: true });
        });
        cy.get(cadastroAuthElements.alert).should('not.exist');
      }
    });
  };

  // CT-001: Campos vazios
  it('CT-001: Tentativa de cadastro com campos vazios', () => {
    cy.get(cadastroAuthElements.submit).click();

    // Validar 3 banners com mensagens obrigatórias
    cy.get(cadastroAuthElements.alert).should('be.visible');
    cy.contains(messages.requiredName).should('exist');
    cy.contains(messages.requiredEmail).should('exist');
    cy.contains(messages.requiredPassword).should('exist');

    closeAlertsIfAny();
    cy.url().should('include', '/admin/cadastrarusuarios');
  });

  // CT-002: Apenas nome preenchido
  it('CT-002: Tentativa de cadastro apenas com nome preenchido', () => {
    cy.get(cadastroAuthElements.nome).type('Usuário Teste');
    cy.get(cadastroAuthElements.submit).click();

    // Validar mensagens de email e password obrigatórios
    cy.get(cadastroAuthElements.alert).should('be.visible');
    cy.contains(messages.requiredEmail).should('exist');
    cy.contains(messages.requiredPassword).should('exist');

    closeAlertsIfAny();
    cy.url().should('include', '/admin/cadastrarusuarios');
  });

  // CT-003: E-mail inválido (HTML5)
  it('CT-003: Tentativa de cadastro com e-mail inválido', () => {
    cy.get(cadastroAuthElements.nome).type('Usuário Teste');
    cy.get(cadastroAuthElements.email).type('foo#bar.com').blur();
    cy.get(cadastroAuthElements.password).type('Teste@123');

    // Validar que o campo email está inválido (validação HTML5)
    cy.get(cadastroAuthElements.email).then(($el) => {
      const el = $el[0];
      expect(el.checkValidity(), 'input email validity').to.be.false;
    });

    cy.get(cadastroAuthElements.submit).click();
    cy.url().should('include', '/admin/cadastrarusuarios');
  });

  // CT-004: E-mail já existente
  it('CT-004: Tentativa de cadastro com e-mail já cadastrado', () => {
    cy.get(cadastroAuthElements.nome).type('Usuário Teste');
    cy.get(cadastroAuthElements.email).type(testData.existingUser.email);
    cy.get(cadastroAuthElements.password).type('Teste@123');
    cy.get(cadastroAuthElements.submit).click();

    // Validar mensagem de email já usado
    cy.get(cadastroAuthElements.alert).should('be.visible');
    cy.contains(messages.emailAlreadyUsed).should('exist');

    closeAlertsIfAny();
    cy.url().should('include', '/admin/cadastrarusuarios');
  });

  // CT-005: Sucesso com gerador
  it('CT-005: Cadastro de usuário com sucesso', () => {
    const user = buildUser({ admin: true });

    // Preencher formulário
    cy.get(cadastroAuthElements.nome).clear().type(user.name);
    cy.get(cadastroAuthElements.email).clear().type(user.email);
    cy.get(cadastroAuthElements.password).clear().type(user.password);

    // Marcar checkbox admin se necessário
    cy.get(cadastroAuthElements.admin).then(($checkbox) => {
      if (user.admin && !$checkbox.is(':checked')) {
        cy.wrap($checkbox).click();
      }
    });

    // Submeter
    cy.get(cadastroAuthElements.submit).click();

    // Validar redirecionamento para lista de usuários
    cy.url().should('include', '/admin/listarusuarios');

    // Validar H1
    cy.get(listUsersElements.heading)
      .should('be.visible')
      .and('contain.text', 'Lista dos usuários');

    // Opcional: verificar se o email aparece na lista (se renderiza imediatamente)
    cy.get('body').then(($body) => {
      if ($body.find(`td:contains("${user.email}")`).length > 0 || 
          $body.text().includes(user.email)) {
        cy.contains(user.email).should('be.visible');
      }
    });
  });
});
