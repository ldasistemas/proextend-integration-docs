---
sidebar_position: 4
title: Autenticação
---

# Autenticação

## Introdução

A API de Integração ProExtend utiliza autenticação baseada em API Keys. As credenciais são geradas no painel administrativo da plataforma e possuem validade indefinida, sendo incluídas no header Authorization de todas as requisições.

## Como Funciona

### Fluxo de Autenticação

```mermaid
flowchart TD
    ADMIN["Administrador\ngera API Key no painel\n(Avançado → Integrações)"]
    KEY["API Key gerada\npex_xxx...\nescopo + rate limit"]
    REQ["Requisição HTTP\nAuthorization: Bearer pex_xxx...\nContent-Type: application/json"]

    VAL{"API Key\nválida?"}
    SCOPE{"Escopo\nsuficiente?"}
    RATE{"Rate limit\natingido?"}

    R401["401 Unauthorized"]
    R403["403 Forbidden"]
    R429["429 Too Many Requests"]
    OK["✓ Requisição processada"]

    ADMIN --> KEY
    KEY --> REQ
    REQ --> VAL
    VAL -->|não| R401
    VAL -->|sim| SCOPE
    SCOPE -->|não| R403
    SCOPE -->|sim| RATE
    RATE -->|sim| R429
    RATE -->|não| OK
```

## Gerando API Key no Painel Administrativo

Apenas administradores com permissões adequadas podem gerenciar API Keys de autenticação.

<Steps>

<Step title="Acessar Área de Integrações">

1. Acesse o painel administrativo do ProExtend
2. Navegue para: **Avançado > Integrações**
3. Visualize a lista de API Keys existentes

</Step>

<Step title="Criar Nova API Key">

Selecione **"Gerar Nova API Key"** ou **"Criar API Client"**

</Step>

<Step title="Configurar API Client">

Configure os parâmetros:

**Nome** - Identificador descritivo para a integração.

Exemplos:
- "Integração ERP Produção"
- "Sistema Acadêmico - Sincronização"
- "Totvs RM - API"

**Scope (Escopo de Acesso)** - Defina o nível de permissão:

- **read**: Operações de leitura (endpoints GET)
  - Listar unidades, professores, alunos
  - Consultar dados específicos
  - Verificar status de sincronização

- **write**: Operações de escrita (endpoints POST /sync)
  - Sincronizar dados
  - Criar e atualizar registros
  - Não permite operações de consulta

- **full**: Acesso completo (read + write)
  - Operações de leitura e escrita
  - Recomendado para integrações completas

**Rate Limit (Limite de Requisições)** - Número máximo de requisições por minuto. Padrão: 60 requisições/minuto.

- **60/min**: Para sincronizações normais
- **120/min**: Para sincronizações de grande volume
- **30/min**: Para consultas ocasionais

</Step>

<Step title="Copiar API Key">

Após criar, a plataforma exibe a API Key gerada:

```
pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

:::warning[Atenção]
A chave é exibida **apenas uma vez**. Copie e armazene imediatamente em local seguro, não será possível recuperá-la depois. Caso seja perdida ou comprometida, será necessário gerar uma nova, o que invalida a anterior imediatamente em todos os sistemas que a utilizam.
:::

</Step>

</Steps>

## Usando API Key nas Requisições

### Formato do Header

Todas as requisições à API de integração devem incluir:

```
Authorization: Bearer pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Content-Type: application/json
```

:::info
Todos os endpoints estão disponíveis para teste diretamente no navegador.

**<a href="/api" target="_blank">Acessar API →</a>**
:::

### Exemplo de Requisição

```bash
curl -X GET https://{{instituicao}}.proextend.com.br/api/integration/v1/units \
  -H "Authorization: Bearer pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -H "Content-Type: application/json"
```

## Gerenciamento de API Keys

### Visualizar API Keys Existentes

No painel administrativo:
1. Acesse **Avançado > Integrações**
2. Serão exibidos lista com:
   - Nome da integração
   - Scope configurado
   - Rate limit
   - Status (ativa/inativa)
   - Data de criação
   - Última sincronização

### Editar API Key

Campos editáveis: nome da integração, scope de acesso e rate limit. O token em si não pode ser editado, apenas regenerado.

### Gerar/Regenerar API Key

Procedimento para chaves comprometidas ou perdidas:

:::warning
Regeneração invalida imediatamente todos os serviços que utilizam a chave.
:::

1. Acesse a API Key específica
2. Selecione "Regenerar Token"
3. Confirme a operação
4. Token anterior é invalidado imediatamente
5. Nova chave é exibida apenas uma vez
6. Atualize em todos os sistemas integrados

Recomendações:
- Planeje substituição antecipadamente
- Atualize sistemas em paralelo para minimizar interrupção
- Considere criar nova API Key temporária para migração gradual

### Ativar/Desativar API Key

Desativação temporária sem remoção permanente:

1. Acesse a API Key específica
2. Utilize opção "Desativar" ou toggle de status
3. Requisições retornarão erro 401

Aplicação: Manutenção ou suspensão temporária da integração.

### Deletar API Key

Remoção permanente:

1. Acesse a API Key específica
2. Selecione "Deletar"
3. Confirme a operação
4. Chave removida permanentemente sem possibilidade de recuperação

## Logs de Integrações

Toda requisição de escrita feita pela API (sincronizações, remoções, SSO) é registrada automaticamente e fica disponível no painel em **Avançado > Integrações**. Os logs são mantidos por **30 dias** e removidos automaticamente após esse período.

Consulte [Logs de Integrações](logs-de-integracoes) para detalhes sobre filtros, campos exibidos e exemplos de entradas.

## Tratamento de Erros

### Referência de Códigos de Erro

| Código | Causa | Solução |
|--------|-------|---------|
| **401** | API Key ausente ou inválida | Verificar header `Authorization: Bearer pex_...` |
| **403** | API Key desativada ou scope insuficiente | Reativar no painel ou usar API Key com scope adequado (`full`) |
| **404** | Recurso não encontrado | Verificar se o code existe |
| **422** | Dados de entrada inválidos | Validar campos obrigatórios e formatos (CPF, email, etc.) |
| **429** | Limite de requisições por minuto atingido | Aguardar `retry_after` segundos e implementar backoff |
| **500** | Erro interno no servidor | Contatar suporte técnico |

Todos os erros seguem o shape padronizado `ApiError`. Para detalhes do formato, exemplos por cenário e o glossário de `rule` (`unauthenticated`, `invalid_api_key`, `api_key_disabled`, `insufficient_scope`, `rate_limit_exceeded`), consulte [Tratamento de Erros](tratamento-de-erros).

## Segurança

### Boas Práticas

- Restrinja acesso à API Key apenas a pessoal autorizado
- Documente quem tem acesso à chave
- Revise periodicamente os acessos
- Estabeleça política de rotação (exemplo: a cada 6 meses)
- Regenere se houver suspeita de vazamento
- Teste nova chave antes de invalidar antiga

## Checklist de Configuração

Antes de iniciar a integração:

- [ ] API Key gerada no painel administrativo
- [ ] Scope configurado corretamente (recomendado: `full`)
- [ ] Rate limit adequado ao volume de sincronização
- [ ] API Key armazenada com segurança
- [ ] Header `Authorization` configurado corretamente
- [ ] Tratamento de erros 401, 403 e 429 implementado
- [ ] Logs de acesso configurados
- [ ] Documentação interna criada (quem tem acesso)

## Recursos Adicionais

Teste os endpoints de autenticação diretamente pelo [playground interativo](/api).

## Suporte

Questões relacionadas a autenticação devem ser direcionadas à equipe técnica da ProExtend.
