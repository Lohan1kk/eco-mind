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

Dados de satélite: **INPE** (Brasil, diário com FRP) + **NASA FIRMS** global 24h (CSV público).

Chave opcional — coloque em `.env.local` (local) ou nas Environment Variables da Vercel (produção):

```bash
# .env.local
FIRMS_MAP_KEY=sua_chave_aqui
```

Peça a chave em: https://firms.modaps.eosdis.nasa.gov/api/map_key/  
Modelo: [`.env.example`](.env.example)

## Marca

- Identidade e história: [`MARCA.md`](MARCA.md)
- Pitch: [`PITCH.md`](PITCH.md)
- Assets: `public/brand/`
