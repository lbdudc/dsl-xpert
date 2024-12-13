# DSL-Xpert

This tool provides a web interface to define domain-specific languages and uses large language models (LLM) to interact with those grammars via chat. It can validate the generated grammar instances while chatting with the LLM. It has integrations with OpenAI's GPT models, HuggingFace Inference API, custom HuggingFace Models running it locally, and WebLLM to run it on the client side with zero configuration and connect to your custom server using REST requests.

- [Getting Started](#getting-started)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Docker](#docker)
    - [Standalone server](#standalone-server)
    - [HuggingFace](#huggingface)
- [Usage](#usage)
  - [API Routes](#api-routes)
- [Author](#author)
- [License](#license)

## Getting Started

## Installation

The project can be run in different ways. The following sections describe how to run the project using Docker or as a standalone server.

### Prerequisites

### Docker

The project can be run using Docker. To do so, execute the following commands:

Prerequisites:

- Docker
- Docker Compose

```bash
docker-compose up
```

This will start the server, client, and a database using MongoDB. The server will be available at `http://localhost:5555/api` and the client at `http://localhost:5555`.

You can change the port by setting the `VITE_SERVER_URL` environment variable in the `docker-compose.yml` file.

```yaml
 llm-dsl-builder:
    environment:
      - SERVER_PORT=5000 ## This is the internal port of the Express Node server
      - CLIENT_URL=http://localhost:5173
      - VITE_SERVER_URL=http://localhost:5555 ## This is the URL of the Nginx server
      - MONGODB_URI=mongodb://mongodb:27017/llm-dsl-builder
```

### Standalone server

The server can be run as a standalone application. To do so, execute the following commands:

Prerequisites:

- Node.js
- MongoDB

```bash
nvm use
npm install
npm run dev
```

This will start the server at `http://localhost:5000/api` and the client at `http://localhost:5173`.

It will be necessary to have a MongoDB database running. The connection string must be set in the `.env` file. The file must be created in the root of the project and must contain the following content:

```bash
MONGODB_URI=mongodb://localhost:27017/llm-dsl-builder
```

### HuggingFace

To run the huggingface server in local, you can use the following command:

```bash
cd ./src/python

docker run -d --name mycontainer -p 80:80 myimage

docker build -t myimage .
```

### Usage

The project provides a web interface to manage the LLMs. The interface allows to create, train and use LLMs. Also, it provides a REST API to manage the LLMs the same way as the web interface.

#### API Routes

The API provides the following routes:

- `GET /models`: Get all models
- `POST /models`: Create a new model
- `GET /models/:id`: Get a model by id
- `PUT /models/:id`: Update a model by id
- `DELETE /models/:id`: Delete a model by id
- `POST /models/:id/chat`: Chat with a model by id

Model schema:

```json
{
 "name": {
    "type": "String",
    "required": true,
    "unique": true,
  },
  "description": {
    "type": "String",
    "default": null,
  },
  "developer": {
    "type": "String",
    "required": true,
  },
  "modelType": {
    "type": "String",
    "required": true,
  },
  "request": {
    "type": "Object"
  },
  "apiKey": {
    "type": "String",
  },
  "iv": {
    "type": "String",
  },
  "temperature": {
    "type": "Number",
    "default": 0.1,
  },
  "maximumLength": {
    "type": "Number",
    "default": 4095,
  },
  "topK": {
    "type": "Number",
    "default": 50,
  },
  "topP": {
    "type": "Number",
    "default": 1,
  },
  "repetitionPenalty": {
    "type": "Number",
    "default": 0,
  },
  "stopSequences": {
    "type": ["String"],
    "default": [";", "###"],
  },
  "seed": {
    "type": "Number",
    "default": 6,
  },
  "definition": {
    "type": "String",
    "required": true,
  },
  "grammarType": {
    "type": "Object",
    "required": true,
  },
  "definitionExamples": {
    "type": [
      {
        "userInstruction": "String",
        "modelAnswer": "String",
      },
    ],
    "required": true,
  },
  "created_date": {
    "type": "Date",
    "default": "Date.now",
  },
}
```

## Author

- Victor Lamas
  - Email: <victor.lamas@udc.es>

- Daniel Garcia-Gonzalez
  - Email: <d.garcia2@udc.es>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
