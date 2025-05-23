FROM node:20-alpine3.18

WORKDIR /node-app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3100
ENV PORT=${PORT}
EXPOSE ${PORT}

# Primeiro instala as dependências
COPY package.json package-lock.json ./
RUN npm ci

# Depois copia o projeto (Isto torna mais rápido o build devido ao cache)
COPY . .

# Eu sinceramente prefiro dessa forma, mas se deer B.O eu coloco o ENTRYPOINT npm start de volta 
CMD ["npm", "start"]

# docker build -t sistema-de-refeicoes .
