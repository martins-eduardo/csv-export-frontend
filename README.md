# Frontend — exportação de CSV

Tela do projeto de estudo de exportação de CSV: uma tabela de produtos com filtro por categoria e um botão para exportar o resultado em CSV.

## Stack

| Tecnologia | Uso |
|---|---|
| React + TypeScript | Interface |
| Vite | Criação do projeto e servidor de desenvolvimento |

## Estrutura

```
frontend/
└── src/
    ├── api.ts        # chamadas à API (listagem e exportação)
    ├── download.ts   # download de Blob pelo navegador
    ├── format.ts     # formatação de preço e data
    ├── types.ts      # tipo Produto
    ├── App.tsx       # a tela
    └── App.css
```

## Como rodar

Pré-requisito: Node.js 20 ou mais novo, e o **backend rodando** em `http://localhost:3333`.

```bash
npm install
npm run dev          # sobe em http://localhost:5173
```

A porta `5173` precisa ser a mesma liberada no CORS do backend.

## Como o download funciona

1. O botão chama `exportarProdutosCsv(categoria)`, passando o filtro atual da tela
2. O `fetch` faz a requisição para `/produtos/export`
3. A resposta é lida como **Blob** (`resposta.blob()`)
4. O nome do arquivo é extraído do header `Content-Disposition`
5. O `baixarBlob` cria uma URL temporária (`URL.createObjectURL`), simula o clique num `<a download>` invisível e depois libera a memória (`URL.revokeObjectURL`)

**Por que `fetch` + Blob, e não um link direto?** Um `<a href="/produtos/export">` também baixaria o arquivo, mas não permite enviar headers. Com `fetch` dá para mandar `Authorization: Bearer <token>` em sistemas com login, mostrar "Exportando..." e tratar erros.

**Atenção ao CORS:** o navegador esconde do JavaScript os headers de respostas de outra origem. O backend precisa expor o `Content-Disposition` (`exposedHeaders`), senão `resposta.headers.get('Content-Disposition')` retorna `null`.

## Anotações de estudo

- **O JSON não tem tipo de data:** o `criadoEm` chega como string ISO, por isso é `string` no tipo `Produto`
- **O `fetch` não lança erro para status 4xx/5xx**, só para falha de rede. É preciso checar o `resposta.ok`
- **`URLSearchParams`** monta a query string e codifica os acentos automaticamente
- **Race condition no `useEffect`:** a flag `ignorar` no cleanup descarta a resposta de uma requisição antiga quando o filtro muda rápido
- **`setState` no evento, não no effect:** o `setCarregando(true)` fica no `mudarCategoria`, seguindo as regras de lint do React
- **Duas requisições em desenvolvimento:** é o `StrictMode` do React montando o componente duas vezes de propósito; em produção não acontece