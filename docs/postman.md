---
sidebar_position: 6
title: Postman Collection
---

# Postman Collection

## Introdução

A Postman Collection da API de Integração ProExtend fornece exemplos práticos de todas as requisições disponíveis, facilitando o teste e a implementação da integração.

## Download da Coleção

A coleção está disponível para importação no Postman e inclui:

- Exemplos de todas as requisições de sincronização
- Exemplos de consultas (GET)
- Configuração de variáveis de ambiente
- Exemplos de tratamento de erros

**Link para download**: _Em breve_

## Configuração

### Passo 1: Importar Coleção

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo JSON da coleção
4. Confirme a importação

### Passo 2: Configurar Variáveis de Ambiente

Após importar a coleção, configure as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `base_url` | URL base da API | `https://{{instituicao}}.proextend.com.br/api/integration/v1` |
| `api_key` | Sua API Key | `pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |

### Passo 3: Testar Autenticação

Execute a requisição de teste de autenticação para verificar se suas credenciais estão configuradas corretamente.

## Estrutura da Coleção

A coleção está organizada por tipo de entidade:

### 1. Autenticação
- Teste de autenticação
- Exemplos de erros 401 e 403

### 2. Unidades (Units)
- Sincronizar unidades
- Listar unidades
- Consultar unidade específica

### 3. Áreas (Areas)
- Sincronizar áreas
- Listar áreas

### 4. Cursos (Courses)
- Sincronizar cursos
- Listar cursos

### 5. Disciplinas Base (Subjects)
- Sincronizar disciplinas
- Listar disciplinas

### 6. Professores (Professors)
- Sincronizar professores
- Listar professores
- Consultar professor específico

### 7. Alunos (Students)
- Sincronizar alunos
- Listar alunos
- Consultar aluno específico

### 8. Turmas (Enrollments)
- Sincronizar turmas
- Listar turmas
- Atualizar lista de alunos

### 9. Monitoramento
- Consultar status de sincronização

## Exemplos de Uso

### Sincronização de Professor

```json
POST {{base_url}}/professors/sync
Authorization: Bearer {{api_key}}
Content-Type: application/json

{
  "professors": [
    {
      "code": "PROF001",
      "name": "Dr. João Silva",
      "email": "joao.silva@faculdade.edu.br",
      "cpf": "12345678901",
      "phone": "11999999999",
      "area_code": "TECH"
    }
  ]
}
```

### Consulta de Unidades

```json
GET {{base_url}}/units
Authorization: Bearer {{api_key}}
```

### Sincronização em Lote

```json
POST {{base_url}}/students/sync
Authorization: Bearer {{api_key}}
Content-Type: application/json

{
  "students": [
    {
      "code": "ALU2024001",
      "name": "Pedro Oliveira",
      "email": "pedro@aluno.edu.br",
      "cpf": "11122233344",
      "course_code": "CC001"
    },
    {
      "code": "ALU2024002",
      "name": "Ana Costa",
      "email": "ana@aluno.edu.br",
      "cpf": "55566677788",
      "course_code": "CC001"
    }
  ]
}

```
## Suporte

Para dúvidas sobre o uso da Postman Collection, consulte a equipe técnica da ProExtend.

## Próximos Passos

1. Consulte [Fluxo de Sincronização](fluxo-de-sincronizacao) para entender a ordem correta
2. Revise [Autenticação](autenticacao) para configurar suas credenciais
3. Veja [Identificadores e Codes](identificadores-e-codes) para entender o sistema de identificação
