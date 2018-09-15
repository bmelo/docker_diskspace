FROM node:6-slim

COPY server.js /app/
COPY package.json /app/
COPY lib /app/lib

EXPOSE 80

WORKDIR /app
ENTRYPOINT ["npm", "start"]