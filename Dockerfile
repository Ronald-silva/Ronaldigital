FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY server.js ./
COPY api/ ./api/
COPY lib/ ./lib/
COPY data/ ./data/

EXPOSE 3001

CMD ["node", "server.js"]
