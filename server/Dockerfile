FROM node:24-alpine

RUN npm install -g pnpm@11.5

WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY . .

RUN pnpm install

RUN pnpm run db:generate

ENV NODE_ENV=development
ENV API_PORT=3001

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
