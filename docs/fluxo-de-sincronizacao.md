---
sidebar_position: 5
title: Fluxo de Sincronização
---

# Fluxo de Sincronização

## Introdução

Este documento especifica o processo completo de sincronização de dados entre sistemas de gestão acadêmica (ERP) e a plataforma ProExtend, incluindo endpoints, estrutura de payloads, tratamento de erros e estratégias de sincronização.

A ordem de sincronização é fundamental devido às dependências entre entidades. O não cumprimento da sequência especificada resultará em erros de validação.

## Ordem de Sincronização

### Sincronização Inicial (Setup Completo)

A configuração inicial requer sincronização completa na seguinte ordem:

```
1. Sincronizar Unidades/Campus (Units)
   ↓
2. Sincronizar Áreas (Areas)
   ↓
3. Sincronizar Cursos (Courses)
   ↓
4. Sincronizar Disciplinas Base (Subjects)
   ↓
5. Sincronizar Professores (Professors)
   ↓
6. Sincronizar Alunos (Students)
   ↓
7. Sincronizar Turmas (Enrollments)
```

### Sincronizações Subsequentes

Após a configuração inicial, sincronizações periódicas devem seguir o processo:

```
1. Identificar alterações no sistema origem desde última sincronização
   ↓
2. Sincronizar apenas entidades modificadas (incremental)
   ↓
3. Verificar status e logs da sincronização
   ↓
4. Registrar timestamp para próxima execução
```

## 1. Sincronizar Unidades

Unidades representam campus ou estabelecimentos físicos da instituição de ensino.

**Dependências**: Nenhuma (primeira entidade a ser sincronizada)

### Endpoint

```
POST /integration/v1/units/sync
```

### Exemplo de Requisição

```bash
curl -X POST https://{{instituicao}}.proextend.com.br/api/integration/v1/units/sync \
  -H "Authorization: Bearer pex_..." \
  -H "Content-Type: application/json" \
  -d '{
    "units": [
      {
        "code": "CAMPUS_CENTRO",
        "name": "Campus Centro",
        "address": "Rua Principal, 123 - Centro, São Paulo - SP"
      },
      {
        "code": "CAMPUS_NORTE",
        "name": "Campus Zona Norte",
        "address": "Av. Norte, 456 - Zona Norte, São Paulo - SP"
      }
    ]
  }'
```

### Campos Obrigatórios

- `code`: Código único da unidade (ex: "CAMPUS_CENTRO")
- `name`: Nome da unidade

### Campos Opcionais

- `address`: Endereço completo

### Resposta

```json
{
  "success": true,
  "message": "Sincronização de unidades concluída.",
  "data": {
    "created": 2,
    "updated": 0,
    "failed": 0
  }
}
```

## 2. Sincronizar Áreas

Áreas de conhecimento que agrupam cursos relacionados.

**Dependências**: Unidades devem estar sincronizadas

### Endpoint

```
POST /integration/v1/areas/sync
```

### Exemplo

```json
{
  "areas": [
    {
      "code": "TECH",
      "name": "Tecnologia da Informação",
      "unit_code": "CAMPUS_CENTRO",
      "responsible_email": "coord.tech@faculdade.edu.br"
    },
    {
      "code": "HEALTH",
      "name": "Ciências da Saúde",
      "unit_code": "CAMPUS_NORTE"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da área (máximo 255 caracteres)
- `name`: Nome da área (máximo 255 caracteres)
- `unit_code`: Código da unidade (deve existir)
- `responsible_email` **OU** `responsible_code`: Pelo menos um deles é obrigatório

### Campos Opcionais

- `responsible_email`: Email do responsável (deve ser Admin ativo)
- `responsible_code`: Código do responsável (deve ser Admin ativo)

:::note[IMPORTANTE]
O responsável pela área deve ser um Administrador (Admin):

- Profile type deve ser `'admin'`
- Não pode estar suspenso (`suspended_at` deve ser `null`)
- Não aceita Professor ou Aluno como responsável

Se o responsável não for um Admin ou estiver suspenso, a sincronização falhará com erro 422.
:::

## 3. Sincronizar Cursos

Programas acadêmicos oferecidos pela instituição de ensino.

**Dependências**: Unidades e Áreas devem estar sincronizadas

### Endpoint

```
POST /integration/v1/courses/sync
```

### Exemplo

```json
{
  "courses": [
    {
      "code": "CC001",
      "name": "Ciência da Computação",
      "description": "Bacharelado em Ciência da Computação - Duração 4 anos",
      "area_code": "TECH",
      "unit_code": "CAMPUS_CENTRO",
      "responsible_code": "PROF001"
    },
    {
      "code": "ENF001",
      "name": "Enfermagem",
      "description": "Bacharelado em Enfermagem - Duração 5 anos",
      "area_code": "HEALTH",
      "unit_code": "CAMPUS_NORTE",
      "responsible_email": "coord.enf@faculdade.edu.br"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do curso (máximo 255 caracteres)
- `name`: Nome do curso (máximo 255 caracteres)
- `area_code`: Código da área (deve existir)
- `unit_code`: Código da unidade (deve existir)
- `responsible_email` **OU** `responsible_code`: Pelo menos um deles é obrigatório

### Campos Opcionais

- `description`: Descrição detalhada

:::note[IMPORTANTE]
O responsável pelo curso deve ser um Administrador (Admin):

- Profile type deve ser `'admin'`
- Não pode estar suspenso (`suspended_at` deve ser `null`)
- Não aceita Professor ou Aluno como responsável
- Se ambos `responsible_email` e `responsible_code` forem fornecidos, `responsible_code` tem prioridade

Se o responsável não for um Admin ou estiver suspenso, a sincronização falhará com erro 422.
:::

## 4. Sincronizar Disciplinas Base

Componentes curriculares que compõem a grade dos cursos. Representam o cadastro permanente no catálogo curricular, sem vínculo com períodos letivos ou matrículas.

**Dependências**: Cursos devem estar sincronizados

### Endpoint

```
POST /integration/v1/subjects/sync
```

### Exemplo

```json
{
  "subjects": [
    {
      "code": "ALG001",
      "name": "Algoritmos e Programação I",
      "description": "Introdução a algoritmos e lógica de programação",
      "course_code": "CC001"
    },
    {
      "code": "BD001",
      "name": "Banco de Dados I",
      "description": "Fundamentos de banco de dados relacionais",
      "course_code": "CC001"
    },
    {
      "code": "LIBRAS",
      "name": "Língua Brasileira de Sinais",
      "course_code": "CC001",
      "type": "optativa"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da disciplina (máximo 255 caracteres)
- `name`: Nome da disciplina (máximo 255 caracteres)
- `course_code`: Código do curso (deve existir)

### Campos Opcionais

- `description`: Descrição da disciplina
- `type`: Tipo de disciplina
  - `obrigatoria` (padrão se omitido)
  - `optativa`
  - `eletiva`

## 5. Sincronizar Professores

Corpo docente da instituição de ensino.

**Dependências**: Nenhuma (entidade independente, pode ser sincronizada a qualquer momento)

 

### Endpoint

```
POST /integration/v1/professors/sync
```

### Exemplo

```json
{
  "professors": [
    {
      "code": "PROF001",
      "name": "Dr. João Silva",
      "email": "joao.silva@faculdade.edu.br",
      "cpf": "12345678901",
      "phone": "11999999999",
      "area_code": "TECH"
    },
    {
      "code": "PROF002",
      "name": "Dra. Maria Santos",
      "email": "maria.santos@faculdade.edu.br",
      "cpf": "98765432100",
      "area_code": "TECH"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do professor (máximo 255 caracteres) - matrícula, CPF ou código funcional
- `name`: Nome completo do docente (máximo 255 caracteres)
- `email`: Email institucional (deve ser único na plataforma)

### Campos Opcionais

- `cpf`: CPF (aceita formatado ou sem formatação)
  - Formato aceito 1: `12345678901` (11 dígitos sem formatação)
  - Formato aceito 2: `123.456.789-01` (formatado com pontos e hífen)
  - Deve ser válido conforme algoritmo de validação de CPF
- `phone`: Telefone de contato
  - Apenas dígitos numéricos
  - Exemplo válido: `11999999999`, `1133334444`
  - Exemplo inválido: `(11) 99999-9999`, `11 99999-9999`
- `area_code`: Código da área de atuação (deve existir se fornecido)

### Validações Importantes

- Email duplicado resulta em erro 422 (Unprocessable Entity)
- CPF duplicado resulta em erro 422 (Unprocessable Entity)
- Code deve ser único entre professores
- CPF é campo opcional

## 6. Sincronizar Alunos

Estudantes matriculados em programas acadêmicos.

**Dependências**: Nenhuma (entidade independente, pode ser sincronizada a qualquer momento)


### Endpoint

```
POST /integration/v1/students/sync
```

### Exemplo

```json
{
  "students": [
    {
      "code": "ALU2024001",
      "name": "Pedro Oliveira Santos",
      "email": "pedro.oliveira@aluno.edu.br",
      "cpf": "11122233344",
      "phone": "11977777777",
      "course_code": "CC001"
    },
    {
      "code": "12345678901",
      "name": "Ana Costa Ferreira",
      "email": "ana.costa@aluno.edu.br",
      "cpf": "12345678901",
      "course_code": "ENF001"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do aluno (máximo 255 caracteres) - matrícula, CPF ou RA
- `name`: Nome completo do estudante (máximo 255 caracteres)
- `email`: Email institucional (deve ser único na plataforma)
- `course_code`: Código do curso ao qual está matriculado (deve existir)

### Campos Opcionais

- `cpf`: CPF (aceita formatado ou sem formatação)
  - Formato aceito 1: `12345678901` (11 dígitos sem formatação)
  - Formato aceito 2: `123.456.789-01` (formatado com pontos e hífen)
  - Deve ser válido conforme algoritmo de validação de CPF
- `phone`: Telefone de contato
  - Apenas dígitos numéricos
  - Exemplo válido: `11999999999`, `1133334444`
  - Exemplo inválido: `(11) 99999-9999`, `11 99999-9999`

### Observações Importantes

- Campo `code` possui formato flexível: matrícula, CPF ou RA
- Email duplicado resulta em erro 422 (Unprocessable Entity)
- CPF duplicado (se fornecido) resulta em erro 422
- CPF é campo opcional

## 7. Sincronizar Turmas (Enrollments)

Turmas representam instâncias de disciplinas base em períodos letivos específicos, incluindo docente responsável e estudantes matriculados.

**Dependências**: Disciplinas Base, Professores e Alunos devem estar sincronizados

### Endpoint

```
POST /integration/v1/enrollments/sync
```

### Exemplo

```json
{
  "enrollments": [
    {
      "code": "ALG001-2025.1",
      "subject_code": "ALG001",
      "professor_code": "PROF001",
      "semester": "2025.1",
      "student_codes": [
        "ALU2024001",
        "ALU2024002"
      ]
    },
    {
      "code": "BD001-2025.1",
      "subject_code": "BD001",
      "professor_code": "PROF002",
      "semester": "2025.1",
      "student_codes": [
        "ALU2024001"
      ]
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da turma (máximo 255 caracteres) - recomendado incluir semestre, ex: "ALG001-2025.1"
- `subject_code`: Código da disciplina base vinculada (deve existir)
- `professor_code`: Código do docente responsável (deve existir)
- `semester`: Período letivo (formato: "YYYY.N", exemplos: "2025.1", "2025.2")

### Campos Opcionais

- `student_codes`: Array contendo códigos dos alunos matriculados (devem existir)
  - Campo opcional (pode ser omitido)
  - Pode ser enviado como array vazio `[]`
  - Útil para criar turmas antes de ter alunos matriculados

### Comportamento de Sincronização

- **Turma existente** (code já cadastrado): Atualiza professor e substitui lista completa de alunos
- **Turma nova** (code não existe): Cria nova turma com vínculos especificados
- **Alunos removidos**: Desvinculados automaticamente da turma
- **Alunos adicionados**: Vinculados automaticamente à turma

**Observação**: A sincronização substitui completamente a lista de alunos. Certifique-se de enviar a lista completa desejada.

## Consultando Status da Sincronização

Após a sincronização, é possível verificar o status geral e estatísticas das entidades sincronizadas.

### Endpoint

```
GET /integration/v1/sync-status
```

### Exemplo

```bash
curl -X GET https://{{instituicao}}.proextend.com.br/api/integration/v1/sync-status \
  -H "Authorization: Bearer pex_..."
```

### Resposta

```json
{
  "success": true,
  "data": {
    "last_sync": {
      "timestamp": "2025-12-31T10:00:00Z",
      "minutes_ago": 15
    },
    "entities": {
      "units": { "total": 3 },
      "areas": { "total": 8 },
      "courses": { "total": 15 },
      "subjects": { "total": 120 },
      "professors": { "total": 45 },
      "students": { "total": 850 },
      "enrollments": { "total": 2340 }
    },
    "api_client": {
      "name": "Integração - Acesso Completo",
      "scope": "full",
      "rate_limit": 60
    }
  }
}
```

## Consultando Dados Sincronizados

A API disponibiliza endpoints de consulta (GET) para verificação de dados sincronizados.

### Listar Unidades

Listação paginada com suporte a busca textual:

```
GET /integration/v1/units?per_page=50&page=1&search=centro
```

Parâmetros:
- `per_page`: Registros por página (padrão: 15, máximo: 100)
- `page`: Número da página
- `search`: Termo de busca (opcional)

### Buscar Unidade Específica por Code

```
GET /integration/v1/units/CAMPUS_CENTRO
```

### Buscar Professor Específico por Code

```
GET /integration/v1/professors/PROF001
```

### Listar Turmas Vinculadas a Professor

```
GET /integration/v1/professors/PROF001/subjects
```

### Buscar Turma Específica por Code

```
GET /integration/v1/enrollments/ALG001-2025.1
```

## Tratamento de Erros

### Códigos de Status HTTP

- **200 OK**: Operação bem-sucedida
- **401 Unauthorized**: API Key inválida ou ausente
- **422 Unprocessable Entity**: Erro de validação de dados
- **429 Too Many Requests**: Limite de taxa excedido
- **500 Internal Server Error**: Erro interno do servidor

### Erros de Dependência

**Cenário**: Tentativa de criar curso antes de sincronizar área ou unidade

**Resposta de Erro**:

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "area_code": ["A área especificada não existe"]
  }
}
```

**Solução**: Sincronizar entidades na ordem correta de dependências:

```
Units → Areas → Courses → Subjects → Professors/Students → Enrollments
```

### Erros de Duplicação

**Cenário**: Tentativa de criar registro com email ou CPF já cadastrado

**Resposta de Erro**:

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "email": ["Email já cadastrado na plataforma"]
  }
}
```

**Observação**: A API implementa comportamento idempotente. Sincronização com code existente resulta em **atualização** ao invés de duplicação. Este erro ocorre quando campos únicos (email/CPF) conflitam com registros diferentes.

### Erros de Validação de Formato

**Cenário 1: CPF inválido**

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "professors.0.cpf": ["O CPF informado é inválido."]
  }
}
```

**Observação**: O CPF é validado conforme algoritmo oficial. Aceita tanto formato sem pontuação (`12345678901`) quanto formatado (`123.456.789-01`).

**Cenário 2: Telefone com formato inválido**

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "professors.0.phone": ["O telefone deve conter apenas dígitos."]
  }
}
```

**Observação**: O telefone deve conter apenas números, sem parênteses, espaços ou hífens.

**Cenário 3: Campo excede tamanho máximo**

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "areas.0.code": ["O código não pode ter mais de 255 caracteres."]
  }
}
```

**Solução**: Validar formato e consistência dos dados no sistema origem antes do envio.

## Estratégias de Sincronização

### Sincronização Completa (Recomendada para Setup Inicial)

A sincronização completa deve ser utilizada na configuração inicial do sistema. Ela consiste em enviar todas as entidades para a API na ordem de dependência correta:

1. **Unidades** - Estabelecimentos de ensino
2. **Áreas** - Áreas de conhecimento
3. **Cursos** - Cursos oferecidos
4. **Disciplinas Base** - Disciplinas que compõem os cursos
5. **Professores** - Corpo docente
6. **Alunos** - Estudantes matriculados
7. **Turmas** - Matrículas e vínculos entre alunos e disciplinas

> **Importante**: Respeite essa ordem para evitar erros de dependência.

### Sincronização Incremental (Recomendada para Atualizações)

Após a sincronização inicial, utilize a sincronização incremental para otimizar o processo:

1. **Identifique mudanças** - Determine quais registros foram criados, alterados ou excluídos desde a última sincronização
2. **Envie apenas alterações** - Sincronize apenas os dados modificados
3. **Registre timestamp** - Armazene a data/hora da última sincronização para a próxima execução

**Benefícios**:
- Reduz o volume de dados transmitidos
- Diminui o tempo de processamento
- Minimiza o impacto no sistema

### Sincronização em Lote

Agrupe múltiplos registros em uma única requisição para melhorar a performance:

```json
{
  "professors": [
    { "code": "PROF001", "name": "Dr. João Silva", "email": "joao@escola.com" },
    { "code": "PROF002", "name": "Dra. Maria Santos", "email": "maria@escola.com" },
    { "code": "PROF003", "name": "Dr. Carlos Oliveira", "email": "carlos@escola.com" }
  ]
}
```

**Recomendações**:
- Envie lotes de até 100 registros por requisição
- Implemente retry automático em caso de falhas
- Registre logs de sincronização para auditoria

## Próximos Passos

1. Compreender sistema de [Identificadores e Codes](identificadores-e-codes)
2. Consultar [Postman Collection](postman) para exemplos práticos de requisições
3. Configurar rotina de sincronização periódica (incremental)
4. Implementar monitoramento e alertas de falhas
