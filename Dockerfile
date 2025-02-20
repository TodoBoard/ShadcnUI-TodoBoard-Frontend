GNU nano 7.2                                                                                  Dockerfile                                                                                            
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next/static ./.next/static

RUN addgroup -S frontend && adduser -S -G frontend frontend && \
    chown -R frontend:frontend /app

USER frontend

EXPOSE 3000

CMD ["npm", "start"]


