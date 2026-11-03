# LoL Build Assistant — Frontend

Interface web do **LoL Build Assistant**: escolha seu campeão, a rota e os inimigos do confronto e receba uma build recomendada por IA.

O backend fica em um projeto separado (`api-lol-build-assistant`) e precisa estar rodando para o app funcionar.

## Funcionalidades

- Seleção do campeão, da rota (com os ícones oficiais) e dos inimigos do confronto.
- Página de runas recomendada, no estilo do cliente do jogo.
- Caminho da build (itens) e ordem de habilidades.
- Ameaças do confronto exibidas junto à recomendação.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## Pré-requisitos

- Node.js (versão LTS recente) e npm
- API `api-lol-build-assistant` rodando (por padrão em `http://localhost:3333`)

## Como rodar

```bash
git clone https://github.com/diegogrlima/frontend-buld-assintant.git
cd frontend-buld-assintant
npm install
cp .env.example .env
npm run dev
```

O app abre em `http://localhost:5173`.

## Variáveis de ambiente

| Variável       | Descrição                | Padrão                  |
| -------------- | ------------------------ | ----------------------- |
| `VITE_API_URL` | URL base da API do back  | `http://localhost:3333` |

## Scripts

| Comando           | O que faz                                  |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Servidor de desenvolvimento com HMR        |
| `npm run build`   | Checagem de tipos e build de produção      |
| `npm run preview` | Serve localmente o build de produção       |
| `npm run lint`    | Executa o ESLint                           |

## Estrutura

```
src/
├── components/   # Componentes de UI (painéis, grade de campeões, runas, build...)
├── constants/    # Constantes (rotas/lanes)
├── hooks/        # Hooks (ex.: useChampions)
├── pages/        # MatchupPage (/) e RecommendationPage (/build)
├── services/     # Cliente HTTP e chamadas à API
└── types/        # Tipos da API
```

## Integração com a API

| Método | Rota                      | Uso                                |
| ------ | ------------------------- | ---------------------------------- |
| `GET`  | `/champions`              | Lista de campeões                  |
| `POST` | `/builds/recommendations` | Gera a recomendação para o confronto |

A recomendação consulta uma IA e pode levar até 90 s (timeout do cliente). A API não guarda recomendações: o resultado é passado à página `/build` pela navegação.
