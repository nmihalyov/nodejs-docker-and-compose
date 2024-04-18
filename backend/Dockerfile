# Stage 1
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2
FROM node:16-alpine AS production
WORKDIR /app
RUN npm install pm2 -g
COPY --from=build /app/dist ./dist
COPY --from=build /app/ecosystem.config.js ./
COPY --from=build /app/.env* ./
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3001
CMD ["pm2-runtime", "start", "ecosystem.config.js"]