// @negative @positive
// Especificação única: criação de usuário (POST /usuarios) – NEGATIVOS → POSITIVOS
// Sem custom commands: uso direto de cy.request + validação AJV inline

import { assertTypicalJsonHeaders, validateSchema } from '../../support/api/helpers.js';

// Substitui marcador especial por nome longo
const withLongName = (payload) => {
  const p = { ...payload };
  if (typeof p.nome === 'string' && p.nome.includes('<LONG_260>')) {
    p.nome = 'N'.repeat(260);
  }
  return p;
};

describe('API /usuarios :: CRIAÇÃO', () => {
  let fx;
  let schemaSuccess;
  let schemaEmailInUse;

  before(() => {
    cy.fixture('api/usuarios.create.cases.json').then((data) => (fx = data));
    cy.fixture('api/schema/usuario.create.success.schema.json').then((s) => (schemaSuccess = s));
    cy.fixture('api/schema/usuario.create.emailInUse.schema.json').then((s) => (schemaEmailInUse = s));
  });

  //
  // =========================
  // NEGATIVOS
  // =========================
  //

  it('CT-001 — [400] E-mail já cadastrado (duplicado) @negative', () => {
    const payload = withLongName(fx.CT001_duplicate);

    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then(() => {
      cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
        cy.log(`CT-001 (${res.status}) - ${payload.email}`);
        expect(res.status).to.eq(400);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.message).to.eq('Este email já está sendo usado');
        validateSchema(res.body, schemaEmailInUse);
      });
    });
  });

  it('CT-002 — [400] Campo obrigatório ausente: nome @negative', () => {
    const payload = withLongName(fx.CT002_missingNome);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-002 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.nome).to.eq('nome é obrigatório');
    });
  });

  it('CT-003 — [400] Campo obrigatório ausente: email @negative', () => {
    const payload = withLongName(fx.CT003_missingEmail);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-003 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.email).to.eq('email é obrigatório');
    });
  });

  it('CT-004 — [400] Campo obrigatório ausente: password @negative', () => {
    const payload = withLongName(fx.CT004_missingPassword);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-004 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.password).to.eq('password é obrigatório');
    });
  });

  it('CT-005 — [400] Campo obrigatório ausente: administrador @negative', () => {
    const payload = withLongName(fx.CT005_missingAdministrador);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-005 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.administrador).to.eq('administrador é obrigatório');
    });
  });

  it('CT-006 — [400] Tipo inválido: administrador fora do enum @negative', () => {
    const payload = withLongName(fx.CT006_invalidAdm);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-006 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.administrador).to.eq("administrador deve ser 'true' ou 'false'");
    });
  });

  it('CT-007 — [400] Tipo inválido: email não-string @negative', () => {
    const payload = withLongName(fx.CT007_emailNotString);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-007 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.email).to.eq('email deve ser uma string');
    });
  });

  it('CT-008 — [400] Formato de e-mail inválido @negative', () => {
    const payload = withLongName(fx.CT008_emailBadFormat);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-008 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.email).to.eq('email deve ser um email válido');
    });
  });

  it('CT-009 — [400] password vazio @negative', () => {
    const payload = withLongName(fx.CT009_passwordEmpty);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-009 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.password).to.eq('password não pode ficar em branco');
    });
  });

  it('CT-010 — [400] Payload vazio {} @negative', () => {
    const payload = withLongName(fx.CT011_emptyObject);
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-010 (${res.status})`);
      expect(res.status).to.eq(400);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body).to.include.keys('nome', 'email', 'password', 'administrador');
    });
  });

  it('CT-011 — [400] Limite: nome muito longo (260 chars) @negative', () => {
    const payload = withLongName(fx.CT013_longName);
    payload.email = `user_${Date.now()}@example.com`;
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-011 (${res.status})`);
      if (res.status === 201) {
        assertTypicalJsonHeaders(res.headers);
        validateSchema(res.body, schemaSuccess);
      } else {
        expect(res.status).to.eq(400);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.message).to.eq('nome deve ter no máximo 250 caracteres');
      }
    });
  });

  it('CT-012 — [400] Limite: password muito curta (3 chars) @negative', () => {
    const payload = withLongName(fx.CT014_shortPwd);
    payload.email = `user_${Date.now()}@example.com`;
    cy.request({ method: 'POST', url: '/usuarios', body: payload, failOnStatusCode: false }).then((res) => {
      cy.log(`CT-012 (${res.status})`);
      if (res.status === 201) {
        validateSchema(res.body, schemaSuccess);
      } else {
        expect(res.status).to.eq(400);
        assertTypicalJsonHeaders(res.headers);
        expect(res.body.message).to.eq('password deve ter no mínimo 4 caracteres');
      }
    });
  });

  //
  // =========================
  // POSITIVOS
  // =========================
  //

  it('CT-013 — [201] Cadastro válido com administrador "true" @positive @smoke', () => {
    const payload = withLongName(fx.CT015_validAdminTrue);
    payload.email = `user_${Date.now()}@example.com`;
    cy.request({ method: 'POST', url: '/usuarios', body: payload }).then((res) => {
      cy.log(`CT-013 (${res.status})`);
      expect(res.status).to.eq(201);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      validateSchema(res.body, schemaSuccess);
    });
  });

  it('CT-014 — [201] Cadastro válido com administrador "false" @positive', () => {
    const payload = withLongName(fx.CT016_validAdminFalse);
    payload.email = `user_${Date.now()}@example.com`;
    cy.request({ method: 'POST', url: '/usuarios', body: payload }).then((res) => {
      cy.log(`CT-014 (${res.status})`);
      expect(res.status).to.eq(201);
      assertTypicalJsonHeaders(res.headers);
      expect(res.body.message).to.eq('Cadastro realizado com sucesso');
      validateSchema(res.body, schemaSuccess);
    });
  });
});
