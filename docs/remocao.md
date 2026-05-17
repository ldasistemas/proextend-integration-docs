---
sidebar_position: 8
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
| `DELETE /units/{code}` | Remove a unidade e, em cascata, os cursos vinculados (que por sua vez removem seus alunos). **Áreas e disciplinas base não são afetadas** (são entidades globais) |
| `DELETE /areas/{code}` | Remove a área e, em cascata, os cursos vinculados (que por sua vez removem seus alunos). **Unidades e disciplinas base não são afetadas** |
| `DELETE /courses/{code}` | Remove o curso e, em cascata, os alunos vinculados. **Disciplinas base não são removidas** (são globais). Turmas que tinham o curso em `course_codes` permanecem (com o curso desvinculado do pivot) |
| `DELETE /subjects/{code}` | Remove a disciplina base e, em cascata, todas as turmas vinculadas |
| `DELETE /professors/{code}` | Remove o professor. Turmas são preservadas |
| `DELETE /coordinators/{code}` | Remove o coordenador. Soft delete |
| `DELETE /area-managers/{code}` | Remove o gestor de área. Soft delete |
| `DELETE /directors/{code}` | Remove o diretor. Soft delete |
| `DELETE /pedagogical-advisors/{code}` | Remove o assessor pedagógico. Soft delete |
| `DELETE /students/{code}` | Remove o aluno. Matrículas históricas são preservadas |
| `DELETE /enrollments/{code}` | Remove a turma e desvincula todos os professores, cursos e alunos do pivot |

:::warning
Ao remover um curso, as turmas que o referenciavam em `course_codes` permanecem ativas, mas com o pivot do curso desvinculado. Se a turma tinha apenas esse curso vinculado, ela passa a não ter cursos, e a próxima sincronização nessa turma exigirá `course_codes` novamente.
:::

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

- **401**: API Key ausente ou inválida
- **403**: API Key desativada ou scope insuficiente (requer `write` ou `full`)
- **404**: Entidade não encontrada com o code informado

## Alternativa: Suspensão

Para **professores**, **coordenadores**, **gestores de área**, **diretores**, **assessores pedagógicos** e **alunos**, considere usar o campo `active: false` na sincronização ao invés de remover. Isso suspende o acesso do usuário sem perder o vínculo histórico.

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
