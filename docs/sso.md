---
sidebar_position: 6
title: SSO (Single Sign-On)
---

# SSO (Single Sign-On)

## Introdução

A funcionalidade SSO (Single Sign-On) permite que sistemas externos gerem tokens de acesso para login direto de usuários na plataforma ProExtend sem necessidade de credenciais.

Casos de uso:
- Integração com portais institucionais
- Acesso via emails automatizados
- Autenticação entre sistemas integrados
- Convites temporários

## Fluxo de Autenticação

```
1. Sistema Externo → API ProExtend
   POST /integration/v1/sso/generate-token
   { "user_code": "PROF001" }
   ↓
2. API ProExtend → Sistema Externo
   { "login_url": "https://{{instituicao}}.proextend.com.br/login?token=..." }
   ↓
3. Sistema redireciona usuário para login_url
   ↓
4. Usuário autentica automaticamente
```

## Gerar Token SSO

### Endpoint

```
POST /integration/v1/sso/generate-token
```

### Identificação do Usuário

O usuário pode ser identificado por **email** ou **code**:

```json
{
  "user_email": "professor@faculdade.edu.br"
}
```

ou

```json
{
  "user_code": "PROF001"
}
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `user_email` | string | Condicional | Email do usuário (obrigatório se `user_code` não fornecido) |
| `user_code` | string | Condicional | Código do usuário (obrigatório se `user_email` não fornecido) |
| `expires_in` | integer | Não | Tempo de expiração em segundos (padrão: 86400) |
| `single_use` | boolean | Não | Token de uso único (padrão: false) |


#### expires_in

Tempo de expiração do token em segundos.

- **Mínimo**: 60 (1 minuto)
- **Máximo**: 31536000 (365 dias)
- **Padrão**: 86400 (24 horas)

Exemplos:
- 15 minutos: `900`
- 1 hora: `3600`
- 7 dias: `604800`
- 30 dias: `2592000`

#### single_use

Define se o token pode ser usado uma única vez.

- `true`: Após primeiro uso, token é invalidado
- `false`: Token reutilizável (padrão)

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

#### Tipos de Perfil

| Valor | Descrição |
|-------|-----------|
| `admin` | Administrador |
| `professor` | Professor |
| `student` | Aluno |

## Revogar Token SSO

Revoga tokens SSO de um usuário específico.

### Endpoint

```
POST /integration/v1/sso/revoke-token
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `user_email` | string | Condicional | Email do usuário (obrigatório se `user_code` não fornecido) |
| `user_code` | string | Condicional | Código do usuário (obrigatório se `user_email` não fornecido) |
| `revoke_all` | boolean | Não | `true` = revoga todos tokens (padrão) / `false` = apenas expirados |

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
      "email": "professor@faculdade.edu.br",
      "profile_type": "professor"
    }
  }
}
```

## Casos de Uso

### Portal Institucional

Link permanente no portal da instituição.

```json
{
  "user_code": "PROF001",
  "expires_in": 7776000,
  "single_use": false
}
```

Características: Expira em 90 dias, reutilizável.

### Email de Convite

Link temporário para primeiro acesso.

```json
{
  "user_email": "novoprofessor@faculdade.edu.br",
  "expires_in": 604800,
  "single_use": true
}
```

Características: Expira em 7 dias, uso único.

### Acesso Temporário

Acesso para manutenção ou suporte.

```json
{
  "user_code": "ADMIN001",
  "expires_in": 900,
  "single_use": true
}
```

Características: Expira em 15 minutos, uso único.

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
    "user_email": ["O email ou código do usuário é obrigatório."]
  }
}
```

## Boas Práticas

### Tempo de Expiração

| Caso de Uso | Tempo Recomendado |
|-------------|-------------------|
| Convite de primeiro acesso | 3-7 dias |
| Suporte temporário | 1-24 horas |
| Portal institucional | 30-90 dias |

### Tokens de Uso Único

Prefira `single_use: true` para:
- Convites de primeiro acesso
- Redefinição de senha
- Acessos sensíveis
- Links em emails
