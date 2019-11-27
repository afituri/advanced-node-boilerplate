[![Build Status](https://travis-ci.com/afituri/advanced-node-boilerplate.svg?branch=master)](https://travis-ci.com/afituri/advanced-node-boilerplate)

# Advanced Node.js Boilerplate

ANB is an advanced node.js API boilerplate built using Express and Mongoose.

## Installation

Please make sure that you have a running Mongodb also Yarn, Jest, Eslint and Nodemon globally installed.

```bash
git clone https://github.com/afituri/advanced-node-boilerplate.git
```

```bash
cd advanced-node-boilerplate
```

```bash
yarn install
```

```bash
mv .env.example .env
```

Please change your env variables accordingly

## Usage

To seed the DB run:

```bash
yarn seed
```

To run:

```bash
yarn dev
```

## Testing

```bash
yarn test
```

### Features

Public endpoints:

- Register new user via POST `/auth/register`
- Login a user via POST `/auth/login`
- Resend a verification pin via POST `/auth/resend`
- Verify a new registered user via POST `/auth/verify`

Protected endpoints:

- List users via GET `/users`
