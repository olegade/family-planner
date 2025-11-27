FROM node:24-alpine

# Vi arbejder fra /app i containeren
WORKDIR /app

# 1) Kopiér filer fra repo-roden, som API'en afhænger af
COPY package.json tsconfig.base.json pnpm-workspace.yaml ./

# 2) Kopiér API'ens egen package.json
COPY apps/api/package.json ./apps/api/package.json

# 3) Installer API-afhængigheder
WORKDIR /app/apps/api
RUN npm install

# 4) Kopiér resten af API-koden og Prisma-setup
COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/prisma.config.ts ./prisma.config.ts
COPY apps/api/prisma ./prisma
COPY apps/api/src ./src

# 5) Prisma Client – kræver en DATABASE_URL ved generate-tid
ENV DATABASE_URL="postgres://postgres:postgres@db:5432/familyplanner_dev"
RUN npx prisma generate

# 6) Build TypeScript
RUN npm run build

# 7) Eksponér porten og start API
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]