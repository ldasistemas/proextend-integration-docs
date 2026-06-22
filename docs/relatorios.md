---
sidebar_position: 9
title: Relatórios e Consultas
---

# Relatórios e Consultas

Além dos endpoints de sincronização, a API disponibiliza endpoints de leitura de dados acadêmicos: atividades, notas e submissões. Todos requerem escopo `read` ou `full`. Teste os endpoints diretamente no [playground interativo](/api).

:::note
Todos os endpoints de listagem aceitam `per_page` (padrão: 50, máximo: 200) e `page` para paginação.
:::

## Atividades de uma Turma

Atividades de uma turma com estatísticas de submissão. Retorna 403 se a turma não pertencer ao professor informado.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/professors/{code}/subjects/{subjectCode}/activities" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código do professor (path) |
| `subjectCode` | string | Sim | Código da turma / enrollment code (path) |

### Resposta

```json
{
  "success": true,
  "data": {
    "subject": {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "name": "Algoritmos e Programação I"
    },
    "activities": [
      {
        "id": 1,
        "title": "Projeto Final",
        "description": "Implementação de algoritmo de ordenação.",
        "type": "activity",
        "due_date": "2025-06-30T23:59:00-03:00",
        "max_score": 10.0,
        "has_grade": true,
        "statistics": {
          "total_submissions": 28,
          "graded_submissions": 25,
          "pending_submissions": 3
        }
      }
    ]
  },
  "pagination": {
    "total": 1,
    "per_page": 50,
    "current_page": 1,
    "last_page": 1
  }
}
```

## Notas do Aluno em uma Turma

Notas de um aluno em uma turma, com detalhes de cada submissão. Retorna 403 se o aluno não estiver matriculado na turma.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/students/{code}/subjects/{subjectCode}/grades" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código do aluno (path) |
| `subjectCode` | string | Sim | Código da turma / enrollment code (path) |

### Resposta

```json
{
  "success": true,
  "data": {
    "subject": {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "name": "Algoritmos e Programação I"
    },
    "grades": [
      {
        "activity_id": 1,
        "activity_title": "Projeto Final",
        "activity_type": "activity",
        "is_team_activity": false,
        "max_score": 10.0,
        "due_date": "2025-06-30T23:59:00-03:00",
        "submission": {
          "id": 55,
          "status": "graded",
          "score": 8.5,
          "feedback": "Boa implementação, faltou tratar edge cases.",
          "is_graded": true,
          "is_late": false,
          "submitted_at": "2025-06-28T14:30:00-03:00",
          "graded_at": "2025-07-01T09:00:00-03:00"
        }
      }
    ]
  }
}
```

## Relatório de Notas da Turma

Notas de todos os alunos de uma turma, paginado por atividade. Apenas atividades com `has_grade: true` e status `published` aparecem neste relatório.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/enrollments/{code}/grades" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código da turma (path) |

### Resposta

```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "subject_name": "Algoritmos e Programação I"
    },
    "activities": [
      {
        "id": 1,
        "title": "Projeto Final",
        "type": "activity",
        "max_score": 10.0,
        "due_date": "2025-06-30T23:59:00-03:00"
      }
    ],
    "students": [
      {
        "student_code": "ALU2024001",
        "student_name": "Pedro Oliveira Santos",
        "student_email": "pedro.oliveira@aluno.edu.br",
        "grades": [
          {
            "activity_id": 1,
            "activity_title": "Projeto Final",
            "max_score": 10.0,
            "score": 8.5,
            "status": "graded",
            "is_late": false,
            "submitted_at": "2025-06-28T14:30:00-03:00",
            "graded_at": "2025-07-01T09:00:00-03:00"
          }
        ]
      }
    ]
  },
  "pagination": {
    "total": 1,
    "per_page": 50,
    "current_page": 1,
    "last_page": 1
  }
}
```

## Relatório de Submissões da Turma

Estatísticas de submissões por atividade de uma turma.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/enrollments/{code}/submissions" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código da turma (path) |

### Resposta

```json
{
  "success": true,
  "data": {
    "enrollment": {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "subject_name": "Algoritmos e Programação I",
      "students_count": 30
    },
    "activities": [
      {
        "activity_id": 1,
        "activity_title": "Projeto Final",
        "activity_type": "activity",
        "has_grade": true,
        "due_date": "2025-06-30T23:59:00-03:00",
        "max_score": 10.0,
        "statistics": {
          "total_students": 30,
          "submitted": 28,
          "not_submitted": 2,
          "graded": 25,
          "pending_grade": 3,
          "late_submissions": 1,
          "submission_rate": 93.3
        },
        "submissions": [
          {
            "student_id": 101,
            "status": "graded",
            "score": 8.5,
            "submitted_at": "2025-06-28T14:30:00-03:00",
            "graded_at": "2025-07-01T09:00:00-03:00"
          }
        ]
      }
    ]
  },
  "pagination": {
    "total": 1,
    "per_page": 50,
    "current_page": 1,
    "last_page": 1
  }
}
```

## Turmas do Aluno

Turmas em que um aluno está matriculado.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/students/{code}/enrollments" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código do aluno (path) |

### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "subject": {
        "code": "ALG001",
        "name": "Algoritmos e Programação I"
      },
      "courses": [
        { "code": "CC001", "name": "Ciência da Computação" },
        { "code": "ENG001", "name": "Engenharia de Software" }
      ],
      "professors": [
        { "code": "PROF001", "name": "Dr. João Silva" },
        { "code": "PROF002", "name": "Dra. Maria Costa" }
      ]
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 50,
    "current_page": 1,
    "last_page": 1
  }
}
```

A disciplina é uma entidade global da instituição e o vínculo com cursos é feito na turma. Por isso `courses` aparece como array no nível da turma, e não dentro de `subject`. Detalhes em [Conceitos Fundamentais](conceitos-fundamentais).

## Turmas do Professor

Turmas vinculadas a um professor, com filtro opcional por semestre.

### Endpoint

<ApiEndpoint method="GET" path="/integration/v1/professors/{code}/subjects" />

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `code` | string | Sim | Código do professor (path) |
| `semester` | string | Não | Filtra por semestre, ex: `2025.1` (query) |

### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": 143,
      "code": "ALG001-2025.1",
      "semester": "2025.1",
      "subject": {
        "id": 12,
        "code": "ALG001",
        "name": "Algoritmos e Programação I"
      },
      "courses": [
        { "id": 3, "code": "CC001", "name": "Ciência da Computação" }
      ],
      "students_count": 28
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 50,
    "current_page": 1,
    "last_page": 1
  }
}
```
