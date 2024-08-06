FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package*.json ./

USER root



RUN npm install

USER pptruser

COPY . .  

RUN npm run build


CMD ["npm", "start"]

