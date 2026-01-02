---
sidebar_position: 2
title: Visão Geral
---

# Visão Geral da Integração

## Objetivo da Integração

A API de Integração ProExtend permite que sistemas de gestão acadêmica (ERPs) sincronizem dados com a plataforma ProExtend. Esta API possibilita a sincronização bidirecional de dados acadêmicos incluindo unidades, áreas, cursos, disciplinas, professores, alunos e matrículas.

## Arquitetura de Comunicação

```
Sistema Origem          →    API ProExtend
(Instituição)                    (Plataforma)

- Submissão de dados        →    - Validação de payload
- Identificadores próprios  →    - Persistência/atualização
- Sincronização periódica   →    - Garantia de consistência
```

### Características Arquiteturais

1. **Sistema de Identificação Baseado em Codes**: Utiliza identificadores do sistema origem
2. **Operações Idempotentes**: Sincronizações múltiplas não resultam em duplicação de dados
3. **Arquitetura RESTful**: Protocolo HTTP com payloads JSON
4. **Autenticação via API Key**: Credenciais de longa duração geradas administrativamente

## Mecanismo de Autenticação

A API implementa autenticação baseada em API Keys geradas através do painel administrativo (Avançado > Integrações).

## Sistema de Identificadores (Codes)

O sistema utiliza identificadores próprios do ERP origem (denominados "codes") para todas as entidades. A API ProExtend não gera novos identificadores.

O mapeamento de entidades é realizado exclusivamente através dos codes fornecidos. Não é necessário armazenar IDs internos da plataforma.

A API possui comportamento idempotente: ao sincronizar uma entidade cujo code já existe, os dados são atualizados sem criar registros duplicados.

Especificação detalhada em [Identificadores e Codes](identificadores-e-codes).

## Modelo de Dados

O sistema opera com as seguintes entidades:

### 1. Unidades (Units)
Representam campus ou unidades físicas da instituição de ensino.

Exemplo: Campus Centro, Campus Norte

### 2. Áreas (Areas)
Áreas de conhecimento que agrupam cursos relacionados.

Exemplo: Tecnologia da Informação, Ciências da Saúde

### 3. Cursos (Courses)
Programas acadêmicos oferecidos pela instituição.

Exemplo: Ciência da Computação, Enfermagem

### 4. Disciplinas Base (Subjects)
Componentes curriculares que compõem a grade de cursos.

Exemplo: Algoritmos I, Banco de Dados, LIBRAS

Nota: Disciplinas Base representam o cadastro curricular permanente, sem vínculo com períodos letivos ou discentes.

### 5. Professores (Professors)
Docentes responsáveis por ministrar disciplinas.

Exemplo: João Silva, Maria Santos

### 6. Alunos (Students)
Discentes matriculados em programas acadêmicos.

Exemplo: Pedro Oliveira, Ana Costa

### 7. Turmas (Enrollments)
Instâncias de disciplinas base vinculadas a período letivo específico, incluindo docente responsável e discentes matriculados.

Exemplo: "Algoritmos I - 2025.1" (turma com 30 alunos, Prof. João)

Nota: Turmas são instâncias de Disciplinas Base em um período letivo.

## Distinção: Disciplina Base vs Turma

- **Disciplina Base (Subject)**: Registro permanente no catálogo curricular, sem vínculo temporal ou matrícula de alunos
- **Turma (Enrollment)**: Instância de disciplina base em período letivo determinado, com docente e discentes vinculados

Detalhamento em [Conceitos Fundamentais](conceitos-fundamentais).

## Hierarquia de Entidades

Estrutura hierárquica: Unidades → Áreas → Cursos → Disciplinas Base

Relacionamento de Turmas: Disciplina Base + Professor + Alunos

Especificação completa em [Conceitos Fundamentais](conceitos-fundamentais).

## Processo de Integração

### Configuração Inicial

1. Geração de API Key via painel administrativo
2. Sincronização de entidades respeitando ordem de dependências: Units → Areas → Courses → Subjects → Professors/Students → Enrollments

### Sincronização Incremental

Submissão de entidades modificadas. A API realiza atualização baseada em identificador (code).

Especificação detalhada em [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Operações Suportadas

### Operações de Consulta (GET)

Recuperação de dados sincronizados.

Permissão requerida: scope `read` ou `full`

Exemplos:
- `GET /integration/v1/units` - Listagem de unidades
- `GET /integration/v1/professors/PROF001` - Recuperação de professor por identificador

### Operações de Sincronização (POST)

Criação ou atualização de entidades em lote.

Permissão requerida: scope `write` ou `full`

Exemplos:
- `POST /integration/v1/units/sync` - Sincronização de unidades
- `POST /integration/v1/students/sync` - Sincronização de alunos

Comportamento de sincronização:
- Entidade com code existente: atualização de dados
- Entidade com code inexistente: criação de novo registro
- Operação idempotente: execução múltipla não resulta em duplicação

## Segurança e Controle de Acesso

### Escopos de Autorização

Cada API Key é configurada com escopo de acesso específico:

- **read**: Permissão de leitura (endpoints GET)
- **write**: Permissão de sincronização (endpoints POST /sync)
- **full**: Permissão completa (leitura e escrita)

### Limitação de Taxa (Rate Limiting)

Limite configurável por cliente API (padrão: 60 requisições/minuto).

Resposta em caso de excedente de taxa:

```json
{
  "success": false,
  "message": "Muitas tentativas. Por favor, tente novamente mais tarde.",
  "retry_after": 60,
  "status": 429
}
```

### Requisitos de Segurança

- **Protocolo HTTPS**: Obrigatório para todas as requisições
- **Isolamento de Dados**: Cada instituição acessa exclusivamente seus próprios dados
- **Credenciais Exclusivas**: API Keys únicas por integração

## Especificação de Endpoints

### URL Base

```
https://{{instituicao}}.proextend.com.br/api/integration/v1/
```

Substituir `{{instituicao}}` pela URL fornecida para sua instituição.

### Endpoints de Consulta

```
GET /integration/v1/units
GET /integration/v1/units/{code}
GET /integration/v1/areas
GET /integration/v1/courses
GET /integration/v1/subjects
GET /integration/v1/professors
GET /integration/v1/students
GET /integration/v1/enrollments
```

### Endpoints de Sincronização

```
POST /integration/v1/units/sync
POST /integration/v1/areas/sync
POST /integration/v1/courses/sync
POST /integration/v1/subjects/sync
POST /integration/v1/professors/sync
POST /integration/v1/students/sync
POST /integration/v1/enrollments/sync
```

## Exemplo de Utilização

```bash
# Sincronização de professor
POST /integration/v1/professors/sync
Authorization: Bearer pex_...

{
  "professors": [{
    "code": "PROF001",
    "name": "Dr. João Silva",
    "email": "joao@inst.edu.br",
    "cpf": "12345678901"
  }]
}

# Consulta de professor
GET /integration/v1/professors/PROF001
Authorization: Bearer pex_...
```

Exemplos completos em [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Características da Solução

1. **Independência de Identificadores Internos**: Utilização de códigos do sistema origem
2. **Operações Idempotentes**: Sincronizações múltiplas sem efeitos colaterais
3. **Sincronização Seletiva**: Possibilidade de sincronizar subconjuntos de entidades
4. **Rastreabilidade**: Vinculação de dados através de identificadores do sistema origem
5. **Isolamento Multi-tenant**: Segregação completa de dados entre instituições

## Próximas Etapas

Para implementação da integração:

1. Revisar [Conceitos Fundamentais](conceitos-fundamentais) para compreensão do modelo de dados
2. Configurar [Autenticação](autenticacao) para obtenção de credenciais
3. Implementar [Fluxo de Sincronização](fluxo-de-sincronizacao) conforme sequência especificada
4. Aplicar diretrizes de [Identificadores e Codes](identificadores-e-codes)

## Recursos de Monitoramento

- **Sync Status**: Endpoint para monitoramento de estado de sincronização (`GET /integration/v1/sync-status`)
