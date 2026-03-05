FROM node:22-alpine

WORKDIR /app

# Instala dependências
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts

# Copia apenas os arquivos do backend
COPY server.js ./
COPY api/ ./api/
COPY lib/ ./lib/

EXPOSE 3001

CMD ["node", "server.js"]
