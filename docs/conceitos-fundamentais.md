---
sidebar_position: 3
title: Conceitos Fundamentais
---

# Conceitos Fundamentais

## Introdução

Este documento detalha as entidades do sistema de integração ProExtend e seus relacionamentos.

## Modelo de Dados

### Hierarquia de Entidades

```mermaid
flowchart LR

    %% Instituição
    INST[Instituição]

    %% Estrutura principal
    INST --> UNI[Unidades]
    INST --> AREA[Áreas]
    INST --> DISC[Disciplinas Base]
    INST --> PROF[Professores]
    INST --> ALU[Alunos]

    %% Unidade
    subgraph SG_UNI [ ]
        UNI --> DIR[Diretores]
        UNI --> ASSES[Assessores Pedagógicos]
        UNI --> CURSO[Cursos]
    end

    %% Área
    subgraph SG_AREA [ ]
        AREA --> GEST[Gestores de Área]
        AREA --> CURSO
    end

    %% Curso
    subgraph SG_CURSO [ ]
        CURSO --> COORD[Coordenadores]
        CURSO --> TURMA[Turmas]
    end

    %% Turmas
    subgraph SG_TURMAS [ ]
        DISC --> TURMA
        PROF --> TURMA
        ALU --> TURMA
    end

    style SG_UNI fill:transparent,stroke:none
    style SG_AREA fill:transparent,stroke:none
    style SG_CURSO fill:transparent,stroke:none
    style SG_TURMAS fill:transparent,stroke:none
```

:::note
Áreas e Disciplinas Base são entidades **globais da instituição**: não pertencem a uma unidade ou curso específico. O vínculo entre Curso e Área (e entre Curso e Unidade) acontece no próprio Curso. O vínculo entre Curso e Disciplina acontece na Turma (via `course_codes`).
:::

## Entidades Detalhadas

### 1. Unidade (Unit)

Campus ou unidade física da instituição.

#### Atributos

- **code**: Identificador único do sistema de origem (ERP). Usado em todas as entidades para mapeamento idempotente. Exemplo: "CAMPUS_CENTRO", "SEDE"
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
- Possui Diretores (Directors), Assessores Pedagógicos (Pedagogical Advisors), Áreas (Areas) e Cursos (Courses) vinculados

---

### 2. Diretor (Director)

Diretor de unidade, responsável pela gestão de um campus.

#### Atributos

- **code**: Código único do diretor
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **unit_code**: Código da unidade que dirige (obrigatório, deve existir)
- **active**: Controla o status (opcional)
  - `true` → reativa (remove suspensão)
  - `false` → suspende
  - Omitir → não altera o status atual

#### Exemplo

```json
{
  "code": "DIR001",
  "name": "Roberto Lima",
  "email": "roberto.lima@faculdade.edu.br",
  "unit_code": "CAMPUS_CENTRO"
}
```

#### Características

- **Depende de**: Unidade (Unit)
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

O Diretor tem visibilidade sobre todas as turmas da sua unidade. Como a unidade agrupa áreas, e cada área agrupa cursos, o acesso percorre toda essa hierarquia: qualquer turma vinculada a um curso de qualquer área da unidade estará visível.

```mermaid
flowchart TD
    DIR["Diretor\n(ex: DIR001)"]
    UNI["Unidade\n(ex: CAMPUS_CENTRO)"]
    A1["Área: Tecnologia"]
    A2["Área: Saúde"]
    C1["Curso: Ciência da Computação"]
    C2["Curso: Sistemas de Informação"]
    C3["Curso: Enfermagem"]
    T["Turmas de todos\nos cursos da unidade"]

    DIR -->|dirige| UNI
    UNI --> A1 --> C1 --> T
    A1 --> C2 --> T
    UNI --> A2 --> C3 --> T
```

---

### 3. Assessor Pedagógico (Pedagogical Advisor)

Assessor responsável pelo suporte pedagógico em uma unidade.

#### Atributos

- **code**: Código único do assessor
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **unit_code**: Código da unidade de atuação (obrigatório, deve existir)
- **active**: Controla o status (opcional)
  - `true` → reativa (remove suspensão)
  - `false` → suspende
  - Omitir → não altera o status atual

#### Exemplo

```json
{
  "code": "ASSES001",
  "name": "Fernanda Costa",
  "email": "fernanda.costa@faculdade.edu.br",
  "unit_code": "CAMPUS_CENTRO"
}
```

#### Características

- **Depende de**: Unidade (Unit)
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

O Assessor Pedagógico tem a mesma visibilidade de turmas que o Diretor (Director): acesso a todas as turmas de todos os cursos e áreas da unidade. A diferença está no papel dentro da instituição, não no escopo de acesso à plataforma.

---

### 4. Área (Area)

Área de conhecimento que agrupa cursos relacionados.

#### Atributos

- **code**: Código único da área (exemplo: "TECH", "HEALTH")
- **name**: Nome da área

#### Exemplo

```json
{
  "code": "TECH",
  "name": "Tecnologia da Informação"
}
```

#### Características

- Não depende de outras entidades: é uma entidade **global da instituição**
- O vínculo com unidade acontece através do curso (cada curso indica sua unidade via `unit_code`)
- Possui Gestores de Área (Area Managers) e Cursos (Courses) vinculados

---

### 5. Gestor de Área (Area Manager)

Gestor responsável por uma ou mais áreas de conhecimento, com escopo restrito a uma unidade.

#### Atributos

- **code**: Código único do gestor
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **area_codes**: Array de códigos das áreas que gerencia (obrigatório, mínimo 1)
- **area_sync_mode**: Modo de sincronização de áreas (opcional, padrão: `replace`). Aceita `add` ou `replace`. Comportamento detalhado em [Fluxo de Sincronização - Modos de sincronização](fluxo-de-sincronizacao#modos-de-sincronização-add-vs-replace)
- **unit_code**: Código da unidade do gestor (obrigatório, deve existir). Restringe o escopo às turmas da unidade
- **active**: Controla o status (opcional)
  - `true` → reativa (remove suspensão)
  - `false` → suspende
  - Omitir → não altera o status atual

#### Exemplo

```json
{
  "code": "GEST001",
  "name": "Carlos Mendes",
  "email": "carlos.mendes@faculdade.edu.br",
  "area_codes": ["TECH", "ENG"],
  "unit_code": "CAMPUS_CENTRO"
}
```

#### Características

- **Depende de**: Áreas (Areas) e Unidade (Unit)
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

O Gestor de Área tem visibilidade sobre todas as turmas dos cursos pertencentes às áreas que gerencia, **restritas à sua unidade**. Como a área é global da instituição, sem `unit_code` o gestor veria turmas da mesma área em qualquer campus. Por isso a unidade é obrigatória e funciona como filtro de escopo.

```mermaid
flowchart TD
    GEST["Gestor de Área\n(ex: GEST001)\nunit: CAMPUS_CENTRO"]
    A1["Área: Tecnologia"]
    A2["Área: Engenharia"]
    C1["Curso CC\nunit: CAMPUS_CENTRO"]
    C2["Curso ENG\nunit: CAMPUS_CENTRO"]
    C3["Curso CC\nunit: CAMPUS_NORTE\n(fora do escopo)"]
    T["Turmas visíveis"]
    X["Turmas fora\ndo escopo"]

    GEST -->|gerencia| A1 --> C1 --> T
    GEST -->|gerencia| A2 --> C2 --> T
    A1 --> C3 --> X
```

---

### 6. Curso (Course)

Curso de graduação ou pós-graduação oferecido pela instituição.

#### Atributos

- **code**: Código único do curso (exemplo: "CC001", "ENF001")
- **name**: Nome do curso
- **description**: Descrição detalhada (opcional)
- **area_code**: Código da área (obrigatório, deve existir)
- **unit_code**: Código da unidade (obrigatório, deve existir)

#### Exemplo

```json
{
  "code": "CC001",
  "name": "Ciência da Computação",
  "description": "Bacharelado em Ciência da Computação - Duração 4 anos",
  "area_code": "TECH",
  "unit_code": "CAMPUS_CENTRO"
}
```

#### Características

- **Depende de**: Unidade (Unit) e Área (Area)
- Possui Coordenadores (Coordinators) e Disciplinas Base (Subjects) vinculadas

---

### 7. Coordenador (Coordinator)

Coordenador de um ou mais cursos, responsável pela gestão acadêmica.

#### Atributos

- **code**: Código único do coordenador
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **course_codes**: Array de códigos dos cursos que coordena (obrigatório, mínimo 1)
- **course_sync_mode**: Modo de sincronização de cursos (opcional, padrão: `replace`). Aceita `add` ou `replace`. Comportamento detalhado em [Fluxo de Sincronização - Modos de sincronização](fluxo-de-sincronizacao#modos-de-sincronização-add-vs-replace)
- **active**: Controla o status (opcional)
  - `true` → reativa (remove suspensão)
  - `false` → suspende
  - Omitir → não altera o status atual

#### Exemplo

```json
{
  "code": "COORD001",
  "name": "Prof. Ana Souza",
  "email": "ana.souza@faculdade.edu.br",
  "cpf": "11122233344",
  "phone": "11988887777",
  "course_codes": ["CC001", "SI001"]
}
```

#### Características

- **Depende de**: Cursos (Courses)
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

O Coordenador tem visibilidade sobre todas as turmas dos cursos que coordena. Um coordenador pode coordenar mais de um curso e enxerga as turmas de todos eles. Turmas de cursos não coordenados não são acessíveis, mesmo que compartilhem disciplinas via `course_codes`.

```mermaid
flowchart LR
    COORD["Coordenador\n(ex: COORD001)"]
    C1["Curso CC001"]
    C2["Curso SI001"]
    T1["Turmas de CC001"]
    T2["Turmas de SI001"]

    COORD -->|coordena| C1 --> T1
    COORD -->|coordena| C2 --> T2
```

---

### 8. Disciplina Base (Subject)

Componente curricular do catálogo da instituição. A mesma disciplina base pode ser usada por turmas de cursos diferentes. O vínculo curso ↔ disciplina é definido na Turma (Enrollment) via `course_codes`.

#### Atributos

- **code**: Código único da disciplina (exemplo: "ALG001", "LIBRAS")
- **name**: Nome da disciplina

#### Exemplo

```json
{
  "code": "ALG001",
  "name": "Algoritmos e Programação I",
  "type": "obrigatoria"
}
```

#### Características

- Não depende de outras entidades: é uma entidade **global da instituição**
- Representa componente curricular permanente, sem vínculo com período letivo, curso ou alunos
- O vínculo curso ↔ disciplina existe apenas na Turma (Enrollment), via campo `course_codes`
- Possui Turmas (Enrollments) vinculadas

---

### 9. Turma (Enrollment)

Instância de uma Disciplina Base em período letivo específico, com um ou mais professores responsáveis e alunos matriculados.

#### Atributos

- **code**: Código único da turma (exemplo: "ALG001-2025.1", "TURMA001")
- **subject_code**: Código da disciplina base (obrigatório, deve existir)
- **course_codes**: Array de códigos dos cursos vinculados à turma (obrigatório, pelo menos um; aceita `course_code` singular por retrocompatibilidade). É na turma que o vínculo curso ↔ disciplina é definido
- **course_sync_mode**: Modo de sincronização de cursos (opcional, padrão: `replace`)
- **professor_codes**: Array de códigos de professores (obrigatório, pelo menos um; aceita `professor_code` singular por retrocompatibilidade)
- **professor_sync_mode**: Modo de sincronização de professores (opcional, padrão: `replace`)
- **semester**: Semestre acadêmico (obrigatório, formato: "YYYY.N", ex: `"2025.1"`, `"2025.2"`)
- **student_codes**: Array de códigos de alunos (opcional, devem existir se fornecidos)
- **student_sync_mode**: Modo de sincronização de alunos (opcional, padrão: `replace`)

Os três `*_sync_mode` aceitam `add` (preserva os vínculos existentes e adiciona os novos) ou `replace` (substitui pelos enviados). Detalhes e exemplos em [Fluxo de Sincronização - Modos de sincronização](fluxo-de-sincronizacao#modos-de-sincronização-add-vs-replace).

#### Exemplo

```json
{
  "code": "ALG001-2025.1",
  "subject_code": "ALG001",
  "course_codes": ["CC001", "SI001"],
  "professor_codes": ["PROF001", "PROF002"],
  "semester": "2025.1",
  "student_codes": ["ALU2024001", "ALU2024002", "ALU2024003"]
}
```

#### Elegibilidade de Alunos

Toda disciplina base pertence a um curso. Ao criar uma turma, os alunos elegíveis para matrícula são, por padrão, os alunos desse curso.

```mermaid
flowchart LR
    DISC["Disciplina Base\n(ex: Ética e Democracia)"]
    CURSO_BASE["Curso base\n(ex: Administração)"]
    TURMA["Turma\n(ex: ETICA-2025.1)"]
    ALU_BASE["Alunos de Administração\n✓ elegíveis por padrão"]

    DISC -->|pertence a| CURSO_BASE
    CURSO_BASE -->|origina| TURMA
    TURMA --> ALU_BASE
```

O campo `course_codes` permite vincular cursos adicionais à turma, expandindo a elegibilidade para alunos desses cursos. Útil para disciplinas compartilhadas entre diferentes cursos.

```mermaid
flowchart LR
    TURMA["Turma\n(ex: ETICA-2025.1)"]
    CURSO_BASE["Administração\n(curso da disciplina)"]
    CURSO_A["Direito\n(via course_codes)"]
    CURSO_B["Ciências Sociais\n(via course_codes)"]

    ALU1["Alunos de Administração"]
    ALU2["Alunos de Direito"]
    ALU3["Alunos de Ciências Sociais"]

    TURMA --- CURSO_BASE --> ALU1
    TURMA --- CURSO_A --> ALU2
    TURMA --- CURSO_B --> ALU3
```

#### Múltiplos Professores

O campo `professor_codes` permite vincular mais de um professor à mesma turma. Todos os professores vinculados têm o mesmo nível de acesso à turma: podem criar atividades, avaliar alunos e visualizar submissões igualmente. Útil para turmas com co-docência ou quando dois professores dividem a responsabilidade pela disciplina.

```mermaid
flowchart LR
    TURMA["Turma\n(ex: ALG001-2025.1)"]
    P1["Prof. João Silva\n(PROF001)"]
    P2["Prof. Maria Santos\n(PROF002)"]
    ACESSO["Mesmo acesso:\ncriar atividades,\navaliar alunos,\nver submissões"]

    TURMA --> P1 --> ACESSO
    TURMA --> P2 --> ACESSO
```

#### Características

- **Depende de**: Disciplina Base (Subject), Professores (Professors) e Alunos (Students)
- Sincronizações com `code` existente adicionam professores novos sem remover os existentes
- O comportamento dos alunos é controlado por `student_sync_mode` (`replace` ou `add`)
- Alunos removidos da lista (em modo `replace`) são automaticamente desvinculados

---

### 10. Professor (Professor)

Docente que leciona disciplinas na instituição.

#### Atributos

- **code**: Código único do professor (matrícula, CPF ou código funcional)
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **area_code**: Código da área de atuação (opcional)
- **active**: Controla o status do professor (opcional)
  - `true` → reativa o professor (remove suspensão)
  - `false` → suspende o professor
  - Omitir → não altera o status atual

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

- Não depende de outras entidades: pode ser sincronizado a qualquer momento
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

Um professor pode ministrar diversas turmas simultaneamente em diferentes disciplinas e semestres. Em cada turma que leciona, o professor tem acesso completo: pode criar e corrigir atividades, lançar notas e visualizar submissões dos alunos matriculados.

```mermaid
flowchart LR
    PROF["Professor\n(ex: PROF001)"]
    T1["Turma ALG001-2025.1"]
    T2["Turma BD001-2025.1"]
    T3["Turma POO-2025.2"]

    PROF -->|ministra| T1
    PROF -->|ministra| T2
    PROF -->|ministra| T3
```

---

### 11. Aluno (Student)

Discente matriculado em um curso da instituição.

#### Atributos

- **code**: Código único do aluno (matrícula, CPF ou RA)
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **course_code**: Código do curso (obrigatório, deve existir)
- **active**: Controla o status do aluno (opcional)
  - `true` → reativa o aluno (remove suspensão)
  - `false` → suspende o aluno
  - Omitir → não altera o status atual

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

- **Depende de**: Curso (Course)
- Campo `code` aceita matrícula, CPF ou RA do sistema de origem
- Sistema cria credenciais de acesso automaticamente
- Pode ser suspenso sem ser removido via campo `active: false`

Um aluno pode estar matriculado em diversas turmas ao mesmo tempo, correspondentes às disciplinas do seu semestre. Em cada turma à qual pertence, o aluno tem acesso para visualizar as atividades disponíveis, enviar submissões e acompanhar suas notas.

```mermaid
flowchart LR
    ALU["Aluno\n(ex: ALU2024001)"]
    T1["Turma ALG001-2025.1"]
    T2["Turma BD001-2025.1"]
    T3["Turma POO-2025.2"]

    ALU -->|matriculado em| T1
    ALU -->|matriculado em| T2
    ALU -->|matriculado em| T3
```

---

### 12. Administrador (Admin)

Usuário com acesso administrativo completo ao painel ProExtend. Diferentemente dos demais perfis, o Administrador não é gerenciado via integração: é cadastrado diretamente no painel e possui permissões que vão além do escopo da API, como criar e revogar integrações, fazer edições manuais em turmas, reenviar convites de acesso e gerenciar outros usuários da plataforma.

#### Atributos

- **code**: Código único do administrador
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, apenas 11 dígitos sem formatação, ex: `"12345678901"`)
- **phone**: Telefone (opcional, apenas dígitos 10-11 caracteres)
- **unit_code**: Código da unidade de atuação (opcional, deve existir se fornecido)
- **area_code**: Código da área de atuação (opcional, deve existir se fornecido)
- **course_code**: Código do curso de atuação (opcional, deve existir se fornecido)

#### Características

- Não é criado nem atualizado via integração: gerenciado exclusivamente pelo painel ProExtend

---

## Diferença: Disciplina Base vs Turma

A Disciplina Base é o registro permanente de um componente curricular no catálogo do curso, sem vínculo com período letivo, professores ou alunos. A Turma é a instância dessa disciplina em um semestre específico: é nela que professores e alunos são vinculados e as atividades acontecem.

Uma turma pode ter mais de um professor responsável via `professor_codes`, todos com o mesmo nível de acesso. Além disso, via `course_codes`, a turma pode ser vinculada a cursos adicionais além do curso da disciplina base, permitindo que alunos desses cursos também sejam matriculados. Uma mesma Disciplina Base pode originar turmas em semestres diferentes, cada uma com professores e alunos distintos.

```mermaid
flowchart LR
    DISC["Disciplina Base\nÉtica e Democracia\nCurso: Administração"]

    DISC -->|2025.1| T1["Turma ETI001-2025.1"]
    DISC -->|2025.2| T2["Turma ETI001-2025.2"]

    T1 --> P1["Prof. João\nProf. Maria"]
    T1 --> A1["Alunos de Administração\nAlunos de Direito\nAlunos de Ciências Sociais"]

    T2 --> P2["Prof. Ana"]
    T2 --> A2["Alunos de Administração"]
```


## Boas Práticas

### Regras de Validação de Campos

| Campo | Regra | Formato/Exemplo |
|-------|-------|-----------------|
| **code** | Obrigatório, único por tipo de entidade | Máximo 255 caracteres |
| **name** | Obrigatório | Máximo 255 caracteres |
| **cpf** | Opcional (Professor/Student), apenas 11 dígitos | `"12345678901"` |
| **email** | Formato válido, único | `"usuario@dominio.com"` |
| **phone** | Opcional, apenas dígitos | `"11999999999"` (10-11 dígitos) |
| **semester** | Formato ano.período | `"2025.1"`, `"2025.2"` |
| **codes** de referência | Devem existir previamente | `area_code`, `unit_code`, `course_code`, etc. |

**Validações automáticas**:
- CPF: Valida formato e dígitos verificadores (apenas 11 dígitos sem formatação)
- Email: Valida formato e unicidade
- Phone: Aceita apenas dígitos numéricos
- `codes`: valida unicidade dentro do tipo de entidade e tamanho máximo 255
- Referências: Valida existência antes de criar vínculo

### Utilização de Identificadores

Recomenda-se utilizar os identificadores já existentes no sistema de origem (ERP). Os exemplos abaixo são sugestões de formato, não obrigatórios. Consulte [Identificadores e codes](identificadores-e-codes) para mais detalhes.
- Matrícula de professor: `"PROF-2023-001"`
- Código de disciplina: `"CC-ALG-001"`
- RA de aluno: `"202410001"`


## Próximos Passos

1. Configure [Autenticação](autenticacao)
2. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao)
3. Entenda [Identificadores e codes](identificadores-e-codes)
4. Consulte [Remoção de Entidades](remocao) para gerenciar o ciclo de vida dos dados
5. Veja [Relatórios e Consultas](relatorios) para leitura de atividades e notas
6. Monitore operações via [Logs de Integrações](logs-de-integracoes)

## Suporte

Para dúvidas sobre as entidades e conceitos, consulte a equipe técnica da ProExtend.
