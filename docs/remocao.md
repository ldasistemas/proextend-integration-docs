---
sidebar_position: 7
title: Remoção de Entidades
---

# Remoção de Entidades

A API suporta remoção de entidades via endpoints `DELETE`. Todas as remoções são **soft delete**: os registros são marcados como removidos mas preservados no banco de dados para fins históricos.

Os endpoints `DELETE` requerem escopo `write` ou `full`.

:::warning[ATENÇÃO]
Remoções em cascata afetam todas as entidades filhas vinculadas. Avalie o impacto antes de executar.
:::

## Comportamento por Entidade

| Endpoint | Escopo da remoção |
|---|---|
| `DELETE /units/{code}` | Remove a unidade e, em cascata, todas as áreas e cursos vinculados |
| `DELETE /areas/{code}` | Remove a área e, em cascata, todos os cursos vinculados |
| `DELETE /courses/{code}` | Remove o curso e, em cascata, todas as disciplinas e alunos vinculados |
| `DELETE /subjects/{code}` | Remove a disciplina base e, em cascata, todas as turmas vinculadas |
| `DELETE /professors/{code}` | Remove o professor. Turmas são preservadas |
| `DELETE /students/{code}` | Remove o aluno. Matrículas históricas são preservadas |
| `DELETE /admins/{code}` | Remove o administrador |
| `DELETE /enrollments/{code}` | Remove a turma e desmatricula todos os alunos vinculados |

## Exemplo de Requisição

```bash
curl -X DELETE https://{{instituicao}}.proextend.com.br/api/integration/v1/units/CAMPUS_CENTRO \
  -H "Authorization: Bearer pex_..."
```

## Resposta

Todos os endpoints de remoção retornam o mesmo formato:

```json
{
  "success": true,
  "message": "Unidade removida com sucesso."
}
```

### Códigos de Erro

- **401**: API Key inválida ou ausente
- **403**: Escopo insuficiente (requer `write` ou `full`)
- **404**: Entidade não encontrada com o code informado

## Alternativa: Suspensão

Para **professores** e **alunos**, considere usar o campo `active: false` na sincronização ao invés de remover. Isso suspende o acesso do usuário sem perder o vínculo histórico com turmas.

```json
{
  "professors": [
    {
      "code": "PROF001",
      "name": "Dr. João Silva",
      "email": "joao.silva@faculdade.edu.br",
      "active": false
    }
  ]
}
```

Consulte a seção [Fluxo de Sincronização](fluxo-de-sincronizacao) para detalhes sobre o campo `active`.
