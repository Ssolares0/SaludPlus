FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN find ./node_modules/.bin/ -type f -exec chmod +x {} \;

COPY . .

RUN ls -la ./node_modules/.bin/ && \
    chmod +x ./node_modules/.bin/tsc && \
    npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY .env ./
RUN npm install --only=production

# Configurar prioridad IPv4 global
RUN echo "precedence ::ffff:0:0/96  100" > /etc/gai.conf

EXPOSE 3001

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Verificando resolución DNS para Supabase..."' >> /app/start.sh && \
    echo 'apk add --no-cache bind-tools' >> /app/start.sh && \
    echo 'echo "IPv4 address:"' >> /app/start.sh && \
    echo 'dig +short -4 A db.ayvouzycmojxlbcxhquy.supabase.co' >> /app/start.sh && \
    echo 'echo "Iniciando aplicación con preferencia IPv4..."' >> /app/start.sh && \
    echo 'exec node --dns-result-order=ipv4first dist/src/config/appServer.js' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]