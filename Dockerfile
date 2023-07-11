FROM node:20-alpine
VOLUME /data
WORKDIR /app
RUN echo -e "update-notifier=false\nloglevel=error\nnode-linker=hoisted" > ~/.npmrc
RUN npm install --no-save pnpm
COPY package.json pnpm-lock.yaml ./
RUN npx pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN npx pnpm prepare
CMD npx pnpm start
