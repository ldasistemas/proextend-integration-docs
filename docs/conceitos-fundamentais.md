---
sidebar_position: 3
title: Conceitos Fundamentais
---

# Conceitos Fundamentais

## Introdução

Este documento detalha as entidades do sistema de integração ProExtend e seus relacionamentos.

## Modelo de Dados

### Hierarquia de Entidades

```
Instituição
├── Unidades (Units)
│   └── Áreas (Areas)
│       └── Cursos (Courses)
│           └── Disciplinas Base (Subjects)
│
├── Professores (Professors)
│
├── Alunos (Students)
│
└── Turmas (Enrollments)
    ├── Disciplina Base
    ├── Professor
    └── Alunos
```

## Entidades Detalhadas

### 1. Unidade (Unit)

Campus ou unidade física da instituição.

#### Atributos

- **code**: Código único da unidade (ex: "CAMPUS_CENTRO", "SEDE")
- **name**: Nome da unidade
- **address**: Endereço completo (opcional)

#### Exemplo

```json
{
  "code": "CAMPUS_CENTRO",
  "name": "Campus Centro",
  "address": "Rua Principal, 123 - Centro, São Paulo - SP"
}
```

#### Características

- Não depende de outras entidades
- Pode conter múltiplas áreas
- Deve ser sincronizada antes das demais entidades

---

### 2. Área (Area)

Área de conhecimento que agrupa cursos relacionados.

#### Atributos

- **code**: Código único da área (ex: "TECH", "HEALTH") 
- **name**: Nome da área 
- **unit_code**: Código da unidade (obrigatório, deve existir)
- **responsible_email** OU **responsible_code**

#### Exemplo

```json
{
  "code": "TECH",
  "name": "Tecnologia da Informação",
  "unit_code": "CAMPUS_CENTRO",
  "responsible_email": "coord.tech@faculdade.edu.br"
}
```

#### Características

- **Depende de**: Unidade (Unit)
- Agrupa cursos relacionados
- **Deve ter coordenador responsável que seja Administrador ativo**

---

### 3. Curso (Course)

Curso de graduação ou pós-graduação oferecido pela instituição.

#### Atributos

- **code**: Código único do curso (ex: "CC001", "ENF001") 
- **name**: Nome do curso 
- **description**: Descrição detalhada (opcional)
- **area_code**: Código da área (obrigatório, deve existir)
- **unit_code**: Código da unidade (obrigatório, deve existir)
- **responsible_email** OU **responsible_code**

#### Exemplo

```json
{
  "code": "CC001",
  "name": "Ciência da Computação",
  "description": "Bacharelado em Ciência da Computação - Duração 4 anos",
  "area_code": "TECH",
  "unit_code": "CAMPUS_CENTRO",
  "responsible_code": "ADMIN001"
}
```

#### Características

- **Depende de**: Unidade (Unit) e Área (Area)
- **Deve ter coordenador responsável que seja Administrador ativo**
- Pode usar `responsible_email` (email) ou `responsible_code` (código do Administrador)

---

### 4. Disciplina Base (Subject)

Componente curricular que faz parte da grade do curso.

#### Atributos

- **code**: Código único da disciplina (ex: "ALG001", "LIBRAS") 
- **name**: Nome da disciplina 
- **description**: Ementa ou descrição (opcional)
- **course_code**: Código do curso (obrigatório, deve existir)
- **type**: Tipo da disciplina (opcional, padrão: "obrigatoria")
  - `obrigatoria`: Disciplina obrigatória
  - `optativa`: Disciplina optativa
  - `eletiva`: Disciplina eletiva

#### Exemplo

```json
{
  "code": "ALG001",
  "name": "Algoritmos e Programação I",
  "description": "Introdução a algoritmos e lógica de programação",
  "course_code": "CC001",
}
```

#### Características

- **Depende de**: Curso
- Representa componente curricular permanente (sem vínculo com período letivo ou alunos)
- Utilizada como base para criação de Turmas

---

### 5. Professor (Professor)

Docente que leciona disciplinas na instituição.

#### Atributos

- **code**: Código único do professor (matrícula, CPF ou código funcional) 
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, aceita formatado ou sem formatação)
  - Formato 1: `12345678901` (11 dígitos)
  - Formato 2: `123.456.789-01` (formatado)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **area_code**: Código da área de atuação (opcional)

#### Exemplo

```json
{
  "code": "PROF001",
  "name": "Dr. João Silva",
  "email": "joao.silva@faculdade.edu.br",
  "cpf": "12345678901",
  "phone": "11999999999",
  "area_code": "TECH"
}
```

#### Características

- Não depende de outras entidades (pode ser sincronizado a qualquer momento)
- Email deve ser único
- CPF é campo opcional (se fornecido, deve ser único e válido)
- Phone (telefone) aceita apenas dígitos (sem formatação: parênteses, espaços ou hífens)
- Sistema cria credenciais de acesso automaticamente
- Pode ser vinculado a múltiplas turmas (Enrollments)

---

### 6. Aluno (Student)

Discente matriculado em um curso da instituição.

#### Atributos

- **code**: Código único do aluno (matrícula, CPF ou RA) 
- **name**: Nome completo 
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, aceita formatado ou sem formatação)
  - Formato 1: `12345678901` (11 dígitos)
  - Formato 2: `123.456.789-01` (formatado)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **course_code**: Código do curso (obrigatório, deve existir)

#### Exemplo

```json
{
  "code": "ALU2024001",
  "name": "Pedro Oliveira Santos",
  "email": "pedro.oliveira@aluno.edu.br",
  "cpf": "11122233344",
  "phone": "11977777777",
  "course_code": "CC001"
}
```

#### Características

- Não depende de outras entidades, exceto Curso (Course)
- Email deve ser único
- CPF é campo opcional (se fornecido, deve ser único e válido)
- Phone (telefone) aceita apenas dígitos (sem formatação: parênteses, espaços ou hífens)
- Campo `code` aceita matrícula, CPF ou RA do sistema origem
- Sistema cria credenciais de acesso automaticamente
- Pode ser vinculado a múltiplas turmas (Enrollments)

---

### 7. Turma (Enrollment)

Instância de uma Disciplina Base em período letivo específico, com professor responsável e alunos matriculados.

#### Atributos

- **code**: Código único da turma (ex: "ALG001-2025.1", "TURMA001")
- **subject_code**: Código da disciplina base (obrigatório, deve existir)
- **professor_code**: Código do professor responsável (obrigatório, deve existir)
- **semester**: Período letivo (obrigatório, formato: "YYYY.N")
- **student_codes**: Array de códigos de alunos (opcional, devem existir se fornecidos)

#### Exemplo

```json
{
  "code": "ALG001-2025.1",
  "subject_code": "ALG001",
  "professor_code": "PROF001",
  "semester": "2025.1",
  "student_codes": ["ALU2024001", "ALU2024002", "ALU2024003"]
}
```

#### Características

- **Depende de**: Disciplina Base, Professor e Alunos
- Representa oferta de disciplina em período letivo
- Vincula disciplina, professor, alunos e período acadêmico
- Sincronizações com `code` existente atualizam professor e lista de alunos
- Alunos removidos da lista são automaticamente desvinculados da turma

---

## Diferença: Disciplina Base vs Turma

Distinção fundamental do modelo de dados:

### Disciplina Base (Subject)

Registro permanente do componente curricular no catálogo do curso.

```json
{
  "code": "ALG001",
  "name": "Algoritmos e Programação I",
  "course_code": "CC001"
}
```

- Sem vínculo com período letivo
- Sem vínculo com professor
- Sem vínculo com alunos
- Utilizada como base para criação de turmas

### Turma (Enrollment)

Instância da disciplina base em período letivo específico, com professor e alunos vinculados.

```json
{
  "code": "ALG001-2025.1",
  "subject_code": "ALG001",
  "professor_code": "PROF001",
  "semester": "2025.1",
  "student_codes": ["ALU2024001", "ALU2024002"]
}
```

- Vinculada a período letivo específico
- Vinculada a professor responsável
- Vinculada a alunos matriculados
- Representa oferta efetiva da disciplina

## Campos Obrigatórios vs Opcionais

### Resumo por Entidade

| Entidade | Campos Obrigatórios | Campos Opcionais |
|----------|---------------------|------------------|
| Unidade (Unit) | code, name | address |
| Área (Area) | code, name, unit_code, responsible* |  |
| Curso (Course) | code, name, area_code, unit_code, responsible* | description |
| Disciplina Base (Subject) | code, name, course_code | description, type |
| Professor (Professor) | code, name, email | cpf, phone, area_code |
| Aluno (Student) | code, name, email, course_code | cpf, phone |
| Turma (Enrollment) | code, subject_code, professor_code, semester | student_codes |

\* Área (Area) e Curso (Course) requerem `responsible_email` **OU** `responsible_code` (deve ser Administrador ativo)

## Boas Práticas

### Regras de Validação de Campos

| Campo | Regra | Formato/Exemplo |
|-------|-------|-----------------|
| **code** | Obrigatório, único por tipo de entidade | Máximo 255 caracteres |
| **name** | Obrigatório | Máximo 255 caracteres |
| **cpf** | Opcional (Professor/Student), aceita formatação | `"12345678901"` ou `"123.456.789-01"` |
| **email** | Formato válido, único | `"usuario@dominio.com"` |
| **phone** | Opcional, apenas dígitos | `"11999999999"` (10-11 dígitos) |
| **semester** | Formato ano.período | `"2025.1"`, `"2025.2"` |
| **responsible** | Obrigatório (Área/Curso), deve ser Administrador ativo | email ou code de Admin |
| **codes** de referência | Devem existir previamente | `area_code`, `unit_code`, `course_code`, etc. |

**Validações automáticas**:
- CPF: Valida formato e dígitos verificadores (aceita formatado ou não)
- Email: Valida formato e unicidade
- Phone: Aceita apenas dígitos numéricos
- Codes: Valida unicidade dentro do tipo de entidade e tamanho máximo 255
- Referências: Valida existência antes de criar vínculo
- Responsible: Valida que seja Admin

### Utilização de Identificadores

Utilize identificadores existentes no sistema origem (ERP):
- Matrícula de professor: `"PROF-2023-001"`
- Código de disciplina: `"CC-ALG-001"`
- RA de aluno: `"202410001"`

Os identificadores devem corresponder aos codes já utilizados no ERP institucional.

## Glossário

- **Unidade (Unit)**: Campus ou unidade organizacional da instituição
- **Área (Area)**: Área de conhecimento que agrupa cursos relacionados
- **Curso (Course)**: Programa acadêmico de graduação ou pós-graduação
- **Disciplina Base (Subject)**: Componente curricular permanente (sem vínculo temporal)
- **Turma (Enrollment)**: Instância de disciplina base em período letivo, com professor e alunos
- **Professor (Professor)**: Docente responsável por ministrar disciplinas
- **Aluno (Student)**: Discente matriculado em curso
- **Code**: Identificador único do sistema origem (ERP)
- **Período Letivo (Semester)**: Semestre acadêmico (formato "YYYY.N")

## Próximos Passos

1. Configure [Autenticação](autenticacao)
2. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao)
3. Entenda [Identificadores e Codes](identificadores-e-codes)

## Suporte

Para dúvidas sobre as entidades e conceitos, consulte a equipe técnica da ProExtend.
