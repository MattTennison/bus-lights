# ----- Dependencies -----
FROM node:10.16.3-alpine as stage

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

COPY --from=stage /app/prod_modules ./node_modules
COPY --from=stage /app/lib ./lib

ENTRYPOINT ["node"]
CMD ["lib"]
