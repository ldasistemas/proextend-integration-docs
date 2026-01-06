---
sidebar_position: 6
title: SSO (Single Sign-On)
---

# SSO (Single Sign-On)

## Introdução

A funcionalidade SSO (Single Sign-On - Login Único) permite que sistemas externos gerem tokens de acesso para login direto de usuários na plataforma ProExtend sem necessidade de credenciais.

**Casos de uso**:
- Integração com portais institucionais
- Acesso via emails automatizados
- Autenticação entre sistemas integrados
- Convites temporários

## Fluxo de Autenticação

O processo de autenticação SSO segue os seguintes passos:

```
1. Sistema Externo solicita geração de token
   ↓
2. Sistema Externo → API ProExtend
   POST /integration/v1/sso/generate-token
   {
     "user_code": "PROF001",
     "expires_in": 86400,
     "single_use": false
   }
   ↓
3. API ProExtend valida usuário e gera token
   ↓
4. API ProExtend → Sistema Externo
   {
     "login_url": "https://{{instituicao}}.proextend.com.br/login?token=abc123..."
   }
   ↓
5. Sistema Externo redireciona usuário para login_url
   ↓
6. Usuário é autenticado automaticamente no ProExtend
   ↓
7. Usuário acessa plataforma ProExtend sem digitar credenciais
```

## Gerar Token SSO

### Endpoint

```
POST /integration/v1/sso/generate-token
```

### Parâmetros

:::tip[IMPORTANTE]
O usuário pode ser identificado por **email (e-mail)** ou **code (código)**. É obrigatório fornecer **pelo menos um** dos dois campos.
:::

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `user_email` | string | Condicional | E-mail do usuário (obrigatório se `user_code` não fornecido) |
| `user_code` | string | Condicional | Código do usuário (obrigatório se `user_email` não fornecido) |
| `expires_in` | integer | Não | Tempo de expiração em segundos - padrão: 86400 (24 horas) |
| `single_use` | boolean | Não | Token de uso único - padrão: false (reutilizável) |


#### expires_in (Tempo de Expiração)

Define por quanto tempo o token SSO permanecerá válido.

- **Mínimo**: 60 segundos (1 minuto)
- **Máximo**: 31536000 segundos (365 dias)
- **Padrão**: 86400 segundos (24 horas)

**Valores comuns**:
- 15 minutos (`900`): Acesso temporário urgente
- 1 hora (`3600`): Suporte técnico
- 24 horas (`86400`): Acesso padrão
- 7 dias (`604800`): Convites de primeiro acesso
- 30 dias (`2592000`): Acesso de longa duração
- 90 dias (`7776000`): Portal institucional

#### single_use (Uso Único)

Define se o token pode ser usado apenas uma vez ou múltiplas vezes.

- `true`: Token é invalidado automaticamente após primeiro uso (ideal para links em e-mails, convites, acessos sensíveis)
- `false`: Token permanece válido até expirar - padrão (ideal para portais institucionais, acessos recorrentes)

:::tip[SEGURANÇA]
Para links enviados por e-mail ou convites de primeiro acesso, **sempre use** `single_use: true`. Isso garante que o token não possa ser reutilizado caso seja interceptado ou compartilhado indevidamente.
:::

### Exemplo de Requisição

```json
{
  "user_code": "PROF001",
  "expires_in": 604800,
  "single_use": false
}
```

### Resposta de Sucesso

```json
{
  "success": true,
  "message": "Token SSO gerado com sucesso.",
  "data": {
    "login_url": "https://{{instituicao}}.proextend.com.br/login?token=TbbVa3x8KlMnPqRsUvWxYz...",
    "user": {
      "name": "Dr. João Silva",
      "profile_type": "professor"
    }
  }
}
```

## Revogar Token SSO

Revoga tokens SSO de um usuário específico.

:::tip[AUTO-REVOGAÇÃO]
Ao gerar um novo token SSO para um usuário, **todos os tokens anteriores deste usuário são automaticamente revogados**. Isso garante que apenas um token esteja ativo por vez, aumentando a segurança.
:::

### Endpoint

```
POST /integration/v1/sso/revoke-token
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `user_email` | string | Condicional | E-mail do usuário (obrigatório se `user_code` não fornecido) |
| `user_code` | string | Condicional | Código do usuário (obrigatório se `user_email` não fornecido) |
| `revoke_all` | boolean | Não | true = revoga todos tokens ativos (padrão) / false = revoga apenas expirados |

### Exemplo de Requisição

```json
{
  "user_code": "PROF001",
  "revoke_all": true
}
```

### Resposta de Sucesso

```json
{
  "success": true,
  "message": "Todos os tokens do usuário foram revogados.",
  "data": {
    "revoked_count": 3,
    "user": {
      "name": "Dr. João Silva",
      "email": "professor@faculdade.edu.br",
      "profile_type": "professor"
    }
  }
}
```

## Casos de Uso Práticos

### 1. Portal Institucional

Link permanente no portal da instituição.

**Configuração**:
```json
{
  "user_code": "PROF001",
  "expires_in": 7776000,
  "single_use": false
}
```

**Características**:
- Expira em 90 dias
- Token reutilizável
- Ideal para acesso recorrente

### 2. E-mail de Convite

Link temporário para primeiro acesso.

**Configuração**:
```json
{
  "user_email": "novoprofessor@faculdade.edu.br",
  "expires_in": 604800,
  "single_use": true
}
```

**Características**:
- Expira em 7 dias
- Uso único
- Ideal para novos usuários

### 3. Acesso Temporário

Acesso para manutenção ou suporte.

**Configuração**:
```json
{
  "user_code": "ADMIN001",
  "expires_in": 900,
  "single_use": true
}
```

**Características**:
- Expira em 15 minutos
- Uso único
- Ideal para suporte técnico

## Tratamento de Erros

### Usuário Não Encontrado

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "user_code": ["Usuário não encontrado com o código fornecido."]
  }
}
```

### Usuário Suspenso

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "user_code": ["O usuário está suspenso e não pode gerar token SSO."]
  }
}
```

:::tip[VALIDAÇÃO]
Apenas usuários **ativos** podem gerar tokens SSO. Usuários suspensos (`suspended_at` não nulo) não podem autenticar via SSO até que a suspensão seja removida.
:::

### Parâmetro Inválido

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "expires_in": ["O tempo de expiração deve estar entre 60 e 31536000 segundos."]
  }
}
```

### Identificador Ausente

```json
{
  "success": false,
  "message": "Dados inválidos.",
  "errors": {
    "user_email": ["O e-mail ou código do usuário é obrigatório."]
  }
}
```

## Boas Práticas de Segurança

### Monitoramento e Auditoria

- Monitore todos os tokens gerados e utilizados no sistema
- Configure logs de acesso para rastrear autenticações via SSO
- Implemente notificações automáticas de login via SSO
- Revise periodicamente tokens ativos e revogue os desnecessários

### Gestão de Tokens

- Revogue tokens imediatamente em caso de suspeita de comprometimento
- Utilize tempos de expiração adequados ao contexto de uso:
  - **Curtos** (15min-1h) para acessos sensíveis e suporte técnico
  - **Médios** (1-7 dias) para convites e primeiro acesso
  - **Longos** (30-90 dias) apenas para portais institucionais confiáveis
- Prefira `single_use: true` para links enviados por e-mail
- Evite tokens com validade superior a 90 dias
