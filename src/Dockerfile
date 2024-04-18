FROM debian:bullseye-slim

RUN mkdir -p /app

WORKDIR /app

RUN apt update && apt -y upgrade && apt -y install curl git

# Downloading and installing NVM
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.3/install.sh | bash

# Installing Node.js version, removing node_modules (to force refresh dependencies),
# installing node dependencies, and building the product in the dist folder
CMD /bin/bash -l -c "source ~/.bashrc && nvm install $(cat .nvmrc) && nvm use && rm -rf node_modules && npm install && npm run prod"
