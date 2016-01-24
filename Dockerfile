FROM node:argon

# Diretorio de deploy no container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Instala dependencias, se houverem
COPY package.json /usr/src/app/
RUN npm install

# Copia tudo da pasta de dev para de deploy no container
COPY . /usr/src/app

# Porta que o webserver escuta
EXPOSE 8888

# Comando para subida do serviço
CMD [ "npm", "start" ]
