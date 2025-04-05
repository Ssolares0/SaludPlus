# Etapa de build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3001

# Aquí se apunta al archivo JS principal que mencionaste
CMD ["node", "dist/src/config/appServer.js"]