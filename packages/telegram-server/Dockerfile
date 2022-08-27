FROM node:alpine
WORKDIR /telegram-server
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]