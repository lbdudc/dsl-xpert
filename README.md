# LLM DSL Builder

TODO: Add description

## Instructions

In order to run the project, it is necessary to have Node.js installed. It is recommended to use nvm to manage the Node.js versions.

The system must connect to a MongoDB database. The connection string must be set in the `.env` file. The file must be created in the root of the project and must contain the following content:

```bash
MONGODB_URI=mongodb://localhost:27017/llm-dsl-builder
MONGO_DB_USER=your_user
MONGO_DB_PASS=your_password

#If you want to use OpenAPI, you must set the following environment variables:
OPEN_API_KEY=your_openapi_key
```

```bash
nvm use
npm install


# To run both server and client use
npm run start

# To run the server in development mode use
npm run dev


# If only the server is needed use 
npm run serve

```

To use it as a library, it is necessary to install it as a dependency:

```bash
npm install @lbdudc/llm-dsl-builder
```

And then import it in the code:

```javascript
import { LLMDSLBuilder } from '@lbdudc/llm-dsl-builder';
```

## Development

To setup the development environment, execute the following command:

```bash
nvm use
npm install
npm run prepare
```
