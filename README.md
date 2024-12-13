# DSL-Xpert

This tool provides a web interface to define domain-specific languages and uses large language models (LLM) to interact with those grammars via chat. It can validate the generated grammar instances while chatting with the LLM. It has integrations with OpenAI's GPT models, HuggingFace Inference API, custom HuggingFace Models running it locally, and WebLLM to run it on the client side with zero configuration and connect to your custom server using REST requests.

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg) ![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020.2.0-brightgreen.svg) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/lbdudc/dsl-xpert)[![DOI](https://zenodo.org/badge/DOI/10.1145/3652620.3687782.svg)](https://doi.org/10.1145/3652620.3687782)

- [Usage](#usage)
  - [Docker](#docker)
  - [Standalone server](#standalone-server)
  - [HuggingFace custom (only for standalone server)](#huggingface-custom-only-for-standalone-server)
- [API Routes](#api-routes)
- [Author](#author)
- [License](#license)

## Usage

The project can be run in different ways. The following sections describe how to run the project using Docker or as a standalone server.

### Docker

The project can be run using Docker. To do so, execute the following commands:

Prerequisites:

- Docker
- Docker Compose

```sh
docker-compose up
```

This will start tha application it wil run:

- Web App:  `http://localhost:5555`
- API: `http://localhost:5555/api`

### Standalone server

The application also can be run without docker, as a standalone application. To do so, execute the following commands:

Prerequisites:

- NVM
- Node.js
- MongoDB
- Python (optional only if the user wants to use the custom huggingface models)

```sh

# (Optional), check the .nvmrc file
# for seeing what is the node version
nvm use

npm install
npm run dev
```

This will start:

- Client at `http://localhost:5173`
- Server at `http://localhost:5173/api`

It will be necessary to have a MongoDB database running, and set the variable in the `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/llm-dsl-builder
```

### HuggingFace custom (only for standalone server)

We already have added the HuggingFace Custom Server into the `docker-compose.yml` file, so it will be running by default.

But in thr standalone version, the user can run the server using the command:

```sh
npm run dev:pyserver
```

This will start the python server at `ws://localhost:8000/ws`,the client is already configured to interact with this server.

### API Routes

The API provides the following routes:

- `GET /models`: Get all models
- `POST /models`: Create a new model
- `GET /models/:id`: Get a model by id
- `PUT /models/:id`: Update a model by id
- `DELETE /models/:id`: Delete a model by id

## Author

- Victor Lamas
  - Email: <victor.lamas@udc.es>

- Daniel Garcia-Gonzalez
  - Email: <d.garcia2@udc.es>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
