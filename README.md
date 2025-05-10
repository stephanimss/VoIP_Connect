# VoIP Integration Backend

A comprehensive backend for VoIP integration with Kamailio SIP server and XMPP for real-time communication.

## Features

- User authentication and management
- Call management (initiate, answer, end calls)
- Call history tracking
- Real-time communication via XMPP
- WebRTC signaling for voice and video calls
- Integration with Kamailio SIP server
- WebSocket support for real-time updates

## Technologies Used

- Node.js and Express.js
- MongoDB for data storage
- XMPP for real-time messaging and presence
- Socket.io for WebSocket communication
- SIP.js for SIP protocol handling
- JWT for authentication
- Kamailio for SIP server functionality

## Prerequisites

- Node.js (v14+)
- MongoDB
- Kamailio SIP server
- XMPP server (e.g., Prosody, ejabberd)

## Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/voip-integration-backend.git
   cd voip-integration-backend
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file based on `.env.example`:
   \`\`\`
   cp .env.example .env
   \`\`\`

4. Update the `.env` file with your configuration.

5. Start the server:
   \`\`\`
   npm start
   \`\`\`

## API Documentation

The API documentation is available as a Postman collection in the `postman` directory. Import the collection into Postman to explore and test the API endpoints.

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update user settings
- `GET /api/users/phone/:phoneNumber` - Get user by phone number
- `GET /api/users/search` - Search users

#### Call Management
- `POST /api/calls/initiate` - Initiate a call
- `POST /api/calls/answer` - Answer a call
- `POST /api/calls/end` - End a call
- `GET /api/calls/history` - Get call history
- `GET /api/calls/:callId` - Get call details

#### XMPP
- `POST /api/xmpp/message` - Send a message
- `POST /api/xmpp/presence` - Update presence

#### Kamailio
- `POST /api/kamailio/register` - Register with Kamailio

## WebSocket Events

The backend uses Socket.io for real-time communication. Here are the main events:

### Client to Server
- `call:offer` - Send WebRTC offer
- `call:answer` - Send WebRTC answer
- `call:ice-candidate` - Send ICE candidate
- `call:end` - End a call
- `user:status` - Update user status

### Server to Client
- `call:offer` - Receive WebRTC offer
- `call:answer` - Receive WebRTC answer
- `call:ice-candidate` - Receive ICE candidate
- `call:end` - Call ended
- `call:error` - Call error
- `user:status` - User status update

## Integration with Frontend

This backend is designed to work with the VoIP Integration frontend. The frontend should connect to this backend using:

1. REST API for authentication and data operations
2. WebSocket for real-time updates and WebRTC signaling
3. WebRTC for peer-to-peer voice and video communication

## License

MIT
