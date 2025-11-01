/**
 * @file homeElements.js
 * Mapeamento de elementos da tela Home.
 * Clean Code: nomes claros, imutabilidade, fonte única de verdade.
 */

const SELECTORS = Object.freeze({
  // Navbar
  navHome: '[data-testid="home"]',
  navCadUsuarios: '[data-testid="cadastrar-usuarios"]',
  navListUsuarios: '[data-testid="listar-usuarios"]',
  navCadProdutos: '[data-testid="cadastrar-produtos"]',
  navListProdutos: '[data-testid="listar-produtos"]',
  navRelatorios: '[data-testid="link-relatorios"]',
  navLogout: '[data-testid="logout"]',

  // Conteúdo principal
  greetingH1: '.jumbotron h1',
  leadText: '.jumbotron .lead',

  // Cards
  cardCadastrarUsuariosBtn: '[data-testid="cadastrarUsuarios"]',
  cardCadUsuariosBtn: '[data-testid="cadastrarUsuarios"]',
  cardListUsuariosBtn: '[data-testid="listarUsuarios"]',
  cardCadProdutosBtn: '[data-testid="cadastrarProdutos"]',
  cardListProdutosBtn: '[data-testid="listarProdutos"]',
  cardRelatoriosBtn: '[data-testid="relatorios"]'
});

module.exports = SELECTORS;
