FROM node:12
WORKDIR /usr/src/cleanSurvey
COPY ./package.json .
RUN npm install --only=production