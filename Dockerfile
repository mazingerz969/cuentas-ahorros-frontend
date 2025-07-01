# Etapa 1: Build de la aplicación
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar el código fuente
COPY . .

# Hacer el build de Angular
RUN npm run build

# Etapa 2: Servir la aplicación
FROM node:18-alpine AS production

WORKDIR /app

# Copiar solo los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Copiar package.json para instalar serve
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm ci --only=production

# Exponer el puerto
EXPOSE $PORT

# Comando para iniciar la aplicación
CMD ["npx", "serve", "dist", "-s", "-p", "$PORT"]