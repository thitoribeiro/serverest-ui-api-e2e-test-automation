#!/usr/bin/env node

/**
 * Script para gerar relatórios Allure separados para testes API e UI
 * Usa os labels/suites adicionados automaticamente aos testes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ALLURE_RESULTS = 'allure-results';
const REPORTS_DIR = path.join(__dirname, '..');

function filterResultsBySuite(suitePattern, outputDir) {
  if (!fs.existsSync(ALLURE_RESULTS)) {
    console.error(`❌ Diretório ${ALLURE_RESULTS} não encontrado!`);
    process.exit(1);
  }

  // Lê todos os arquivos de resultado do Allure e ordena por data de modificação (mais recentes primeiro)
  const resultFiles = fs.readdirSync(ALLURE_RESULTS)
    .filter(f => f.endsWith('-result.json'))
    .map(file => ({
      name: file,
      path: path.join(ALLURE_RESULTS, file),
      mtime: fs.statSync(path.join(ALLURE_RESULTS, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime); // Mais recentes primeiro
  
  const filteredResults = [];
  
  resultFiles.forEach(fileInfo => {
    try {
      const content = JSON.parse(fs.readFileSync(fileInfo.path, 'utf8'));
      
      // Verifica se o teste pertence à suite desejada
      const labels = content.labels || [];
      const suites = labels.filter(l => l.name === 'suite');
      const epic = labels.find(l => l.name === 'epic');
      const testType = labels.find(l => l.name === 'testType');
      const layer = labels.find(l => l.name === 'layer');
      const packageLabel = labels.find(l => l.name === 'package');
      
      // Verifica também pelo caminho do spec para detectar UI/API
      const fullName = content.fullName || content.historyId || '';
      const specPath = fullName.includes('/ui/') || fullName.includes('\\ui\\');
      const apiPath = fullName.includes('/api/') || fullName.includes('\\api\\');
      
      // Múltiplas formas de detecção para garantir que pegue todos os testes
      let isMatch = false;
      
      if (suitePattern.toUpperCase() === 'UI') {
        isMatch = 
          suites.some(s => s.value && s.value.match(/UI/i)) ||
          (epic && epic.value && epic.value.match(/UI/i)) ||
          (testType && testType.value && testType.value.match(/UI/i)) ||
          (layer && layer.value && layer.value === 'ui') ||
          (packageLabel && packageLabel.value && packageLabel.value === 'ui') ||
          specPath;
      } else if (suitePattern.toUpperCase() === 'API') {
        isMatch = 
          suites.some(s => s.value && s.value.match(/API/i)) ||
          (epic && epic.value && epic.value.match(/API/i)) ||
          (testType && testType.value && testType.value.match(/API/i)) ||
          (layer && layer.value && layer.value === 'api') ||
          (packageLabel && packageLabel.value && packageLabel.value === 'api') ||
          apiPath;
      }
      
      if (isMatch) {
        filteredResults.push(content);
      }
    } catch (e) {
      // Ignora arquivos inválidos
    }
  });
  
  if (filteredResults.length === 0) {
    console.warn(`⚠️  Nenhum resultado encontrado para o padrão: ${suitePattern}`);
    return;
  }
  
  // Se há muitos resultados, pega apenas os mais recentes (últimos 30 minutos)
  // Isso garante que apenas os testes da última execução sejam incluídos
  const now = Date.now();
  const thirtyMinutesAgo = now - (30 * 60 * 1000);
  
  const recentResults = filteredResults.filter(result => {
    // Verifica o timestamp do teste ou usa apenas os mais recentes
    const startTime = result.start || result.time?.start || 0;
    return startTime > thirtyMinutesAgo || startTime === 0; // Se não tem timestamp, inclui
  });
  
  // Se ainda há muitos resultados, limita aos mais recentes 100
  const finalResults = recentResults.length > 100 ? recentResults.slice(0, 100) : recentResults;
  
  console.log(`📋 Encontrados ${filteredResults.length} resultados totais, usando ${finalResults.length} mais recentes`);
  
  // Cria diretório temporário para resultados filtrados
  const tempDir = path.join(REPORTS_DIR, `${ALLURE_RESULTS}-temp-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Copia apenas os resultados filtrados
  let index = 0;
  finalResults.forEach(result => {
    const newFileName = `${index++}-result.json`;
    fs.writeFileSync(
      path.join(tempDir, newFileName),
      JSON.stringify(result, null, 2)
    );
  });
  
  // Gera relatório
  try {
    execSync(`allure generate "${tempDir}" --clean -o "${outputDir}"`, {
      stdio: 'inherit',
      cwd: REPORTS_DIR
    });
    console.log(`✅ Relatório gerado em: ${outputDir}`);
  } catch (e) {
    console.error(`❌ Erro ao gerar relatório: ${e.message}`);
  } finally {
    // Remove diretório temporário
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'api') {
  console.log('📊 Gerando relatório para testes API...');
  filterResultsBySuite('API', path.join(REPORTS_DIR, 'allure-report-api'));
} else if (command === 'ui') {
  console.log('📊 Gerando relatório para testes UI...');
  filterResultsBySuite('UI', path.join(REPORTS_DIR, 'allure-report-ui'));
} else {
  console.log(`
Uso: node scripts/generate-separated-reports.js [api|ui]

Exemplos:
  node scripts/generate-separated-reports.js api   # Gera relatório apenas de testes API
  node scripts/generate-separated-reports.js ui    # Gera relatório apenas de testes UI
  `);
  process.exit(1);
}
