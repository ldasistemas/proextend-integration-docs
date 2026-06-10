---
sidebar_position: 7
title: Tratamento de Erros
---

# Tratamento de Erros

Todos os erros da API seguem o mesmo formato base, o **`ApiError`**, independentemente do endpoint, método HTTP ou status. Isso permite tratamento programático sem parsing de mensagens.

:::warning[Breaking change]
Versões anteriores retornavam erros de validação como dicionário `{"field": ["mensagem"]}` e itens de sync com falha como string em `error`. Agora **toda resposta de erro** traz um array `errors[]` de objetos `ApiError` no mesmo formato.
:::

## Como funciona

Toda resposta de erro contém um array `errors[]`. Cada item desse array é um `ApiError` que carrega no mínimo dois campos: `type` (categoria programática) e `message` (texto descritivo).

```json
{
  "success": false,
  "message": "Turma 'ALG001-2099.1' não encontrada.",
  "errors": [
    {
      "type": "not_found",
      "message": "Turma 'ALG001-2099.1' não encontrada.",
      "entity": "enrollment",
      "code": "ALG001-2099.1"
    }
  ]
}
```

Os campos extras (`entity`, `code`, `field`, `rule`, etc.) variam conforme o `type`. A tabela abaixo é a principal ferramenta de decisão: olhe o `type`, identifique a categoria e os campos esperados.

| `type` | HTTP | Quando acontece |
|---|---|---|
| `validation_failed` | 422 | Schema do request inválido (campo obrigatório ausente, formato errado) |
| `code_not_found` | 200 (sync) ou 404 | Code referenciado não existe (ex: turma com `subject_code` inexistente) |
| `constraint_violation` | 200 (sync) ou 422 | Regra de negócio violada (ex: turma sem nenhum curso vinculado) |
| `not_found` | 404 | Recurso buscado por code não existe |
| `authentication_failed` | 401 ou 403 | API Key ausente, inválida, desativada ou com scope insuficiente |
| `rate_limit_exceeded` | 429 | Limite de requisições por minuto atingido |
| `internal` | 200 (sync) ou 500 | Falha inesperada do servidor. Em sync, o item falhado vai para `data.errors[]` e o batch continua (HTTP 200). Fora de sync, vira HTTP 500 |

## Em que parte da resposta os erros aparecem

A localização do `errors[]` depende do cenário. Há dois lugares possíveis:

**Na raiz da resposta**: o request inteiro falhou. Vale para validação (422), 404, single-item (422), autenticação (401/403) e rate limit (429).

**Em `data.errors[]`**: o request foi aceito mas alguns itens falharam (sync com falhas parciais). O `success` continua `true` e o HTTP é 200; cada item que falhou vira um objeto com `index`, `code` e seu próprio `errors[]`.

### Exemplo de falha em endpoint single (errors na raiz)

```json
{
  "success": false,
  "message": "Turma 'ALG001-2025.1' ou aluno 'ALU2024999' não encontrado.",
  "errors": [
    {
      "type": "not_found",
      "message": "Turma 'ALG001-2025.1' ou aluno 'ALU2024999' não encontrado.",
      "entity": "enrollment",
      "code": "ALG001-2025.1"
    }
  ]
}
```

### Sync com falhas parciais (200)

Quando um endpoint de sincronização processa um batch, cada item é tratado individualmente. Os que dão certo entram em `created` ou `updated`; os que falham entram em `data.errors[]` e o batch continua, retornando HTTP 200. Sempre verifique `data.failed` para detectar falhas, mesmo com `success: true`.

```json
{
  "success": true,
  "data": {
    "created": 8,
    "updated": 1,
    "failed": 1,
    "errors": [
      {
        "index": 2,
        "code": "ALG001-2025.1",
        "errors": [
          {
            "type": "code_not_found",
            "message": "Professores não encontrado(a)s: PROF999, PROF888",
            "entity": "professor",
            "missing": ["PROF999", "PROF888"]
          }
        ]
      }
    ]
  }
}
```

`index` é a posição do item no array enviado (0-based) e `code` é o identificador do item.

#### Dois níveis de `errors`

Existem dois arrays chamados `errors` em níveis diferentes:

- **`data.errors[]`** (externo): a lista de **itens** do batch que falharam. Sempre tem o mesmo tamanho que `failed`.
- **`data.errors[N].errors[]`** (interno): a lista de **falhas daquele item específico**. Um único item pode acumular múltiplos erros quando tem várias referências inválidas ao mesmo tempo.

Em vez de reportar uma falha por vez, a API acumula tudo e devolve junto. Acumulação por item se aplica a:

- **Turma**: `subject_code` + `course_codes` + `professor_codes` + `student_codes` (até 4 erros)
- **Gestor de Área**: `area_codes` + `unit_code` (até 2 erros)
- **Curso**: `area_code` + `unit_code` (até 2 erros)

#### Batch misto: sucessos e falhas convivem

O exemplo abaixo envia 3 itens onde o 1º e o 3º falham e o 2º é criado normalmente:

```json
{
  "success": true,
  "data": {
    "created": 1,
    "updated": 0,
    "failed": 2,
    "errors": [
      {
        "index": 0,
        "code": "GEST_A",
        "errors": [
          { "type": "code_not_found", "message": "Áreas não encontrado(a)s: AX, AY", "entity": "area", "missing": ["AX", "AY"] },
          { "type": "code_not_found", "message": "Unidade 'UX' não encontrado(a).", "entity": "unit", "code": "UX" }
        ]
      },
      {
        "index": 2,
        "code": "GEST_C",
        "errors": [
          { "type": "code_not_found", "message": "Unidade 'UY' não encontrado(a).", "entity": "unit", "code": "UY" }
        ]
      }
    ]
  }
}
```

Note que `index: 1` não aparece porque foi sucesso. Use `index` para mapear cada falha de volta ao item original que você enviou.

## Cenários comuns

Os blocos abaixo mostram um exemplo de cada categoria de erro.

<Accordion>

<AccordionItem value="validacao" title="Validação de schema (422)">

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": [
    {
      "type": "validation_failed",
      "message": "O modo de sincronização deve ser 'add' ou 'replace'.",
      "field": "enrollments.0.professor_sync_mode"
    }
  ]
}
```

O campo `field` vem em dot-notation, apontando exatamente onde está o problema no body enviado.

</AccordionItem>

<AccordionItem value="auth" title="Autenticação e autorização (401 / 403)">

```json
{
  "success": false,
  "message": "Escopo 'write' não autorizado.",
  "errors": [
    {
      "type": "authentication_failed",
      "message": "Escopo 'write' não autorizado.",
      "rule": "insufficient_scope",
      "required_scope": "write",
      "client_scope": "read"
    }
  ]
}
```

O `rule` indica a causa exata. Quando o scope da chave não cobre a operação, `required_scope` e `client_scope` aparecem para facilitar o diagnóstico.

</AccordionItem>

<AccordionItem value="rate-limit" title="Rate limit (429)">

```json
{
  "success": false,
  "message": "Limite de requisições excedido. Tente novamente em alguns instantes.",
  "errors": [
    {
      "type": "rate_limit_exceeded",
      "message": "Limite de requisições excedido. Tente novamente em alguns instantes.",
      "rule": "rate_limit_exceeded",
      "limit": 60,
      "retry_after": 60
    }
  ]
}
```

Além do JSON, os headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` e `Retry-After` vêm preenchidos em **todas** as respostas (não só nas bloqueadas), permitindo monitorar o consumo antes de atingir o limite.

</AccordionItem>

</Accordion>

## Referência completa de campos

Cada `type` carrega um conjunto específico de campos contextuais além de `type` e `message`. A tabela é a referência canônica.

| `type` | Campos contextuais |
|---|---|
| `validation_failed` | `field` (dot-notation) |
| `code_not_found` (um code) | `entity`, `code` |
| `code_not_found` (múltiplos) | `entity`, `missing[]` |
| `constraint_violation` | `entity`, `rule`, `invalid_codes[]` (quando aplicável) |
| `not_found` | `entity`, `code` |
| `authentication_failed` (scope) | `rule`, `required_scope`, `client_scope` |
| `authentication_failed` (auth) | `rule` |
| `rate_limit_exceeded` | `rule`, `limit`, `retry_after` |
| `internal` | `exception_class` |

## Regras de negócio (`constraint_violation`)

O campo `rule` permite identificar a regra violada sem parsear a mensagem.

| `rule` | Endpoint | Significado |
|---|---|---|
| `at_least_one_professor` | `/enrollments/sync` | Item sem `professor_codes` |
| `at_least_one_course` | `/enrollments/sync`, `/coordinators/sync` | Item sem `course_codes` |
| `at_least_one_area` | `/area-managers/sync` | Item sem `area_codes` |
| `enrollment_without_courses` | `/enrollments/sync`, `POST /enrollments/{code}/students/{code}` | Turma sem cursos vinculados |
| `user_suspended` | `/sso/generate-token` | Usuário com `suspended_at` não nulo |

## Regras de autenticação e rate limit

| `rule` | HTTP | Significado |
|---|---|---|
| `unauthenticated` | 401 | Header `Authorization` ausente |
| `invalid_api_key` | 401 | API Key não corresponde a nenhum cliente |
| `api_key_disabled` | 403 | API Key existe mas está desativada no painel |
| `insufficient_scope` | 403 | Scope da API Key não permite a operação |
| `rate_limit_exceeded` | 429 | Limite de requisições por minuto atingido |
