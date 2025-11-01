/**
 * @file userPayload.js
 * Gera dados de usuário únicos a cada execução.
 * Clean Code: imutabilidade, sem dependências externas.
 */

function generateUniqueId() {
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function buildUser({ admin = false } = {}) {
  const uniqueId = generateUniqueId();
  return {
    name: `QA User ${uniqueId}`,
    email: `qa_user_${uniqueId}@uorak.com`,
    password: 'Teste@123',
    admin: admin,
    // Mantido para compatibilidade com spec público
    acceptTerms: admin
  };
}

module.exports = { buildUser };
