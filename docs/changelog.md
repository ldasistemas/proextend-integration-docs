---
sidebar_position: 10
title: Changelog
---

# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.2.0] - 2026-01-02

### ✨ Adicionado
- **API**: Novo endpoint `/api/v1/produtos/sincronizar` para sincronização em lote
- **API**: Suporte a filtros avançados na listagem de produtos
- **Documentação**: Seção de exemplos práticos de integração
- **Documentação**: Barra de busca local integrada
- **Documentação**: Changelog para acompanhamento de mudanças

### 🔄 Alterado
- **API**: Melhorias de performance no endpoint de autenticação (redução de 40% no tempo de resposta)
- **API**: Atualização do formato de retorno de erros para maior clareza
- **Documentação**: Reorganização da estrutura de navegação

### 🐛 Corrigido
- **API**: Correção de bug no cálculo de estoque disponível
- **API**: Fix no tratamento de caracteres especiais em códigos de produtos

---

## [1.1.0] - 2025-12-15

### ✨ Adicionado
- **API**: Endpoint para consulta de histórico de sincronizações
- **API**: Webhook para notificações de alterações em produtos
- **Documentação**: Guia de fluxo de sincronização detalhado
- **Documentação**: Exemplos de integração com Postman

### 🔄 Alterado
- **API**: Aumento do limite de requisições por minuto de 60 para 100
- **Documentação**: Melhoria na documentação de autenticação

### 🐛 Corrigido
- **API**: Correção no retorno de produtos inativos

---

## [1.0.0] - 2025-11-01

### ✨ Adicionado
- **API**: Lançamento inicial da API ProExtend Integration
- **API**: Endpoints para gestão de produtos (criar, atualizar, listar)
- **API**: Sistema de autenticação via token
- **API**: Identificadores e codes padronizados
- **Documentação**: Documentação completa da API
- **Documentação**: Guia de conceitos fundamentais
- **Documentação**: Exemplos de uso e boas práticas

---

## Tipos de Mudanças

- `✨ Adicionado` - Para novas funcionalidades
- `🔄 Alterado` - Para mudanças em funcionalidades existentes
- `🗑️ Depreciado` - Para funcionalidades que serão removidas
- `🐛 Corrigido` - Para correção de bugs
- `🔒 Segurança` - Para correções de vulnerabilidades
- `📝 Documentação` - Para mudanças apenas na documentação

---

## Suporte a Versões

| Versão | Status | Lançamento | Fim do Suporte |
|--------|--------|------------|----------------|
| 1.2.x  | ✅ Ativa | 2026-01-02 | - |
| 1.1.x  | ✅ Suportada | 2025-12-15 | 2026-06-15 |
| 1.0.x  | ⚠️ Legado | 2025-11-01 | 2026-05-01 |

---

## Como Acompanhar

Para se manter atualizado sobre as mudanças:

- 📧 Assine nossa newsletter de desenvolvedores
- 🔔 Acompanhe nosso [repositório no GitHub](https://github.com/rodrigueskaua/proextend-integration-docs)
- 📖 Visite regularmente esta página de changelog

## Próximas Atualizações (Roadmap)

### Em Desenvolvimento
- Suporte a webhooks de estoque em tempo real
- Integração com sistemas de pagamento
- SDK oficial para JavaScript/TypeScript
- Modo sandbox para testes

### Planejado para 2026
- GraphQL API complementar
- Suporte a múltiplos idiomas na API
- Dashboard de métricas e analytics
- Rate limiting personalizado por cliente
