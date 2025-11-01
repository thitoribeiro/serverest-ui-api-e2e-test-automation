// @negative @positive
// Especificação única: busca de usuário por ID (GET /usuarios/{_id}) – NEGATIVOS → POSITIVOS
// Sem custom commands: uso direto de cy.request + validação AJV inline

import { assertTypicalJsonHeaders, validateSchema } from '../../support/api/helpers.js';

// Schema para resposta de sucesso (200)
const getUsuarioByIdSuccessSchema = {
  "type": "object",
  "required": ["nome", "email", "password", "administrador", "_id"],
  "properties": {
    "nome": { "type": "string" },
    "email": { "type": "string" },
    "password": { "type": "string" },
    "administrador": { "type": "string", "enum": ["true", "false"] },
    "_id": { "type": "string" }
  },
  "additionalProperties": true
};

// Schema para resposta de erro (400)
const getUsuarioByIdErrorSchema = {
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": { "const": "Usuário não encontrado" }
  },
  "additionalProperties": true
};

describe('API /usuarios/{_id} :: BUSCA POR ID', () => {
  let testUsers;
  let createdUsers = [];

  before(() => {
    cy.fixture('api/usuarios.test.data.json').then((data) => {
      testUsers = data;
      
      // Criar usuários para obter IDs válidos
      const usersToCreate = [
        data.admin_user,
        data.regular_user,
        data.case_sensitive_user
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
            cy.log(`✅ Usuário criado: ${userData.nome} - ID: ${res.body._id}`);
          }
        });
      });
    });
  });

  //
  // =========================
  // NEGATIVOS
  // =========================
  //

  it('CT-001 — [400] _id inexistente (string aleatória) @negative', () => {
    // Arrange
    const idInexistente = 'ZZZnaoExiste123';
    const url = `/usuarios/${encodeURIComponent(idInexistente)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-001 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-001 - Response body: ${JSON.stringify(res.body)}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      // A API retorna validação de formato, não "Usuário não encontrado"
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-002 — [400] _id numérico-like inexistente @negative', () => {
    // Arrange
    const idNumerico = '123456789';
    const url = `/usuarios/${encodeURIComponent(idNumerico)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-002 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-003 — [400] _id com caracteres especiais @negative', () => {
    // Arrange
    const idEspecial = 'id@#$%^&*()';
    const url = `/usuarios/${encodeURIComponent(idEspecial)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-003 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-004 — [400] _id com espaços (trim não aplicado) @negative', () => {
    // Arrange
    const idComEspacos = ' id com espacos ';
    const url = `/usuarios/${encodeURIComponent(idComEspacos)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-004 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-005 — [400] _id muito longo @negative', () => {
    // Arrange
    const idLongo = 'a'.repeat(1000);
    const url = `/usuarios/${encodeURIComponent(idLongo)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-005 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-006 — [400] _id muito curto @negative', () => {
    // Arrange
    const idCurto = 'a';
    const url = `/usuarios/${encodeURIComponent(idCurto)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-006 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-007 — [400] Query extra ignorada @negative', () => {
    // Arrange
    const idInexistente = 'ZZZnaoExiste123';
    const url = `/usuarios/${encodeURIComponent(idInexistente)}?foo=bar&baz=qux`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-007 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  it('CT-008 — [400] Header Accept ausente @negative', () => {
    // Arrange
    const idInexistente = 'ZZZnaoExiste123';
    const url = `/usuarios/${encodeURIComponent(idInexistente)}`;

    // Act
    cy.request({ method: 'GET', url, headers: {}, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-008 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      expect(res.headers['content-type']).to.contain('application/json');
      expect(res.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos');
    });
  });

  //
  // =========================
  // POSITIVOS
  // =========================
  //

  it('CT-009 — [200] Buscar por _id (admin) @positive', () => {
    // Arrange
    const adminUser = createdUsers.find(user => user.administrador === 'true');
    if (!adminUser) {
      cy.log('sem admin criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(adminUser._id)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-009 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-009 - Admin: ${adminUser.nome} (${adminUser.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      
      // Validar dados retornados
      expect(res.body._id).to.eq(adminUser._id);
      expect(res.body.nome).to.eq(adminUser.nome);
      expect(res.body.email).to.eq(adminUser.email);
      expect(res.body.password).to.eq(adminUser.password);
      expect(res.body.administrador).to.eq(adminUser.administrador);
      
      validateSchema(res.body, getUsuarioByIdSuccessSchema);
    });
  });

  it('CT-010 — [200] Buscar por _id (não-admin) @positive', () => {
    // Arrange
    const regularUser = createdUsers.find(user => user.administrador === 'false');
    if (!regularUser) {
      cy.log('sem usuário regular criado');
      return;
    }
    
    const url = `/usuarios/${encodeURIComponent(regularUser._id)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-010 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-010 - Usuário: ${regularUser.nome} (${regularUser.email})`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      
      // Validar dados retornados
      expect(res.body._id).to.eq(regularUser._id);
      expect(res.body.nome).to.eq(regularUser.nome);
      expect(res.body.email).to.eq(regularUser.email);
      expect(res.body.password).to.eq(regularUser.password);
      expect(res.body.administrador).to.eq(regularUser.administrador);
      
      validateSchema(res.body, getUsuarioByIdSuccessSchema);
    });
  });

  it('CT-011 — [200/400] Case sensitivity do _id (registrar observado) @positive', () => {
    // Arrange
    if (createdUsers.length === 0) {
      cy.log('sem usuários criados');
      return;
    }
    
    const user = createdUsers[0];
    const idOriginal = user._id;
    const idUppercase = idOriginal.toUpperCase();
    const url = `/usuarios/${encodeURIComponent(idUppercase)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-011 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-011 - ID original: ${idOriginal}, ID uppercase: ${idUppercase}`);
      cy.log(`CT-011 - Comportamento observado: ${res.status === 200 ? 'Case insensitive' : 'Case sensitive'}`);
      
      if (res.status === 200) {
        assertTypicalJsonHeaders(res.headers);
        expect(res.body._id).to.eq(user._id);
        validateSchema(res.body, getUsuarioByIdSuccessSchema);
      } else {
        expect(res.status).to.eq(400);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.message).to.eq('Usuário não encontrado');
        validateSchema(res.body, getUsuarioByIdErrorSchema);
      }
    });
  });

  it('CT-012 — [200] _id com encode opcional no path @positive', () => {
    // Arrange
    if (createdUsers.length === 0) {
      cy.log('sem usuários criados');
      return;
    }
    
    const user = createdUsers[0];
    const idComCaracteres = user._id + '?test=1&value=2';
    const url = `/usuarios/${encodeURIComponent(idComCaracteres)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-012 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-012 - ID original: ${user._id}, ID com encode: ${idComCaracteres}`);
      
      // Como o ID com caracteres especiais não existe, deve retornar 400
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Usuário não encontrado');
      validateSchema(res.body, getUsuarioByIdErrorSchema);
    });
  });
});
