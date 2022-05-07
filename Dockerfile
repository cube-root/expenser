FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run bootstrap && npm run build
CMD ["npm", "start"]
EXPOSE 3000

