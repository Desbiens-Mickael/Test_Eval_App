FROM node:20-alpine

RUN apk --no-cache add curl make g++ python3 git
RUN npm i -g node-pre-gyp

# Create app directory
WORKDIR /app

COPY package*.json .

# Install dependencies and clean cache to reduce image size
RUN npm ci && npm cache clean --force


COPY . .

EXPOSE 3000

# Start the app in dev mode
CMD ["npm", "run", "dev"]