// cypress.config.js
const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
require('dotenv').config(); // carrega .env na inicialização

module.exports = defineConfig({
  e2e: {
    // Base URL será configurada dinamicamente baseado no tipo de teste (UI ou API)
    // Padrão: UI frontend
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://front.serverest.dev',
    // Support file principal - funciona para testes UI e API
    // Para testes UI, os comandos CommonJS são carregados via index.js que é importado no e2e.js
    supportFile: 'cypress/support/e2e.js',
    // Cypress também processa arquivos em supportFile diretórios automaticamente
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    env: {
      allure: true,
      allureReuseAfterSpec: true,
      // URLs para diferentes ambientes
      API_BASE_URL: process.env.CYPRESS_API_BASE_URL || 'https://serverest.dev',
      UI_BASE_URL: process.env.CYPRESS_UI_BASE_URL || 'https://front.serverest.dev'
    },

    setupNodeEvents(on, config) {
      // Configuração do Allure
      allureWriter(on, config);

      // Garante que comandos CommonJS sejam carregados para testes UI
      // Carrega commands.js através do sistema de módulos do Node.js
      if (typeof require !== 'undefined') {
        try {
          const commandsPath = require('path').join(__dirname, 'cypress', 'support', 'ui', 'commands.js');
          require(commandsPath);
        } catch (e) {
          // Ignora se não conseguir carregar (pode ser carregado de outra forma)
        }
      }

      // Detecta se o teste é API baseado em variável de ambiente ou specPattern
      const testType = process.env.CYPRESS_TEST_TYPE;
      const specPattern = config.specPattern || '';
      const specFile = config.spec || '';
      
      const isApiTest = testType === 'api' || 
                       specPattern.includes('/api/') ||
                       specFile.includes('/api/');
      
      // Configura baseUrl dinamicamente
      if (isApiTest) {
        config.baseUrl = config.env.API_BASE_URL;
        console.log(`[Cypress Config] Testes API detectados. BaseURL: ${config.baseUrl}`);
        // Para testes API, desabilita vídeos por padrão (mais rápido)
        if (process.env.CYPRESS_API_VIDEO !== 'true') {
          config.video = false;
        }
      } else {
        config.baseUrl = config.env.UI_BASE_URL;
        console.log(`[Cypress Config] Testes UI detectados. BaseURL: ${config.baseUrl}`);
      }

      // Prioriza o que já existir em config.env, senão lê do .env / process.env
      config.env = {
        ...config.env,
        LOGIN_EMAIL:    config.env.LOGIN_EMAIL    || process.env.CYPRESS_LOGIN_EMAIL || '',
        LOGIN_PASSWORD: config.env.LOGIN_PASSWORD || process.env.CYPRESS_LOGIN_PASSWORD || '',
        LOGIN_NAME:     config.env.LOGIN_NAME     || process.env.CYPRESS_LOGIN_NAME || ''
      };

      const missing = [];
      // Só exige login para testes UI
      if (!isApiTest && !config.env.LOGIN_EMAIL) {
        missing.push('CYPRESS_LOGIN_EMAIL');
      }
      if (!isApiTest && !config.env.LOGIN_PASSWORD) {
        missing.push('CYPRESS_LOGIN_PASSWORD');
      }
      if (missing.length) {
        console.warn(`[cypress.config] Atenção: defina no .env -> ${missing.join(', ')}`);
      }

      // Remove vídeos de testes que passaram (economiza espaço)
      on('after:spec', (spec, results) => {
        if (results && results.stats && results.stats.failures === 0 && results.video) {
          try {
            if (fs.existsSync(results.video)) fs.unlinkSync(results.video);
          } catch (_) {
          }
        }
      });

      // Adiciona labels Allure baseado no tipo de teste (API ou UI)
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        allureLabel({ name, value }) {
          // Permite adicionar labels customizados via task
          return null;
        }
      });

      // Hook para adicionar informações de suite antes de cada spec
      on('before:spec', (spec) => {
        const specPath = spec.relativePath || spec.absolute || '';
        const isApi = specPath.includes('/api/') || specPath.includes('\\api\\');
        
        // Adiciona informação ao ambiente do Cypress para usar nos testes
        config.env.TEST_CATEGORY = isApi ? 'api' : 'ui';
        config.env.TEST_SUITE = isApi ? 'API Tests' : 'UI Tests';
      });

      return config;
    }
  }
});
