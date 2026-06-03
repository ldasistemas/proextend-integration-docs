---
sidebar_position: 8
title: Remoção de Entidades
---

# Remoção de Entidades

A API permite remover entidades através de endpoints `DELETE`. Esta página descreve como funciona o soft delete, o que cada remoção afeta em cascata e quando suspender é melhor do que remover.

Toda remoção é **soft delete**: o registro é marcado como removido, mas permanece no banco de dados para fins históricos e de auditoria. Os endpoints `DELETE` exigem escopo `write` ou `full`.

:::warning[Remoções em cascata afetam entidades filhas]
Remover uma entidade pai remove também as entidades vinculadas a ela. Avalie o impacto na tabela abaixo antes de executar.
:::

## Comportamento por Entidade

Cada endpoint remove a entidade informada e, dependendo do tipo, propaga a remoção para entidades filhas. Entidades globais da instituição (Áreas e Disciplinas Base) nunca são afetadas por remoções de outras entidades.

| Endpoint | Remove em cascata | Observações |
|---|---|---|
| `DELETE /units/{code}` | Cursos vinculados e seus alunos | Áreas e disciplinas base não são afetadas (globais) |
| `DELETE /areas/{code}` | Cursos vinculados e seus alunos | Unidades e disciplinas base não são afetadas |
| `DELETE /courses/{code}` | Alunos vinculados | Disciplinas base não são removidas. Turmas com o curso em `course_codes` permanecem, com o curso desvinculado do pivot |
| `DELETE /subjects/{code}` | Todas as turmas vinculadas | A disciplina base é global; remover propaga para as turmas que a instanciam |
| `DELETE /enrollments/{code}` | Vínculos de professores, cursos e alunos do pivot | A turma é removida; as entidades vinculadas permanecem, apenas o vínculo é desfeito |
| `DELETE /professors/{code}` | Nada | Turmas que o professor lecionava são preservadas |
| `DELETE /students/{code}` | Nada | Matrículas históricas são preservadas |
| `DELETE /directors/{code}` | Nada | Soft delete do diretor |
| `DELETE /coordinators/{code}` | Nada | Soft delete do coordenador |
| `DELETE /area-managers/{code}` | Nada | Soft delete do gestor de área |
| `DELETE /pedagogical-advisors/{code}` | Nada | Soft delete do assessor pedagógico |

:::warning[Curso removido deixa turmas sem vínculo]
Ao remover um curso, as turmas que o referenciavam em `course_codes` permanecem ativas, mas com o pivot do curso desvinculado. Se a turma tinha apenas esse curso, ela passa a não ter cursos, e a próxima sincronização nessa turma exigirá `course_codes` novamente.
:::

## Exemplo de Requisição

<ApiEndpoint method="DELETE" path="/integration/v1/units/{code}" />

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

## Códigos de Erro

| Código | Causa |
|---|---|
| `401` | API Key ausente ou inválida |
| `403` | API Key desativada ou escopo insuficiente (requer `write` ou `full`) |
| `404` | Entidade não encontrada com o `code` informado |

O corpo de erro segue o shape `ApiError` padrão. Detalhes em [Tratamento de Erros](tratamento-de-erros).

## Alternativa: Suspensão

Para **professores**, **coordenadores**, **gestores de área**, **diretores**, **assessores pedagógicos** e **alunos**, prefira suspender o acesso com `active: false` na sincronização, em vez de remover. A suspensão preserva o vínculo histórico e pode ser revertida com `active: true`.

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

Consulte [Fluxo de Sincronização](fluxo-de-sincronizacao) para detalhes sobre o campo `active`.
