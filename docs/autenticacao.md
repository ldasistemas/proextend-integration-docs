---
sidebar_position: 4
title: Autenticação
---

# Autenticação

## Introdução

A API de Integração ProExtend utiliza autenticação baseada em API Keys. As credenciais são geradas no painel administrativo da plataforma e possuem validade indefinida, sendo incluídas no header Authorization de todas as requisições.

## Como Funciona

### Fluxo de Autenticação

```
1. Administrador acessa painel ProExtend
   ↓
2. Gera API Key com configurações de escopo e rate limit
   ↓
3. Copia token gerado (formato: pex_xxxxxxxxxxxxxxxxxxxxxxxx)
   ↓
4. Inclui token no header Authorization de todas as requisições
```

## Gerando API Key no Painel Administrativo

Apenas administradores com permissões adequadas podem gerenciar API Keys de autenticação.

### Passo 1: Acessar Área de Integrações

1. Acesse o painel administrativo do ProExtend
2. Navegue para: **Avançado > Integrações**
3. Visualize a lista de API Keys existentes

### Passo 2: Criar Nova API Key

Selecione **"Gerar Nova API Key"** ou **"Criar API Client"**

### Passo 3: Configurar API Client

Configure os parâmetros:

#### Nome
Identificador descritivo para a integração.

**Exemplos**:
- "Integração ERP Produção"
- "Sistema Acadêmico - Sincronização"
- "Totvs RM - API"

#### Scope (Escopo de Acesso)

Defina o nível de permissão:

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

#### Rate Limit (Limite de Requisições)

Número máximo de requisições por minuto.

**Padrão**: 60 requisições/minuto

**Exemplos**:
- **60/min**: Para sincronizações normais
- **120/min**: Para sincronizações de grande volume
- **30/min**: Para consultas ocasionais

### Passo 4: Copiar API Key

Após criar, a plataforma exibe a API Key gerada:

```
pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

Nota de segurança:
- A chave é exibida apenas uma vez durante a criação
- Armazene imediatamente em local seguro
- Não será possível visualizar novamente após fechar
- Perda da chave requer geração de nova API Key
- Regeneração invalida imediatamente a chave anterior
- Planeje substituição em todos os sistemas antes de regenerar

## Usando API Key nas Requisições

### Formato do Header

Todas as requisições à API de integração devem incluir:

```
Authorization: Bearer pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Content-Type: application/json
```

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

Campos editáveis:
- Nome da integração
- Scope de acesso
- Rate limit

Nota: Token não pode ser editado, apenas regenerado.

### Regenerar API Key

Procedimento para chaves comprometidas ou perdidas:

Nota: Regeneração invalida imediatamente todos os serviços que utilizam a chave.

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

## Monitoramento e Logs

### Visualizar Logs de Acesso

No painel administrativo é possível ver:

- **Total de requisições**: Quantidade de chamadas feitas
- **Taxa de sucesso**: Percentual de requisições bem-sucedidas
- **Últimas requisições**: Log detalhado com:
  - Endpoint acessado
  - Método HTTP
  - Status da resposta
  - Data/hora
  - IP de origem

### Estatísticas

Acesse estatísticas detalhadas:

- Requisições por dia/hora
- Endpoints mais utilizados
- Erros mais frequentes
- Tempo médio de resposta

## Tratamento de Erros

### Referência de Códigos de Erro

| Código | Nome | Descrição | Solução |
|--------|------|-----------|---------|
| **401** | Unauthorized | API Key inválida, desativada ou ausente | Verificar token no header `Authorization: Bearer pex_...` e status no painel |
| **403** | Forbidden | Scope insuficiente para operação | Alterar scope para `full` ou usar API Key com permissões adequadas |
| **404** | Not Found | Recurso não encontrado | Verificar se code/endpoint existe |
| **422** | Unprocessable Entity | Dados inválidos | Validar campos obrigatórios e formatos (CPF, email, etc.) |
| **429** | Too Many Requests | Rate limit atingido | Aguardar `retry_after` segundos e implementar backoff |
| **500** | Internal Server Error | Erro interno no servidor | Contatar suporte técnico |
| **503** | Service Unavailable | API temporariamente indisponível | Tentar novamente após alguns minutos |

### Detalhes dos Erros

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated",
  "status": 401
}
```

Causas: API Key incorreta, desativada, deletada ou ausente no header

Solução: Verificar token e status no painel (Avançado > Integrações)

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient scope",
  "status": 403
}
```

Causas: Tentativa de sincronizar com scope `read` ou consultar com scope `write`

Solução: Alterar scope para `full` no painel

#### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Muitas tentativas. Por favor, tente novamente mais tarde.",
  "retry_after": 60,
  "status": 429
}
```

Causas: Excesso de requisições (limite por minuto atingido)

Solução: Aguardar `retry_after` segundos, implementar backoff exponencial ou aumentar rate limit no painel

## Segurança

### Boas Práticas

- Restrinja acesso à API Key apenas a pessoal autorizado
- Documente quem tem acesso à chave
- Revise periodicamente os acessos
- Estabeleça política de rotação (ex: a cada 6 meses)
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

## Próximos Passos

1. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao)
2. Consulte [Identificadores e Codes](identificadores-e-codes)

## Recursos Adicionais

Consulte a [Postman Collection](postman) para exemplos práticos de requisições e testes de autenticação.

## Suporte

Questões relacionadas a autenticação devem ser direcionadas à equipe técnica da ProExtend.
