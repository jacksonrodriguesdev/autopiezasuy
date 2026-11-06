# AUTO PIEZAS UY (autopiezasuy.com)

Loja de autopeças para o Uruguai: TanStack Start (React 19, SSR) + Prisma + MySQL.
Nasceu como cópia do AGRO PARTS (C:\Users\USER\Desktop\site-rs\rstratorparts); o admin é o mesmo.

## Rodando

```bash
npm install
npx prisma generate
npm run dev        # http://localhost:8080
npm run build      # gera o servidor Node em .output/
npm start          # roda o build (node .output/server/index.mjs)
```

Variáveis em `.env` (modelo em `.env.example`). Banco: `autopiezasuy` (MySQL local).

## Catálogo

- Peças Pellegrino (102.520) na tabela `pecas` (+ `pecas_img`, `pecas_aplicacao`, `pecas_similar`,
  `pecas_ficha_tecnica`). Importação: `node --env-file=.env scripts/catalogo/importar_pellegrino.cjs`
  (lê o banco `rstratorpecas`; APAGA e recria peças e categorias) e depois
  `npx tsx --env-file=.env scripts/catalogo/categorias_es.ts` (nomes das categorias em espanhol).
- Fotos no Cloudflare R2 (`VITE_FOTOS_URL`/fotos/SKU_n.jpg), enviadas por
  `C:\Users\USER\Desktop\shope\r2.cjs`. O banco guarda o endereço completo.
- Preço: `valor_compra` = custo Pellegrino (R$); `preco_brl` = custo + margem (40% na importação);
  o site mostra $U pela cotação do dia (admin → Precificação).
- Categoria em texto `categoria` = "Principal > Subcategoria"; o filtro pela principal pega as subcategorias.

## Site

- Só espanhol do Uruguai (es-UY), indexado só no Uruguai: `/pt/...` redireciona (301) para o espanhol
  (`src/server.ts`, `src/lib/idioma.ts`). Sitemap só com URLs em espanhol.
- Uma linha só (automotiva). `TABELA_LEGADA` em `src/lib/linhas.ts` fica sempre false.
- Busca por veículo (marca → modelo → ano) a partir de `pecas_aplicacao`: `src/lib/veiculos.server.ts`,
  componente `src/components/BuscaVeiculo.tsx`, loja com `?auto=&modelo=&ano=`.
- Home: `src/components/home/HomeAutos.tsx` (seções fixas) + blocos do Construtor da Home (admin).
- Marca: `public/logo.svg`; ícones e banners de e-mail gerados por `scripts/marca/*.cjs`.
- Páginas por local: `/repuestos-autos/<departamento ou cidade>` (`src/lib/locais-seo.ts`).

## Pontos importantes

- Uploads (banners, fotos) ficam em `uploads/` (fora do git) e são servidos por `src/routes/uploads.$.ts`.
- Mudança no `prisma/schema.prisma`: pare o servidor de desenvolvimento antes do `npx prisma db push`.
- Antes de enviar: `npx prettier --write <arquivos>`, `npx tsc --noEmit` e `npm run lint` (zero erros).
