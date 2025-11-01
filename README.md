# 🚀 ServeRest UI & API Test Automation

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Cypress](https://img.shields.io/badge/Cypress-13.7.0-blue.svg)](https://www.cypress.io/)
[![JavaScript](https://img.shields.io/badge/JavaScript-CommonJS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Projeto completo de automação de testes **UI (Interface Web)** e **API (Backend)** para o [ServeRest](https://serverest.dev) utilizando Cypress, seguindo as melhores práticas de engenharia de qualidade de software e Clean Code.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Objetivos](#-objetivos)
- [Ferramentas e Tecnologias](#-ferramentas-e-tecnologias)
- [Arquitetura e Estrutura](#-arquitetura-e-estrutura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando os Testes](#-executando-os-testes)
- [Arquivos Auxiliares e Dependências](#-arquivos-auxiliares-e-dependências)
- [Cobertura de Testes](#-cobertura-de-testes)
- [Relatórios](#-relatórios)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Sobre o Projeto

Este projeto implementa uma suíte completa de testes automatizados para o **ServeRest**, cobrindo tanto a interface web quanto a API REST:

### Testes de UI (Interface Web)
- ✅ **Cobertura de funcionalidades**: Login, Cadastro público e Cadastro autenticado
- ✅ **Testes negativos e positivos**: Validação de casos de erro e sucesso
- ✅ **Seletores estáveis**: Priorização de `data-testid` e `id` para maior confiabilidade
- ✅ **Multi-browser**: Suporte para Chrome, Firefox e Electron

### Testes de API (Backend REST)
- ✅ **Cobertura completa de endpoints**: POST, GET, GET by ID, DELETE
- ✅ **Validação de contratos**: JSON Schema validation com Ajv
- ✅ **Testes de negativos e positivos**: Cobertura completa de cenários
- ✅ **Isolamento de dados**: Geração dinâmica de dados únicos

### Recursos Gerais
- ✅ **Isolamento de dados**: Fixtures e geração dinâmica de dados únicos
- ✅ **Relatórios detalhados**: Allure Reports para análise e rastreabilidade
- ✅ **Clean Code**: Código limpo, organizado e fácil de manter
- ✅ **Configuração unificada**: Base URL dinâmica baseada no tipo de teste

---

## 🎯 Objetivos

### Principais

1. **Qualidade e Confiabilidade**: Garantir que tanto a UI quanto a API funcionem conforme esperado
2. **Validação de Funcionalidades**: Testar fluxos completos de usuário (UI) e contratos de API (Backend)
3. **Cobertura de Cenários**: Testar tanto casos de sucesso quanto casos de erro (negativos)
4. **Manutenibilidade**: Código limpo, organizado e fácil de manter seguindo Clean Code
5. **Rastreabilidade**: Relatórios detalhados para análise de resultados

### Técnicos

- Implementar padrão **Element Mapping + Custom Commands** para testes UI
- Centralizar helpers e comandos customizados
- Eliminar duplicação de código (princípio DRY)
- Priorizar seletores estáveis (`data-testid` e `id`) em testes UI
- Validação de contratos JSON Schema em testes API
- Garantir execução rápida e estável dos testes
- Facilitar onboarding de novos membros do time

---

## 🛠 Ferramentas e Tecnologias

### Core

| Ferramenta | Versão | Propósito |
|------------|--------|-----------|
| [Node.js](https://nodejs.org/) | ≥18 | Runtime JavaScript |
| [Cypress](https://www.cypress.io/) | 13.7.0 | Framework de automação de testes E2E (UI + API) |
| [JavaScript (CommonJS)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) | ES6+ | Linguagem de programação |

### Relatórios e Plugins

| Ferramenta | Versão | Propósito |
|------------|--------|-----------|
| [Allure Report](https://docs.qameta.io/allure/) | 2.34.1 | Geração de relatórios detalhados |
| [@shelex/cypress-allure-plugin](https://github.com/Shelex/cypress-allure-plugin) | 2.41.2 | Integração Allure com Cypress |
| [dotenv](https://www.npmjs.com/package/dotenv) | 17.2.3 | Gerenciamento de variáveis de ambiente |
| [ajv](https://www.npmjs.com/package/ajv) | 8.17.1 | Validação de JSON Schema (API tests) |

### Browsers Suportados (Testes UI)

- **Chrome**: Suporte completo (headless e headed)
- **Firefox**: Suporte completo (headless e headed)
- **Electron**: Browser padrão, incluído no Cypress

---

## 📁 Arquitetura e Estrutura

### Estrutura de Diretórios

```
serverest-ui-api-e2e-test-automation/
│
├── cypress/                          # Diretório principal do Cypress
│   ├── e2e/                         # Testes end-to-end
│   │   ├── api/                     # Testes de API REST
│   │   │   ├── 1-post.usuarios.spec.cy.js       # Testes POST /usuarios
│   │   │   ├── 2-get.usuarios.spec.cy.js        # Testes GET /usuarios
│   │   │   ├── 3-get.usuario.byid.spec.cy.js   # Testes GET /usuarios/:id
│   │   │   └── 4-delete.usuarios.spec.cy.js    # Testes DELETE /usuarios/:id
│   │   │
│   │   └── ui/                      # Testes de Interface Web
│   │       ├── 1-cadastro.cy.js                  # Testes de cadastro público
│   │       ├── 2-login.cy.js                     # Testes de login
│   │       └── 3-cadastro-usuario-auth.cy.js    # Testes de cadastro autenticado
│   │
│   ├── fixtures/                    # Dados de teste
│   │   ├── api/                     # Fixtures para testes de API
│   │   │   ├── usuarios.create.cases.json
│   │   │   ├── usuarios.test.data.json
│   │   │   └── schema/              # JSON Schemas para validação
│   │   │       ├── usuario.create.success.schema.json
│   │   │       └── usuario.create.emailInUse.schema.json
│   │   └── ui/                      # Fixtures para testes de UI
│   │       ├── messages.json        # Mensagens de validação
│   │       └── testData.json       # Dados de teste configuráveis
│   │
│   ├── support/                      # Helpers e configurações
│   │   ├── e2e.js                   # Configuração global (Allure, helpers)
│   │   ├── api/                     # Arquivos específicos para testes de API
│   │   │   ├── helpers.js           # Validações e utilitários (ES Module)
│   │   │   └── setup.usuarios.js    # Setup de dados para testes API
│   │   └── ui/                      # Arquivos específicos para testes de UI
│   │       ├── commands.js          # Comandos customizados para UI (CommonJS)
│   │       ├── index.js             # Carrega comandos e Allure para UI
│   │       ├── elements/              # Element Mapping (mapeamento de elementos UI)
│   │       │   ├── cadastroPublicoElements.js
│   │       │   ├── cadastroAuthElements.js
│   │       │   ├── loginElements.js
│   │       │   ├── homeElements.js
│   │       │   └── listUsersElements.js
│   │       └── utils/               # Utilitários
│   │           └── userPayload.js   # Geração de dados de usuário únicos
│   │
│   ├── screenshots/                 # Screenshots (apenas falhas)
│   └── videos/                      # Vídeos (apenas falhas)
│
├── scripts/                          # Scripts auxiliares
│   └── generate-separated-reports.js  # Geração de relatórios separados
│
├── allure-results/                  # Resultados brutos do Allure
├── allure-report/                   # Relatório HTML gerado
│
├── cypress.config.js                # Configuração unificada do Cypress
├── package.json                     # Dependências e scripts npm
├── .env                             # Variáveis de ambiente (não versionado)
├── .env.example                     # Exemplo de variáveis de ambiente
├── .gitignore                       # Arquivos ignorados pelo Git
└── README.md                        # Este arquivo
```

### Organização dos Testes

#### Testes de API
Os testes API seguem uma nomenclatura numérica para garantir ordem de execução:
- `1-post.usuarios.spec.cy.js` - Testes de criação de usuários (14 testes)
- `2-get.usuarios.spec.cy.js` - Testes de listagem de usuários (23 testes)
- `3-get.usuario.byid.spec.cy.js` - Testes de busca por ID (12 testes)
- `4-delete.usuarios.spec.cy.js` - Testes de exclusão de usuários (5 testes)

**Total: 54 testes de API**

#### Testes de UI
Os testes UI também seguem nomenclatura numérica:
- `1-cadastro.cy.js` - Testes de cadastro público (5 testes)
- `2-login.cy.js` - Testes de login (6 testes)
- `3-cadastro-usuario-auth.cy.js` - Testes de cadastro autenticado (5 testes)

**Total: 16 testes de UI**

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js) ou **yarn**
- **Git** ([Download](https://git-scm.com/))
- **Allure Commandline** (opcional, para relatórios) - instalado via npm

### Verificar instalações

```bash
node --version  # Deve retornar v18.x ou superior
npm --version   # Deve retornar 9.x ou superior
git --version   # Qualquer versão recente
```

---

## 📥 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/thitoribeiro/serverest-ui-e2e-test-automation.git
cd serverest-ui-api-e2e-test-automation
```

### 2. Instale as dependências

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`:
- Cypress
- Allure plugins
- dotenv
- ajv (validação JSON Schema)
- Outras dependências de desenvolvimento

### 3. Verifique a instalação

```bash
npx cypress verify
```

Você deve ver uma mensagem de sucesso confirmando que o Cypress está instalado corretamente.

---

## ⚙️ Configuração

### Variáveis de Ambiente

**Importante**: O projeto usa um único arquivo `.env` para ambos os tipos de teste (API e UI). As variáveis são carregadas automaticamente e cada tipo de teste usa apenas o que precisa.

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

**Variáveis obrigatórias apenas para Testes UI:**
```env
CYPRESS_LOGIN_EMAIL=seu-email@exemplo.com
CYPRESS_LOGIN_PASSWORD=sua-senha
CYPRESS_LOGIN_NAME=Seu Nome (opcional)
```

**Variáveis opcionais (valores padrão já configurados para ambos):**
```env
CYPRESS_API_BASE_URL=https://serverest.dev
CYPRESS_UI_BASE_URL=https://front.serverest.dev
```

**Como funciona:**
- ✅ **Um único arquivo `.env`** serve tanto para testes de API quanto para testes de UI
- ✅ **Testes de API**: Não precisam das credenciais (`CYPRESS_LOGIN_EMAIL` e `CYPRESS_LOGIN_PASSWORD`), usam apenas `CYPRESS_API_BASE_URL`
- ✅ **Testes de UI**: Requerem as credenciais acima para testes autenticados, usam `CYPRESS_UI_BASE_URL`
- ✅ **Detecção automática**: O Cypress detecta automaticamente o tipo de teste (API ou UI) pelo caminho do arquivo
- ✅ **Proteção**: O arquivo `.env` não é versionado (está no `.gitignore`) para proteger informações sensíveis
- ✅ **URLs padrão**: As URLs têm valores padrão e funcionam sem configuração, mas podem ser sobrescritas no `.env` se necessário

### Configuração do Cypress

O arquivo `cypress.config.js` está configurado com:

- ✅ **Base URL dinâmica**: Define automaticamente baseado no tipo de teste (UI ou API)
- ✅ **Viewport**: 1366x768 (para testes UI)
- ✅ **Screenshots**: Apenas em falhas
- ✅ **Vídeos**: Desabilitados para testes API, apenas falhas para UI
- ✅ **Timeouts**: 10000ms (padrão, request e response)
- ✅ **Integração com Allure Reports**: Configuração automática de labels por tipo de teste
- ✅ **Carregamento automático de variáveis de ambiente**: Via dotenv

---

## 🚀 Executando os Testes

### Scripts Principais

#### Testes de API

```bash
# Executa todos os testes de API
npm run api:all
```

Este comando:
1. Limpa resultados anteriores do Allure
2. Executa todos os testes de API no Chrome (headless)
3. Gera o relatório Allure
4. Abre o relatório automaticamente no navegador

**Resultado esperado**: 54 testes passando

#### Testes de UI

```bash
# Chrome (headless) - Recomendado para CI/CD
npm run ui:chrome:headless

# Chrome (headed) - Com interface visual
npm run ui:chrome:headed

# Firefox (headless)
npm run ui:firefox:headless

# Firefox (headed)
npm run ui:firefox:headed
```

Todos os comandos UI fazem:
1. Limpam resultados anteriores do Allure
2. Executam todos os testes de UI no browser especificado
3. Geram o relatório Allure
4. Abrem o relatório automaticamente no navegador

**Resultado esperado**: 16 testes passando

### Scripts Auxiliares

```bash
# Limpar resultados do Allure
npm run allure:clean

# Gerar relatório (após execução manual de testes)
npm run allure:report

# Abrir relatório no navegador
npm run allure:open

# Abrir Cypress GUI (modo interativo)
npm run cy:open
```

### Modo Interativo (Cypress UI)

Para debug e desenvolvimento:

```bash
# Abre interface gráfica do Cypress
npm run cy:open
```

> **Nota**: No modo interativo, você pode selecionar testes individuais, ver logs detalhados e fazer debug passo a passo.

---

## 📂 Arquivos Auxiliares e Dependências

### Arquivos de Suporte para Testes de API

**Localização**: `cypress/support/api/`

- **`helpers.js`** (ES Module): Funções utilitárias para validação
  - `assertTypicalJsonHeaders(headers)` - Valida headers HTTP
  - `validateSchema(body, schema)` - Valida estrutura JSON usando AJV
  - `generateUniqueEmail(prefix)` - Gera emails únicos
  - `getAjvInstance()` - Retorna instância do AJV

- **`setup.usuarios.js`** (ES Module): Setup de dados para testes
  - `createTestUser(userData)` - Cria usuário de teste via API
  - `createMultipleTestUsers(usersData)` - Cria múltiplos usuários
  - `cleanupTestUsers(userIds)` - Remove usuários criados

**Uso nos testes**:
```javascript
import { assertTypicalJsonHeaders, validateSchema } from '../../support/api/helpers.js';
import { createTestUser } from '../../support/api/setup.usuarios.js';
```

### Arquivos de Suporte para Testes de UI

**Localização**: `cypress/support/ui/`

- **`commands.js`** (CommonJS): Comandos customizados do Cypress
  - `cy.visitCadastro()` - Navega para página de cadastro
  - `cy.preencherCadastro(user)` - Preenche formulário de cadastro
  - `cy.submeterCadastro()` - Submete formulário
  - `cy.assertToast(text)` - Valida mensagem toast
  - `cy.fecharToast()` - Fecha mensagem toast
  - `cy.loginUI()` - Faz login automatizado

- **`elements/*.js`** (CommonJS): Mapeamento de seletores CSS
  - `cadastroPublicoElements.js` - Seletores da página de cadastro público
  - `cadastroAuthElements.js` - Seletores da página de cadastro autenticado
  - `loginElements.js` - Seletores da página de login
  - `homeElements.js` - Seletores da página home
  - `listUsersElements.js` - Seletores da listagem de usuários

- **`utils/userPayload.js`** (CommonJS): Geração de dados únicos
  - `buildUser({ admin })` - Gera objeto de usuário com email único

**Uso nos testes**:
```javascript
const elements = require('../../support/ui/elements/loginElements');
const { buildUser } = require('../../support/ui/utils/userPayload');
```

### Fixtures

**API** (`cypress/fixtures/api/`):
- `usuarios.create.cases.json` - Payloads para criação de usuários
- `usuarios.test.data.json` - Dados de usuários de teste
- `schema/*.json` - JSON Schemas para validação de contratos

**UI** (`cypress/fixtures/ui/`):
- `messages.json` - Mensagens de validação e feedback
- `testData.json` - Dados estáticos de teste

**Uso nos testes**:
```javascript
// API
cy.fixture('api/usuarios.create.cases.json').then((data) => { ... });

// UI
const messages = require('../../fixtures/ui/messages.json');
```

### Arquivos Compartilhados

- **`cypress/support/e2e.js`**: Configuração global carregada automaticamente
  - Importa plugin Allure
  - Importa helpers de API e comandos de UI
  - Configura labels do Allure baseado no tipo de teste

---

## 📊 Cobertura de Testes

### Testes de API

| Spec | Endpoint | Testes Positivos | Testes Negativos | Total |
|------|----------|------------------|------------------|-------|
| `1-post.usuarios.spec.cy.js` | POST /usuarios | 2 | 12 | 14 |
| `2-get.usuarios.spec.cy.js` | GET /usuarios | 9 | 14 | 23 |
| `3-get.usuario.byid.spec.cy.js` | GET /usuarios/:id | 4 | 8 | 12 |
| `4-delete.usuarios.spec.cy.js` | DELETE /usuarios/:id | 4 | 1 | 5 |
| **TOTAL API** | - | **19** | **35** | **54** |

### Testes de UI

| Spec | Funcionalidade | Testes Positivos | Testes Negativos | Total |
|------|----------------|------------------|------------------|-------|
| `1-cadastro.cy.js` | Cadastro público | 1 | 4 | 5 |
| `2-login.cy.js` | Login | 1 | 5 | 6 |
| `3-cadastro-usuario-auth.cy.js` | Cadastro autenticado | 1 | 4 | 5 |
| **TOTAL UI** | - | **3** | **13** | **16** |

### Total Geral

**70 testes** (54 API + 16 UI)

---

## 📈 Relatórios

### Allure Reports

Após cada execução, o relatório Allure é gerado e aberto automaticamente no navegador.

#### O que você encontra no relatório:

- 📊 **Dashboard**: Visão geral dos testes executados
- ✅ **Resultados detalhados**: Status de cada teste
- ⏱️ **Métricas de tempo**: Duração de execução
- 📝 **Logs**: Logs detalhados de cada passo
- 📸 **Evidências**: Screenshots e dados capturados
- 📉 **Tendências**: Histórico de execuções
- 🏷️ **Labels**: Categorização automática por tipo (API/UI)

#### Estrutura do Relatório

Os testes são automaticamente categorizados no Allure:
- **API Tests**: Todos os testes de API REST
- **UI Tests**: Todos os testes de interface web

### Screenshots e Vídeos

- **Screenshots**: Gerados automaticamente em `cypress/screenshots/` apenas quando há falhas (testes UI)
- **Vídeos**: Desabilitados para testes API. Para testes UI, gerados apenas quando há falhas (vídeos de sucesso são deletados automaticamente)

---

## 🔧 Troubleshooting

### Problema: Testes falhando com timeout

**Solução**: Verifique se a aplicação está acessível:

```bash
# Para testes UI
curl https://front.serverest.dev

# Para testes API
curl https://serverest.dev
```

### Problema: Allure não abre automaticamente

**Solução**: Abra manualmente:

```bash
npm run allure:open
```

### Problema: Erro ao instalar dependências

**Solução**: Limpe o cache e reinstale:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: Variáveis de ambiente não carregadas

**Solução**: Verifique se o arquivo `.env` existe e está na raiz do projeto:

```bash
cat .env
```

Certifique-se de que as variáveis estão corretas:
- `CYPRESS_LOGIN_EMAIL` (obrigatório para testes UI autenticados)
- `CYPRESS_LOGIN_PASSWORD` (obrigatório para testes UI autenticados)

### Problema: Browser não encontrado

**Solução**: Certifique-se de que o browser está instalado:

```bash
# Verificar browsers disponíveis
npx cypress info
```

### Problema: Testes API não detectam baseUrl correta

**Solução**: Certifique-se de que a variável `CYPRESS_TEST_TYPE=api` está sendo passada ou que os arquivos estão em `cypress/e2e/api/`. O Cypress detecta automaticamente testes API pelo caminho do arquivo.

---

## 📚 Recursos Adicionais

- [Documentação do Cypress](https://docs.cypress.io/)
- [Documentação do ServeRest](https://serverest.dev/)
- [Documentação do Allure](https://docs.qameta.io/allure/)
- [Organizing Tests - Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices#Organizing-Tests-Logging-In-Controlling-State)

---

## 📄 Licença

Este projeto está licenciado sob a licença ISC.

---

## 👤 Autor

**Thito Ribeiro**

- GitHub: [@thitoribeiro](https://github.com/thitoribeiro)

---

## 🙏 Agradecimentos

- [ServeRest Latina](https://serverest.dev/) pela aplicação de teste pública
- Comunidade Cypress pelo excelente framework
- Equipe Allure pelos relatórios detalhados

---

## 📝 Changelog

### Versão 1.0.0

- ✅ Implementação inicial de testes de UI (cadastro, login, cadastro autenticado)
- ✅ Implementação inicial de testes de API (POST, GET, GET by ID, DELETE)
- ✅ Integração com Allure Reports
- ✅ Suporte multi-browser (Chrome, Firefox, Electron)
- ✅ Configuração dinâmica de baseUrl por tipo de teste
- ✅ Comandos customizados reutilizáveis para UI
- ✅ Helpers centralizados para API
- ✅ Validação de JSON Schema para testes API
- ✅ Separação clara de arquivos API e UI em pastas dedicadas
- ✅ Clean Code e boas práticas
