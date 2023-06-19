FROM node:20-alpine
VOLUME /data
WORKDIR /app
RUN echo -e "update-notifier=false\nloglevel=error" > ~/.npmrc
COPY package.json package-lock.json ./
RUN npm ci --force --ignore-scripts
COPY . .
RUN npm run prepare
CMD node /app/applications/docker-hosts.js
