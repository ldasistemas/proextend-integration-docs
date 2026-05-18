---
sidebar_position: 1
slug: /
title: Introdução
---

# Documentação de Integração - ProExtend API

Documentação técnica para integração de sistemas de gestão acadêmica com a plataforma ProExtend.

:::info
Todos os endpoints da integração estão disponíveis para teste diretamente no navegador.

**<a href="/api" target="_blank">Acessar API →</a>**
:::

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
- Unidades (Units), Diretores (Directors) e Assessores Pedagógicos (Pedagogical Advisors)
- Áreas (Areas), entidade global da instituição, e Gestores de Área (Area Managers, multi-área + unidade própria)
- Cursos (Courses) e Coordenadores (Coordinators, multi-curso)
- Disciplinas Base (Subjects), entidade global da instituição, e Turmas (Enrollments, com cursos definidos via `course_codes`)
- Professores (Professors) e Alunos (Students)
- Hierarquia e dependências entre entidades

Referência: [Conceitos Fundamentais](conceitos-fundamentais)

### 3. Identificadores e codes

Explica o sistema de identificação de entidades:
- Uso de identificadores próprios do sistema de origem (`codes`)
- Comportamento idempotente da API
- Convenções de nomenclatura
- Casos de uso e exemplos práticos
- Erros comuns relacionados a identificadores

Referência: [Identificadores e codes](identificadores-e-codes)

### 4. Autenticação

Especifica o processo de autenticação:
- Geração de API Key no painel administrativo
- Utilização da API Key em requisições HTTP
- Gerenciamento e revogação de chaves
- Scopes de acesso
- Políticas de rate limiting
- Diretrizes de segurança

Referência: [Autenticação](autenticacao)

### 5. SSO (Single Sign-On)

Funcionalidade de autenticação única:
- Geração de tokens de acesso
- Integração com portais institucionais
- Acesso via emails automatizados
- Convites temporários

Referência: [SSO](sso)

### 6. Fluxo de Sincronização

Descreve o processo completo de sincronização:
- Ordem de sincronização sugerida: Units, Areas e Subjects (entidades globais) → Courses → Professors/Students → Enrollments. Diretores, Assessores, Gestores de Área e Coordenadores podem ser sincronizados a qualquer momento após sua dependência direta
- Especificação de cada endpoint de sincronização
- Definição de campos obrigatórios e opcionais por entidade
- Modos de sincronização (`*_sync_mode`: `add` ou `replace`) para arrays de vínculos em Turmas, Coordenadores e Gestores de Área
- Estratégias de sincronização (completa, incremental, em lote)
- Operações de consulta de dados sincronizados

Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao)

### 7. Tratamento de Erros

Especifica o shape padronizado `ApiError` retornado por todos os erros da API:
- 7 tipos de erro: `validation_failed`, `code_not_found`, `constraint_violation`, `not_found`, `authentication_failed`, `rate_limit_exceeded`, `internal`
- Wrappers de resposta para validação, sync com falhas parciais, 404, single-item, auth e rate limit
- Glossário de regras (`rule`) para `constraint_violation`, `authentication_failed` e `rate_limit_exceeded`
- Exemplos por cenário

Referência: [Tratamento de Erros](tratamento-de-erros)

### 8. Remoção de Entidades

Documenta os endpoints `DELETE` e o comportamento de soft delete em cascata.

Referência: [Remoção de Entidades](remocao)

### 9. Relatórios e Consultas

Endpoints de leitura de dados acadêmicos: atividades, notas e submissões.

Referência: [Relatórios e Consultas](relatorios)

### 10. Logs de Integrações

Registro automático de todas as requisições de escrita feitas pela API. Permite acompanhar o histórico de sincronizações, identificar falhas e auditar o uso da integração. Os logs ficam disponíveis por 30 dias no painel e via API.

Referência: [Logs de Integrações](logs-de-integracoes)

## Guia de Utilização

### Implementação Inicial

1. Revisar [Visão Geral](visao-geral) para compreensão do modelo de integração
2. Estudar [Conceitos Fundamentais](conceitos-fundamentais) para familiarização com o modelo de dados
3. Configurar [Autenticação](autenticacao) no painel administrativo (requer permissões de administrador)
4. Implementar sincronização seguindo [Fluxo de Sincronização](fluxo-de-sincronizacao)
5. Aplicar diretrizes de [Identificadores e codes](identificadores-e-codes)
6. Monitorar operações via [Logs de Integrações](logs-de-integracoes)
7. (Opcional) Configurar [SSO](sso) para login direto de usuários

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

O sistema não requer armazenamento de IDs internos retornados pela API. A identificação de entidades é realizada através dos `codes` do sistema de origem. Referência: [Identificadores e codes](identificadores-e-codes).

### Mecanismo de Autenticação

A autenticação é realizada via API Key gerada no painel administrativo. A chave deve ser incluída no header HTTP `Authorization: Bearer {api_key}`. Referência: [Autenticação](autenticacao).

### Sincronização Múltipla

A API implementa comportamento idempotente. Múltiplas sincronizações com mesmo identificador (`code`) resultam em atualização da entidade existente, não em duplicação. Referência: [Identificadores e codes](identificadores-e-codes).

### Sequência de Sincronização

Ordem sugerida: **Unidades, Áreas, Disciplinas Base e Professores** (sem dependências, podem ser sincronizados em paralelo) → **Cursos** (dependem de Unidade e Área) → **Alunos** (dependem de Curso) → **Turmas** (dependem de Disciplina Base, Cursos e Professores; Alunos opcionais). Perfis vinculados (Diretores e Assessores a Unidades, Gestores a Áreas e Unidade, Coordenadores a Cursos) podem ser sincronizados a qualquer momento após suas dependências diretas. O não cumprimento da ordem resultará em erros de dependência. Referência: [Fluxo de Sincronização](fluxo-de-sincronizacao).

### Distinção entre Subject e Enrollment

- **Subject (Disciplina Base)**: Componente curricular global da instituição, sem vínculo com curso, período letivo ou alunos
- **Enrollment (Turma)**: Instância de uma disciplina base em período letivo específico, vinculada a um ou mais cursos via `course_codes` (obrigatório), com um ou mais professores e alunos matriculados. **A Turma é o único lugar onde o vínculo curso ↔ disciplina é definido.**

Referência: [Conceitos Fundamentais](conceitos-fundamentais).

## Versionamento

- **Versão da API**: v1
