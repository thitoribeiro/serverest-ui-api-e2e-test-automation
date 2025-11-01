// @negative @positive
// Especificação única: listagem de usuários (GET /usuarios) – NEGATIVOS → POSITIVOS
// Sem custom commands: uso direto de cy.request + validação AJV inline

import { createTestUser } from '../../support/api/setup.usuarios.js';
import { assertTypicalJsonHeaders, validateSchema } from '../../support/api/helpers.js';

// Schema para resposta de sucesso do GET /usuarios
const getUsuariosSuccessSchema = {
  "type": "object",
  "required": ["quantidade", "usuarios"],
  "properties": {
    "quantidade": { "type": "number" },
    "usuarios": {
      "type": "array",
      "items": {
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
      }
    }
  },
  "additionalProperties": true
};

describe('API /usuarios :: LISTAGEM', () => {
  let fx;
  let testUsers;

  before(() => {
    cy.fixture('api/usuarios.create.cases.json').then((data) => (fx = data));
    cy.fixture('api/usuarios.test.data.json').then((data) => {
      testUsers = data;
    });
    
    // Criar usuários de teste necessários
    cy.fixture('api/usuarios.test.data.json').then((data) => {
      const usersToCreate = [
        data.admin_user,
        data.regular_user,
        data.duplicate_name_user,
        data.duplicate_name_user2,
        data.special_chars_user,
        data.case_sensitive_user,
        data.substring_test_user,
        data.combination_test_user
      ];
      
      usersToCreate.forEach(userData => {
        createTestUser(userData);
      });
    });
  });

  //
  // =========================
  // NEGATIVOS
  // =========================
  //

  it('CT-001 — [400] Filtro por email com formato inválido (sem @) @negative', () => {
    // Arrange
    const emailInvalido = 'email-invalido';
    const url = `/usuarios?email=${encodeURIComponent(emailInvalido)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-001 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.email).to.eq('email deve ser um email válido');
    });
  });

  it('CT-002 — [400] Filtro por administrador com valor fora do padrão (maybe) @negative', () => {
    // Arrange
    const administradorInvalido = 'maybe';
    const url = `/usuarios?administrador=${encodeURIComponent(administradorInvalido)}`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-002 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'");
    });
  });

  it('CT-003 — [200] Filtro por _id inexistente @negative', () => {
    // Arrange
    const idInexistente = 'ZZZnaoExiste123';
    const url = `/usuarios?_id=${encodeURIComponent(idInexistente)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-003 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(0);
      expect(res.body.usuarios).to.deep.eq([]);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-004 — [400] Query param não suportado (foo=bar) @negative', () => {
    // Arrange
    const url = `/usuarios?foo=bar`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-004 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.foo).to.eq('foo não é permitido');
    });
  });

  it('CT-005 — [200] Filtro por password inexistente @negative', () => {
    // Arrange
    const passwordInexistente = 'senha_que_nao_existe_123';
    const url = `/usuarios?password=${encodeURIComponent(passwordInexistente)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-005 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(0);
      expect(res.body.usuarios).to.deep.eq([]);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-006 — [200] Filtro por nome com caracteres especiais (regex-like) @negative', () => {
    // Arrange
    const nomeEspecial = '*{[]}?^$';
    const url = `/usuarios?nome=${encodeURIComponent(nomeEspecial)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-006 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-006 - Assunção: quantidade=0, observado: quantidade=${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(0);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-007 — [200] Combinação de filtros mutuamente excludentes (email ≠ nome) @negative', () => {
    // Arrange
    const usuarioA = testUsers.admin_user;
    const usuarioB = testUsers.regular_user;
    
    const url = `/usuarios?email=${encodeURIComponent(usuarioA.email)}&nome=${encodeURIComponent(usuarioB.nome)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-007 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-007 - Dados A: email=${usuarioA.email}, nome=${usuarioA.nome}`);
      cy.log(`CT-007 - Dados B: email=${usuarioB.email}, nome=${usuarioB.nome}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(0);
      expect(res.body.usuarios).to.deep.eq([]);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-008 — [200] Case sensitivity em nome (assunção) @negative', () => {
    // Arrange
    const usuario = testUsers.case_sensitive_user;
    const nomeLowercase = 'joão da silva qa';
    const url = `/usuarios?nome=${encodeURIComponent(nomeLowercase)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-008 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-008 - Nome original: ${usuario.nome}, Nome lowercase: ${nomeLowercase}`);
      cy.log(`CT-008 - Assunção: quantidade=0 ou 1, observado: quantidade=${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-009 — [200] Substring/partial match em nome (assunção) @negative', () => {
    // Arrange
    const usuario = testUsers.substring_test_user;
    const substring = 'Joaquina';
    const url = `/usuarios?nome=${encodeURIComponent(substring)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-009 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-009 - Nome completo: ${usuario.nome}, Substring: ${substring}`);
      cy.log(`CT-009 - Assunção: quantidade=0 ou ≥1, observado: quantidade=${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-010 — [400] GET com body inesperado @negative', () => {
    // Arrange
    const body = { "qualquer": "coisa" };
    const url = '/usuarios';

    // Act
    cy.request({ method: 'GET', url, body, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-010 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      // Body inesperado retorna erro HTML do Google, não JSON
    });
  });

  it('CT-011 — [200] Header Accept ausente @negative', () => {
    // Arrange
    const url = '/usuarios';

    // Act
    cy.request({ method: 'GET', url, headers: {} }).then((res) => {
      // Assert
      cy.log(`CT-011 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(200);
      expect(res.headers['content-type']).to.contain('application/json');
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-012 — [400] Query duplicada (parâmetros repetidos) @negative', () => {
    // Arrange
    const url = `/usuarios?email=x@qa.com&email=y@qa.com`;

    // Act
    cy.request({ method: 'GET', url, failOnStatusCode: false }).then((res) => {
      // Assert
      cy.log(`CT-012 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.email).to.eq('email deve ser uma string');
    });
  });

  it('CT-013 — [200] Espaços no valor do filtro (trim observado) @negative', () => {
    // Arrange
    const nomeOriginal = 'Carlos QA';
    const usuario = { ...fx.CT015_validAdminTrue, email: `carlos_${Date.now()}@example.com`, nome: nomeOriginal };
    
    // Criar usuário
    cy.request({ method: 'POST', url: '/usuarios', body: usuario });
    
    const nomeComEspacos = ' Carlos QA ';
    const url = `/usuarios?nome=${encodeURIComponent(nomeComEspacos)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-013 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-013 - Assunção: quantidade=0 ou 1, observado: quantidade=${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  //
  // =========================
  // POSITIVOS
  // =========================
  //

  it('CT-014 — [200] Listar todos (sem filtros) @positive @smoke', () => {
    // Arrange
    const url = '/usuarios';

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-014 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-014 - Quantidade: ${res.body.quantidade}, Usuários: ${res.body.usuarios.length}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.be.at.least(1);
      expect(res.body.usuarios).to.be.an('array');
      expect(res.body.usuarios.length).to.be.at.least(1);
      
      // Validar estrutura do primeiro usuário
      const primeiroUsuario = res.body.usuarios[0];
      expect(primeiroUsuario).to.have.all.keys('nome', 'email', 'password', 'administrador', '_id');
      expect(primeiroUsuario.administrador).to.be.oneOf(['true', 'false']);
      
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-015 — [200] Filtrar por _id (match exato) @positive', () => {
    // Arrange
    const usuario = { ...fx.CT015_validAdminTrue, email: `filtro_id_${Date.now()}@example.com` };
    
    // Criar usuário e capturar _id
    cy.request({ method: 'POST', url: '/usuarios', body: usuario }).then((createRes) => {
      const usuarioId = createRes.body._id;
      const url = `/usuarios?_id=${encodeURIComponent(usuarioId)}`;

      // Act
      cy.request({ method: 'GET', url }).then((res) => {
        // Assert
        cy.log(`CT-015 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
        cy.log(`CT-015 - ID buscado: ${usuarioId}, Quantidade: ${res.body.quantidade}`);
        expect(res.status).to.eq(200);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.quantidade).to.eq(1);
        expect(res.body.usuarios[0]._id).to.eq(usuarioId);
        validateSchema(res.body, getUsuariosSuccessSchema);
      });
    });
  });

  it('CT-016 — [200] Filtrar por email (match exato) @positive', () => {
    // Arrange
    const emailUnico = `filtro_email_${Date.now()}@example.com`;
    const usuario = { ...fx.CT015_validAdminTrue, email: emailUnico };
    
    // Criar usuário
    cy.request({ method: 'POST', url: '/usuarios', body: usuario });
    
    const url = `/usuarios?email=${encodeURIComponent(emailUnico)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-016 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-016 - Email buscado: ${emailUnico}, Quantidade: ${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(1);
      expect(res.body.usuarios[0].email).to.eq(emailUnico);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-017 — [200] Filtrar por nome (match exato observado) @positive', () => {
    // Arrange
    const nomeUnico = `Nome Unico ${Date.now()}`;
    const usuario = { ...fx.CT015_validAdminTrue, email: `nome_${Date.now()}@example.com`, nome: nomeUnico };
    
    // Criar usuário
    cy.request({ method: 'POST', url: '/usuarios', body: usuario });
    
    const url = `/usuarios?nome=${encodeURIComponent(nomeUnico)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-017 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-017 - Nome buscado: ${nomeUnico}, Quantidade: ${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(1);
      expect(res.body.usuarios[0].nome).to.eq(nomeUnico);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-018 — [200] Filtrar por administrador = "true" @positive', () => {
    // Arrange
    const url = `/usuarios?administrador=true`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-018 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-018 - Quantidade: ${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.be.at.least(1);
      
      // Verificar que todos são administradores
      res.body.usuarios.forEach(usuario => {
        expect(usuario.administrador).to.eq('true');
      });
      
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-019 — [200] Filtrar por administrador = "false" @positive', () => {
    // Arrange
    const url = `/usuarios?administrador=false`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-019 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-019 - Quantidade: ${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.be.at.least(1);
      
      // Verificar que todos não são administradores
      res.body.usuarios.forEach(usuario => {
        expect(usuario.administrador).to.eq('false');
      });
      
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-020 — [200] Filtrar por password (match exato) — cobertura de contrato @positive', () => {
    // Arrange
    const password = 'Teste@123';
    const usuario = { ...fx.CT015_validAdminTrue, email: `password_${Date.now()}@example.com`, password };
    
    // Criar usuário
    cy.request({ method: 'POST', url: '/usuarios', body: usuario });
    
    const url = `/usuarios?password=${encodeURIComponent(password)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-020 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-020 - Password buscado: ${password}, Quantidade: ${res.body.quantidade}`);
      cy.log(`CT-020 - RISCO: Filtro por password pode expor dados sensíveis`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.be.at.least(1);
      
      // Verificar que todos têm a senha especificada
      res.body.usuarios.forEach(usuario => {
        expect(usuario.password).to.eq(password);
      });
      
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-021 — [200] Combinação de filtros (_id + email + nome) @positive', () => {
    // Arrange
    const usuario = { ...fx.CT015_validAdminTrue, email: `combinado_${Date.now()}@example.com`, nome: `Combinado ${Date.now()}` };
    
    // Criar usuário e capturar dados
    cy.request({ method: 'POST', url: '/usuarios', body: usuario }).then((createRes) => {
      const usuarioId = createRes.body._id;
      const url = `/usuarios?_id=${encodeURIComponent(usuarioId)}&email=${encodeURIComponent(usuario.email)}&nome=${encodeURIComponent(usuario.nome)}`;

      // Act
      cy.request({ method: 'GET', url }).then((res) => {
        // Assert
        cy.log(`CT-021 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
        cy.log(`CT-021 - ID: ${usuarioId}, Email: ${usuario.email}, Nome: ${usuario.nome}`);
        cy.log(`CT-021 - Quantidade: ${res.body.quantidade}`);
        expect(res.status).to.eq(200);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.quantidade).to.eq(1);
        expect(res.body.usuarios[0]._id).to.eq(usuarioId);
        expect(res.body.usuarios[0].email).to.eq(usuario.email);
        expect(res.body.usuarios[0].nome).to.eq(usuario.nome);
        validateSchema(res.body, getUsuariosSuccessSchema);
      });
    });
  });

  it('CT-022 — [200] Vários resultados para nome (duplicidade) @positive', () => {
    // Arrange
    const usuario1 = testUsers.duplicate_name_user;
    const usuario2 = testUsers.duplicate_name_user2;
    const nomeDuplicado = usuario1.nome;
    
    const url = `/usuarios?nome=${encodeURIComponent(nomeDuplicado)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-022 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-022 - Nome duplicado: ${nomeDuplicado}, Quantidade: ${res.body.quantidade}`);
      cy.log(`CT-022 - Usuário 1: ${usuario1.email}, Usuário 2: ${usuario2.email}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.be.at.least(2);
      
      // Verificar que todos têm o nome especificado (pode ter timestamp adicionado)
      res.body.usuarios.forEach(usuario => {
        expect(usuario.nome).to.contain('Nome Duplicado');
      });
      
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });

  it('CT-023 — [200] Sem resultados — filtro válido que não encontra @positive', () => {
    // Arrange
    const emailInexistente = `nao.existe.${Date.now()}@uorak.com`;
    const url = `/usuarios?email=${encodeURIComponent(emailInexistente)}`;

    // Act
    cy.request({ method: 'GET', url }).then((res) => {
      // Assert
      cy.log(`CT-023 - URL: ${Cypress.config('baseUrl')}${url} | Status: ${res.status}`);
      cy.log(`CT-023 - Email inexistente: ${emailInexistente}, Quantidade: ${res.body.quantidade}`);
      expect(res.status).to.eq(200);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.quantidade).to.eq(0);
      expect(res.body.usuarios).to.deep.eq([]);
      validateSchema(res.body, getUsuariosSuccessSchema);
    });
  });
});
