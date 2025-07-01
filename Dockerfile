# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar Angular CLI globalmente primero
RUN npm install -g @angular/cli@17

# Instalar todas las dependencias del proyecto
RUN npm ci

# Copiar el código fuente
COPY . .

# Hacer el build directamente con ng (sin postinstall)
RUN npx ng build --configuration=production

# Etapa 2: Servir la aplicación
FROM node:18-alpine AS production

WORKDIR /app

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Instalar serve para producción
RUN npm install -g serve@13.0.4

# Exponer el puerto que Railway asignará
EXPOSE $PORT

# Comando para iniciar la aplicación
CMD ["serve", "dist", "-s", "-p", "$PORT"]