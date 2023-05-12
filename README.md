## Getting Started

Install the necessary packages.

```bash
npm install
# or
yarn add
```

Develop prisma

```bash
npx prisma init #prisma
```

In .env

```bash
MYSQL_ROOT_PASSWORD=admin
MYSQL_DATABASE=trpc-sample
DATABASE_URL="mysql://root:admin@localhost:3306/trpc-sample"
```

Build docker development

```bash
docker-compose up -d
```

Finally, project start!

```bash
npm run dev
# or
yarn run dev
```
