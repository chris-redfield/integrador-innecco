FROM node:argon

# Diretorio de deploy no container
RUN mkdir -p /usr/src/app

RUN mkdir -p /usr/db

# Diretorio temporário da fila de jsons
RUN mkdir -p /usr/src/app/jsonVend

WORKDIR /usr/src/app

# Copia tudo da pasta de dev para de deploy no container
COPY . /usr/src/app

RUN apt-get update && apt-get install -y sqlite3

# roda o package.json de dentro do container
RUN npm install

# Porta que o webserver escuta
EXPOSE 8888

# Comando para subida do serviço
CMD [ "npm", "start" ]
