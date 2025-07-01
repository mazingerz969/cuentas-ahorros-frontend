# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar Angular CLI globalmente
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

# Instalar express
RUN npm install express

# Crear servidor Express
COPY <<EOF server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar rutas SPA - devolver index.html para todas las rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
EOF

# Exponer puerto
EXPOSE 8080

# Iniciar el servidor Express
CMD ["node", "server.js"]