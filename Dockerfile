FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN chmod 666 /usr/src/app/token.txt
RUN chown -R 1001:1001 /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]