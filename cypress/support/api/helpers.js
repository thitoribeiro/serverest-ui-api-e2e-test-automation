// cypress/support/helpers.js
// Helpers centralizados para validações e utilitários comuns

import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

/**
 * Valida headers típicos de resposta JSON
 * @param {Object} headers - Headers da resposta HTTP
 */
export function assertTypicalJsonHeaders(headers) {
  expect(headers).to.have.property('content-type');
  expect(headers['content-type']).to.contain('application/json');
  expect(headers).to.have.property('x-content-type-options', 'nosniff');
  expect(headers).to.have.property('x-xss-protection', '1; mode=block');
  expect(headers).to.have.property('strict-transport-security');
  expect(headers['strict-transport-security']).to.contain('max-age=15552000');
}

/**
 * Valida schema JSON usando AJV
 * @param {Object} body - Corpo da resposta
 * @param {Object} schema - Schema JSON Schema
 * @throws {Error} Se a validação falhar
 */
export function validateSchema(body, schema) {
  const validate = ajv.compile(schema);
  if (!validate(body)) {
    throw new Error(`Schema validation failed:\n${JSON.stringify(validate.errors, null, 2)}\nBody:\n${JSON.stringify(body, null, 2)}`);
  }
}

/**
 * Gera email único com timestamp
 * @param {string} prefix - Prefixo do email (padrão: 'user')
 * @returns {string} Email único
 */
export function generateUniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}@serverest.dev`;
}

/**
 * Retorna instância do AJV para casos especiais
 * @returns {Ajv} Instância configurada do AJV
 */
export function getAjvInstance() {
  return ajv;
}

