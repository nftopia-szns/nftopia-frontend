## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Project structure
```
components # contains all reusable components of the frontend
pages # contains pages of the frontend, refer Next.js page documentation
services # contains redux, redux-saga, and service utils
utils # app utils
```
### Page routes
#### /asset?platform=&index=&assetId=
asset detail page, with params:
- platform: specify platform of the asset belongs to. ie. Decentraland
- index: elasticsearch index
- assetId: identity of the asset
#### /search
search page, with params: to be documented later

## Local setup

