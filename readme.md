# AFV Backend

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.15.0-brightgreen.svg)](https://nodejs.org/)

Audio follow video service using websocket connections. A test websocket server is included.

## Features

- WebSocket-based audio-video synchronization
- Real-time communication protocols
- Built-in test server for development
- Docker support for easy deployment
- RESTful API with Fastify framework

## Prerequisites

- Node.js >= 18.15.0 (LTS)
- npm or yarn package manager

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd afv-backend
npm install
```

## Usage

### Production

Start the AFV Backend server:

```bash
npm start
```

### Development

Start the server in development mode with hot reload:

```bash
npm run dev
```

#### Test WebSocket Server

The project includes a WebSocket test server for development:

```bash
npm run dev-server
```

Once the WebSocket server is running, establish a connection and press keys 0-9 to send test messages. You can customize these messages by editing `src/server/messages.ts`.

## Deployment

### Docker

Build and run using Docker:

```bash
# Build image
docker build -t afv-backend .

# Run with docker-compose
docker-compose up
```

### CI/CD

The project includes a GitHub Action workflow called "Trigger build of Docker Image" for automated builds and deployments.

## Development

### Scripts

- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run pretty` - Check code formatting

### Project Structure

```
src/
├── api/          # API server implementation
├── server/       # WebSocket test server
└── ...
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

### License Summary

You are free to:
- Use, modify, and distribute the software
- Create derivative works
- Use it for personal, educational, or research purposes

**Important**: The AGPL-3.0 license requires that if you distribute this software or run it as a network service, you must also make the source code (including any modifications) available under the same license terms.

For commercial licensing or if the AGPL-3.0 terms don't meet your needs, please contact [sales@eyevinn.se](mailto:sales@eyevinn.se).

## Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post questions regarding any of our open source projects.

Eyevinn's consulting services include:
- Further development of this component
- Customization and integration into your platform
- Support and maintenance agreements

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) for more information.

## About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. We are not commercially tied to any platform or technology vendor, allowing us to provide unbiased solutions.

As part of our commitment to innovation, we develop proof-of-concepts and open source tools. We share our knowledge through [technical blogs](https://dev.to/video) and by open sourcing our code.

Interested in working with us? Contact us at work@eyevinn.se!
