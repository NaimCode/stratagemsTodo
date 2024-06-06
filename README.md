# React + Express + MongoDB

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Vite](https://vitejs.dev/)
- [MongoDB](https://www.mysql.com/)
- [PNPM](https://pnpm.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Radix](https://www.radix-ui.com/)

### Installation

1. Clone the repo

   ```sh
   git clone  https://github.com/NaimCode/stratagemsTodo
   ```

2. Install client packages

   ```sh
   cd app
   pnpm install
   ```

3. Install server packages

   ```sh
   cd server
   pnpm install
   ```

4. Create a `.env` file in the root of the server folder and add the following

   ```sh
DATABASE_URL= 
SESSION_SECRET=
JWT_SECRET=
CLIENT_URL=
ENV=
PORT=
MULTI_SESSIONS=
SESSION_DURATION=
API_KEY=
   ```

5. Create a `.env` file in the root of the client folder and add the following

   ```sh
VITE_API_URL=
VITE_API_KEY=
   ```

## Setup Database (MongoDB) with Prisma

1. Create a new mongoDB database and copy the connection string into the `.env` file.

2. Push the schema into the database

   ```sh
   cd server
   pnpm db:push
   ```

3. Generate type definitions

   ```sh
   pnpm db:generate
   ```

4. To view the database

   ```sh
   pnpm studio
   ```

## Usage

1. Start the server

   ```sh
   cd server
   pnpm dev
   ```

2. Start the client

   ```sh
   cd app
   pnpm dev
   ```
   
## Unit testing and end-to-end testing

1. Server unit test

   ```sh
   pnpm test
   ```

2. client e2e test

   Make sure to add a valid credential for inside **e2e/todos.specs.ts** and **e2e/auth.specs.ts** for login e2e
   ```sh
   pnpm e2e:test
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Naim - [@naimcode](https://github.com/NaimCode)
