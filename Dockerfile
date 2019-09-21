# ----- Dependencies -----
FROM node:10.16.3-alpine as dependencies

WORKDIR /app

# Add package.json to container
COPY package.json .
COPY yarn.lock .

RUN yarn install --production=true --frozen-lockfile
RUN cp -R node_modules prod_modules

RUN yarn install

COPY . .

RUN yarn build

# Release Image
FROM node:10.16.3-alpine

WORKDIR /app

COPY --from=dependencies /app/prod_modules ./node_modules
COPY --from=dependencies /app/lib ./lib

ENTRYPOINT ["node"]
CMD ["lib"]
