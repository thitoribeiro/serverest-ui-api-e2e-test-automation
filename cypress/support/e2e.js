// Support file principal para testes E2E (UI e API)
// Este arquivo é carregado automaticamente pelo Cypress antes de cada teste
import '@shelex/cypress-allure-plugin';

// Importa helpers centralizados (usado pelos testes API)
// Os helpers são ES modules e são importados globalmente
import './api/helpers.js';

// Importa comandos customizados para testes UI
// O Cypress processa automaticamente o arquivo ui/index.js que carrega os comandos CommonJS
// Fazemos um import dinâmico para garantir que seja carregado quando necessário
import('./ui/index.js').catch(() => {
  // Se houver erro ao importar (comum quando é CommonJS), o Cypress tentará processar
  // os comandos através de seu sistema de módulos híbrido
  // Os comandos serão disponibilizados globalmente através de Cypress.Commands.add
});

// Configura labels do Allure baseado no tipo de teste (API ou UI)
// Isso permite separar visualmente os resultados no relatório
beforeEach(function() {
  const specPath = Cypress.spec.relative || Cypress.spec.name || '';
  
  // Detecta se é teste API ou UI baseado no caminho
  const isApiTest = specPath.includes('/api/') || specPath.includes('\\api\\');
  
  // Adiciona labels ao Allure para separar visualmente
  if (typeof Cypress !== 'undefined' && Cypress.Allure) {
    try {
      const allure = Cypress.Allure.reporter;
      
      if (isApiTest) {
        // Labels para testes API
        allure.epic('API Tests');
        allure.feature('API - ServeRest');
        allure.label('testType', 'API');
        allure.label('layer', 'api');
        allure.label('suite', 'API Tests');
        allure.label('package', 'api');
      } else {
        // Labels para testes UI
        allure.epic('UI Tests');
        allure.feature('UI - ServeRest Frontend');
        allure.label('testType', 'UI');
        allure.label('layer', 'ui');
        allure.label('suite', 'UI Tests');
        allure.label('package', 'ui');
      }
    } catch (e) {
      // Se houver erro ao adicionar labels, continua normalmente
      // Isso pode acontecer se o Allure não estiver completamente inicializado
    }
  }
});
