# EcoMind

**Consciência ambiental + tecnologia**

Site institucional de conscientização sobre desmatamento e queimadas, e recrutamento de alunos e comunidade para a causa.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Produção:** [https://eco-mind-ashy.vercel.app](https://eco-mind-ashy.vercel.app)

Mapa de queimadas: [http://localhost:3000/alerta-queimadas](http://localhost:3000/alerta-queimadas)

Dados de satélite: **INPE** (Brasil, diário com FRP) + **NASA FIRMS** global 24h (CSV público, sem chave). Opcionalmente `FIRMS_MAP_KEY` no `.env.local` para API por área.

## Marca

- Identidade e história: [`MARCA.md`](MARCA.md)
- Pitch: [`PITCH.md`](PITCH.md)
- Assets: [`assets/`](assets/) e `public/brand/`
