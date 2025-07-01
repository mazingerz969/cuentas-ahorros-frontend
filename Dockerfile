# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar Angular CLI globalmente primero
RUN npm install -g @angular/cli@17

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Hacer el build
RUN npx ng build --configuration=production

# Etapa 2: Servir la aplicación
FROM node:18-alpine AS production

WORKDIR /app

# Copiar los archivos compilados
COPY --from=builder /app/dist ./dist

# Crear un servidor simple
RUN echo "const express = require('express');" > server.js && \
    echo "const path = require('path');" >> server.js && \
    echo "const app = express();" >> server.js && \
    echo "const port = process.env.PORT || 8080;" >> server.js && \
    echo "app.use(express.static(path.join(__dirname, 'dist')));" >> server.js && \
    echo "app.get('*', (req, res) => {" >> server.js && \
    echo "  res.sendFile(path.join(__dirname, 'dist/index.html'));" >> server.js && \
    echo "});" >> server.js && \
    echo "app.listen(port, () => {" >> server.js && \
    echo "  console.log(\`Server running on port \${port}\`);" >> server.js && \
    echo "});" >> server.js

# Instalar express
RUN npm install express

# Exponer puerto
EXPOSE 8080

# Iniciar el servidor
CMD ["node", "server.js"]