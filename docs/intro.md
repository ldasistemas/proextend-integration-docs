---
sidebar_position: 1
slug: /
title: Introdução
---

# Documentação de Integração - ProExtend API

Documentação técnica para integração de sistemas de gestão acadêmica com a plataforma ProExtend.

## Escopo da Documentação

Esta documentação especifica os processos, conceitos e fluxos de sincronização necessários para garantir a interoperabilidade entre sistemas de gestão acadêmica (ERP) e a plataforma ProExtend. O escopo abrange processos de integração completos, incluindo modelo de dados, mecanismos de autenticação e padrões de sincronização.

## Público-Alvo

Esta documentação destina-se a:

- Desenvolvedores responsáveis pela implementação da integração
- Arquitetos de software que projetam a solução de integração
- Equipes de TI responsáveis pela sincronização de dados
- Gestores técnicos envolvidos no planejamento da integração

## Estrutura da Documentação

A documentação está organizada de forma hierárquica, partindo de conceitos fundamentais até implementação prática.

### 1. Visão Geral

Apresenta o panorama completo da integração:
- Objetivos e modelo de comunicação
- Mecanismo de autenticação via API Key
- Sistema de identificadores (codes)
- Entidades do modelo de dados
- Fluxo geral de sincronização

Referência: [Visão Geral](visao-geral)

### 2. Conceitos Fundamentais

Detalha as entidades do sistema e seus relacionamentos:
- Unidades, Áreas e Cursos
- Disciplinas Base x Turmas
- Professores e Alunos
- Hierarquia e dependências entre entidades
- Especificação de campos obrigatórios e opcionais

Referência: [Conceitos Fundamentais](conceitos-fundamentais)

### 3. Autenticação

Especifica o processo de autenticação:
- Geração de API Key no painel administrativo
- Utilização da API Key em requisições HTTP
- Gerenciamento e revogação de chaves
- Scopes de acesso
- Políticas de rate limiting
- Diretrizes de segurança

Referência: [Autenticação](autenticacao)

### 4. SSO (Single Sign-On)

Funcionalidade de autenticação única:
- Geração de tokens de acesso
- Integração com portais institucionais
- Acesso via emails automatizados
- Convites temporários

Referência: [SSO](sso)

### 5. Fluxo de Sincronização

Descreve o processo completo de sincronização:
- Ordem de sincronização obrigatória: Units → Areas → Courses → Subjects → Professors/Students → Enrollments
- Especificação de cada endpoint de sincronização
- Definição de campos obrigatórios e opcionais por entidade
- Tratamento de erros e códigos de resposta HTTP
- Estratégias de sincronização (completa, incremental, em lote)
- Operações de consulta de dados sincronizados

Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao)

### 6. Identificadores e Codes

Explica o sistema de identificação de entidades:
- Uso de identificadores próprios do sistema origem (codes)
- Comportamento idempotente da API
- Convenções de nomenclatura
- Casos de uso e exemplos práticos
- Erros comuns relacionados a identificadores

Referência: [Identificadores e Codes](identificadores-e-codes)

### 7. Postman Collection

Exemplos práticos de requisições:
- Configuração de variáveis de ambiente
- Exemplos de sincronização para todas as entidades
- Exemplos de consultas (GET)
- Cenários de tratamento de erros

Referência: [Postman Collection](postman)

## Guia de Utilização

### Implementação Inicial

1. Revisar [Visão Geral](visao-geral) para compreensão do modelo de integração
2. Estudar [Conceitos Fundamentais](conceitos-fundamentais) para familiarização com o modelo de dados
3. Configurar [Autenticação](autenticacao) no painel administrativo (requer permissões de administrador)
4. Implementar sincronização seguindo [Fluxo de Sincronização](fluxo-de-sincronizacao)
5. Aplicar diretrizes de [Identificadores e Codes](identificadores-e-codes)
6. (Opcional) Configurar [SSO](sso) para login direto de usuários

### Consulta de Referência

Utilize o índice de navegação de cada documento para acesso direto a tópicos específicos.

### Resolução de Problemas

Consulte as seções "Erros Comuns" e "Tratamento de Erros" disponíveis em cada documento técnico.

## Especificação de Endpoints

### Base URL

```
https://{{instituicao}}.proextend.com.br/api/integration/v1/
```

Substituir `{{instituicao}}` pela URL fornecida para sua instituição.

Para especificação completa de endpoints, consulte [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Procedimento de Início Rápido

1. Geração de API Key via painel administrativo: Avançado → Integrações → Gerar Nova API Key
   - Referência: [Autenticação](autenticacao)

2. Sincronização de dados respeitando ordem de dependências
   - Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao)

3. Consulta de dados via endpoints GET utilizando API Key
   - Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao)

## Perguntas Frequentes

### Armazenamento de IDs Retornados

O sistema não requer armazenamento de IDs internos retornados pela API. A identificação de entidades é realizada através dos codes do sistema origem. Referência: [Identificadores e Codes](identificadores-e-codes).

### Mecanismo de Autenticação

A autenticação é realizada via API Key gerada no painel administrativo. A chave deve ser incluída no header HTTP `Authorization: Bearer {api_key}`. Referência: [Autenticação](autenticacao).

### Sincronização Múltipla

A API implementa comportamento idempotente. Múltiplas sincronizações com mesmo identificador (code) resultam em atualização da entidade existente, não em duplicação. Referência: [Identificadores e Codes](identificadores-e-codes).

### Sequência de Sincronização

Ordem obrigatória: Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas. O não cumprimento desta ordem resultará em erros de dependência. Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao).

### Distinção entre Subject e Enrollment

- **Subject (Disciplina Base)**: Componente curricular cadastrado na grade do curso, sem vínculo semestral
- **Enrollment (Turma)**: Instância de uma disciplina base em período letivo específico, com professor e alunos vinculados

Referência: [Conceitos Fundamentais](conceitos-fundamentais).

## Versionamento

- **Versão da API**: v1
