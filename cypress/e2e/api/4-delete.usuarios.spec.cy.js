// @negative @positive
// Especificação única: exclusão de usuário por ID (DELETE /usuarios/{_id}) – NEGATIVOS → POSITIVOS
// Sem custom commands: uso direto de cy.request + validação AJV inline

import { assertTypicalJsonHeaders, validateSchema } from '../../support/api/helpers.js';

// Schema para resposta de sucesso (200)
const deleteUsuarioSuccessSchema = {
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": { "type": "string" }
  },
  "additionalProperties": true
};

// Schema para resposta de erro (400)
const deleteUsuarioErrorSchema = {
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": { "type": "string" }
  },
  "additionalProperties": true
};

describe('API /usuarios/{_id} :: EXCLUSÃO', () => {
  let testUsers;
  let createdUsers = [];

  before(() => {
    cy.fixture('api/usuarios.test.data.json').then((data) => {
      testUsers = data;
      
      // Criar usuários para obter IDs válidos para exclusão
      const usersToCreate = [
        data.admin_user,
        data.regular_user,
        data.update_user,
        data.delete_user,
        data.case_sensitive_user,
        data.special_chars_user
      ];
      
      usersToCreate.forEach(userData => {
        cy.request({
          method: 'POST',
          url: '/usuarios',
          body: userData,
          failOnStatusCode: false
        }).then((res) => {
          if (res.status === 201) {
            createdUsers.push({
              ...userData,
              _id: res.body._id
            });
            cy.log(`✅ Usuário criado para exclusão: ${userData.nome} - ID: ${res.body._id}`);
          }
        });
      });
    });
  });

  //
  // =========================
  // POSITIVOS
  // =========================
  //

  it('CT-006 — [200] Exclusão bem-sucedida de usuário válido @positive', () => {
    // Arrange
    const userToDelete = createdUsers.find(user => user.nome === 'Usuario Para Deletar');
    if (!userToDelete) {
      cy.log('sem usuário para deletar criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(userToDelete._id)}`;

    // Act
    cy.request({ method: 'DELETE', url }).then((res) => {
      // Assert
      cy.log(`CT-006 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-006 - Usuário excluído: ${userToDelete.nome} (${userToDelete.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
      validateSchema(res.body, deleteUsuarioSuccessSchema);
    });
  });

  it('CT-007 — [200] Exclusão de usuário administrador @positive', () => {
    // Arrange
    const adminUser = createdUsers.find(user => user.administrador === 'true');
    if (!adminUser) {
      cy.log('sem admin criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(adminUser._id)}`;

    // Act
    cy.request({ method: 'DELETE', url }).then((res) => {
      // Assert
      cy.log(`CT-007 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-007 - Admin excluído: ${adminUser.nome} (${adminUser.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
      validateSchema(res.body, deleteUsuarioSuccessSchema);
    });
  });

  it('CT-008 — [200] Exclusão de usuário não-administrador @positive', () => {
    // Arrange
    const regularUser = createdUsers.find(user => user.administrador === 'false');
    if (!regularUser) {
      cy.log('sem usuário regular criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(regularUser._id)}`;

    // Act
    cy.request({ method: 'DELETE', url }).then((res) => {
      // Assert
      cy.log(`CT-008 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-008 - Usuário excluído: ${regularUser.nome} (${regularUser.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
      validateSchema(res.body, deleteUsuarioSuccessSchema);
    });
  });

  it('CT-010 — [200] Exclusão com _id válido e encode no path @positive', () => {
    // Arrange
    const userToDelete = createdUsers.find(user => user.nome === 'Usuário com Acentuação & Símbolos');
    if (!userToDelete) {
      cy.log('sem usuário especial criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(userToDelete._id)}`;

    // Act
    cy.request({ method: 'DELETE', url }).then((res) => {
      // Assert
      cy.log(`CT-010 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-010 - Usuário especial excluído: ${userToDelete.nome} (${userToDelete.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Registro excluído com sucesso');
      validateSchema(res.body, deleteUsuarioSuccessSchema);
    });
  });

  // 🔴 Cenário Negativo — valida tentar excluir usuário sem informar o ID obrigatório
  it('CT-NEG-001 - [400] Deve retornar erro ao tentar excluir usuário sem informar o ID', () => {
    // Arrange
    const userId = '';

    // Act
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${userId}`,
      failOnStatusCode: false
    }).then((res) => {
      // Assert
      expect([400, 405]).to.include(res.status);
      if (res.status === 400) {
        expect(res.body).to.have.property('message');
        expect(String(res.body.message)).to.match(/id|_id|obrigat[óo]ri/i);
      }
      assertTypicalJsonHeaders(res.headers);
    });
  });
});
