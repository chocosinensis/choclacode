FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then \
  npm i && npm i -D concurrently nodemon sass; else npm i --only=prod; fi

COPY . ./
RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]
