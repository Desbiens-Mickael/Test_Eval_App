FROM node:20-alpine3.17

RUN apk --no-cache add curl make g++ python3 git openssl1.1-compat
RUN npm i -g node-pre-gyp

# Create app directory
WORKDIR /app

COPY package*.json .

# Install dependencies and clean cache to reduce image size
RUN npm ci && npm cache clean --force

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "dev"]