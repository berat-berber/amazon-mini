FROM node:22-alpine

WORKDIR /usr/src/app

# Update npm to avoid potential "Exit handler never called!" issues on Alpine.
RUN npm install -g npm@latest

# Copy dependency manifests first to preserve the dependency layer cache.
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
