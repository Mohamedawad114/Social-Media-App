FROM node:22 as base
WORKDIR /app

COPY package*.json ./

FROM base as dev

RUN npm i

COPY . .

CMD ["npm","run","start:dev"]



FROM base as prod

RUN npm install

COPY . .

RUN npm run build 
RUN npm prune --production
CMD ["npm","run","start"]