FROM node

WORKDIR /app

COPY ./ ./

CMD ["npm","run","start"]