# --- Build stage ---
FROM node:24-alpine AS build

WORKDIR /app

# Root files som web-appen afhænger af (tsconfig.base m.m.)
COPY package.json tsconfig.base.json pnpm-workspace.yaml ./

# Web-appens egen package.json
COPY apps/web/package.json ./apps/web/package.json

WORKDIR /app/apps/web

# Installér web-afhængigheder
RUN npm install

# Kopiér resten af web-appen
COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/vite.config.ts ./vite.config.ts
COPY apps/web/index.html ./index.html
COPY apps/web/tailwind.config.js ./tailwind.config.js
COPY apps/web/postcss.config.js ./postcss.config.js
COPY apps/web/src ./src

# Build til statiske filer (dist/)
RUN npm run build

# --- Runtime stage (NGINX) ---
FROM nginx:alpine

# Kopiér build-output ind i NGINX
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]