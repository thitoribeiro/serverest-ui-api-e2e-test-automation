// Helper para adicionar labels e suites no Allure
// Permite separar resultados de testes API e UI

/**
 * Adiciona labels ao teste atual no Allure baseado no tipo (API ou UI)
 * @param {string} testType - 'api' ou 'ui'
 */
export function addAllureLabels(testType) {
  if (typeof Cypress !== 'undefined' && Cypress.Allure) {
    const allure = Cypress.Allure.reporter;
    
    if (allure && allure.getInterface) {
      const allureInterface = allure.getInterface();
      
      // Adiciona label para tipo de teste
      if (allureInterface) {
        // Usa suite para categorizar
        if (testType === 'api') {
          allureInterface.epic('API Tests');
          allureInterface.feature('API - ServeRest');
          allureInterface.story('API Endpoints');
        } else if (testType === 'ui') {
          allureInterface.epic('UI Tests');
          allureInterface.feature('UI - ServeRest Frontend');
          allureInterface.story('UI E2E Tests');
        }
      }
    }
  }
}

/**
 * Detecta o tipo de teste baseado no caminho do spec
 * @param {string} specPath - Caminho do arquivo de teste
 * @returns {string} 'api' ou 'ui'
 */
export function detectTestType(specPath) {
  if (!specPath) return 'ui';
  
  // Se contém /api/, é teste de API
  if (specPath.includes('/api/') || specPath.includes('\\api\\')) {
    return 'api';
  }
  
  // Se contém /ui/, é teste de UI
  if (specPath.includes('/ui/') || specPath.includes('\\ui\\')) {
    return 'ui';
  }
  
  // Padrão é UI
  return 'ui';
}
