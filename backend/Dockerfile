FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]


# To build docker image
# docker build -t online-judge-backend .


# To run docker container
# docker run --env-file .env -p 8000:8000 online-judge-backend
