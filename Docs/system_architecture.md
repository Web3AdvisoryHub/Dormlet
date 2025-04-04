# Dormlet System Architecture Design

## Overview

This document outlines the detailed system architecture for the Dormlet application, a "scroll-core room powered by your wallet" that allows users to display their NFTs in customizable virtual spaces and interact with others socially.

## Architecture Diagram

```
+----------------------------------+
|          CLIENT LAYER            |
|  +----------------------------+  |
|  |      React + Next.js       |  |
|  +----------------------------+  |
|  |  Components  |   Hooks     |  |
|  +----------------------------+  |
|  |  Three.js    |   Redux     |  |
|  +----------------------------+  |
+----------------------------------+
              |
              | HTTP/WebSocket
              |
+----------------------------------+
|          SERVER LAYER            |
|  +----------------------------+  |
|  |      Node.js + Express     |  |
|  +----------------------------+  |
|  |  API Routes |  WebSockets  |  |
|  +----------------------------+  |
|  |  Auth       |  Controllers |  |
|  +----------------------------+  |
+----------------------------------+
              |
              |
+----------------------------------+
|         DATA LAYER               |
|  +------------+  +------------+  |
|  |  MongoDB   |  |    IPFS    |  |
|  +------------+  +------------+  |
|  +------------+  +------------+  |
|  |  AWS S3    |  | Blockchain |  |
|  +------------+  +------------+  |
+----------------------------------+
```

## Client Layer Architecture

### Component Structure

```
/src
  /components
    /core
      - Layout.jsx
      - Navigation.jsx
      - ScrollView.jsx
    /wallet
      - WalletConnect.jsx
      - NFTGallery.jsx
      - WalletStatus.jsx
    /space
      - Room.jsx
      - NFTObject.jsx
      - SpaceControls.jsx
    /avatar
      - AvatarCreator.jsx
      - AvatarRenderer.jsx
      - AvatarControls.jsx
    /social
      - Chat.jsx
      - UserList.jsx
      - Invitations.jsx
    /ui
      - Button.jsx
      - Modal.jsx
      - Tooltip.jsx
  /hooks
    - useWallet.js
    - useNFTs.js
    - useSpace.js
    - useAvatar.js
    - useSocial.js
  /store
    - walletSlice.js
    - nftSlice.js
    - spaceSlice.js
    - avatarSlice.js
    - socialSlice.js
  /utils
    - web3Utils.js
    - threeUtils.js
    - apiUtils.js
  /pages
    - index.js
    - space/[id].js
    - profile.js
    - explore.js
```

### Key Client Modules

1. **Wallet Module**
   - Handles wallet connection and authentication
   - Fetches and manages NFT data
   - Provides wallet status and account information

2. **Space Module**
   - Manages 3D room rendering and customization
   - Handles NFT placement and interaction
   - Controls camera and navigation within spaces

3. **Avatar Module**
   - Manages user avatar creation and customization
   - Handles avatar movement and animations
   - Renders avatars in 3D space

4. **Social Module**
   - Manages real-time communication between users
   - Handles friend/follow relationships
   - Provides invitation and space sharing functionality

5. **Scroll-Core Module**
   - Implements the scroll-based navigation interface
   - Manages transitions between spaces
   - Handles touch and mouse interactions

## Server Layer Architecture

### API Structure

```
/server
  /routes
    - auth.routes.js
    - nft.routes.js
    - space.routes.js
    - user.routes.js
    - social.routes.js
  /controllers
    - auth.controller.js
    - nft.controller.js
    - space.controller.js
    - user.controller.js
    - social.controller.js
  /middleware
    - auth.middleware.js
    - validation.middleware.js
    - rate-limit.middleware.js
  /services
    - wallet.service.js
    - nft.service.js
    - space.service.js
    - user.service.js
    - social.service.js
  /websockets
    - socket.manager.js
    - presence.handler.js
    - chat.handler.js
    - space.handler.js
  /utils
    - web3.utils.js
    - ipfs.utils.js
    - validation.utils.js
  - server.js
```

### Key Server Modules

1. **Authentication Service**
   - Handles wallet signature verification
   - Manages JWT issuance and validation
   - Provides user session management

2. **NFT Service**
   - Fetches NFT data from blockchain networks
   - Processes and normalizes NFT metadata
   - Caches NFT information for performance

3. **Space Service**
   - Manages space creation and customization
   - Stores space configurations
   - Handles space sharing and permissions

4. **Social Service**
   - Manages user relationships and interactions
   - Handles notifications and invitations
   - Provides user discovery functionality

5. **WebSocket Manager**
   - Coordinates real-time communication
   - Manages user presence and status
   - Synchronizes space state between users

## Data Layer Architecture

### Database Schema

**Users Collection**
```json
{
  "_id": "ObjectId",
  "walletAddress": "string",
  "username": "string",
  "avatar": {
    "model": "string",
    "customizations": "object"
  },
  "createdAt": "date",
  "lastActive": "date",
  "friends": ["ObjectId"],
  "settings": "object"
}
```

**Spaces Collection**
```json
{
  "_id": "ObjectId",
  "owner": "ObjectId",
  "name": "string",
  "description": "string",
  "isPublic": "boolean",
  "template": "string",
  "configuration": {
    "environment": "object",
    "nfts": [
      {
        "tokenId": "string",
        "contract": "string",
        "chain": "string",
        "position": "object",
        "rotation": "object",
        "scale": "object",
        "interactions": "array"
      }
    ]
  },
  "allowedUsers": ["ObjectId"],
  "ipfsHash": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Invitations Collection**
```json
{
  "_id": "ObjectId",
  "from": "ObjectId",
  "to": "ObjectId",
  "spaceId": "ObjectId",
  "status": "string",
  "createdAt": "date",
  "expiresAt": "date"
}
```

**Messages Collection**
```json
{
  "_id": "ObjectId",
  "spaceId": "ObjectId",
  "sender": "ObjectId",
  "content": "string",
  "createdAt": "date",
  "isSystem": "boolean"
}
```

### Storage Strategy

1. **MongoDB**
   - Stores user profiles and relationships
   - Manages space configurations and metadata
   - Handles invitations and messages

2. **IPFS**
   - Stores complete space configurations for decentralization
   - Provides content-addressable storage for space sharing
   - Enables space configuration versioning

3. **AWS S3**
   - Stores optimized 3D models and textures
   - Caches processed NFT images and metadata
   - Hosts static assets for the application

4. **Blockchain**
   - Source of truth for NFT ownership
   - Potential storage for space ownership records
   - Optional integration for tokenized spaces

## Integration Architecture

### Web3 Integration

1. **Wallet Connection**
   - Support for multiple wallet providers (MetaMask, WalletConnect)
   - Signature-based authentication
   - Session management with reconnection handling

2. **NFT Fetching**
   - Multi-chain support (Ethereum, Polygon, etc.)
   - Integration with NFT indexing services
   - Metadata normalization and caching

3. **On-Chain Verification**
   - Ownership verification for NFTs
   - Optional on-chain space ownership records
   - Potential integration with existing NFT marketplaces

### Third-Party Services

1. **NFT Indexing**
   - Integration with services like Moralis, Alchemy, or The Graph
   - Custom indexing for specialized NFT collections
   - Caching layer for performance optimization

2. **3D Asset Processing**
   - Conversion services for different 3D formats
   - Optimization pipeline for web performance
   - Fallback rendering for unsupported formats

3. **Analytics and Monitoring**
   - User behavior tracking
   - Performance monitoring
   - Error reporting and logging

## Security Architecture

1. **Authentication Security**
   - Non-custodial wallet authentication
   - JWT with appropriate expiration and refresh mechanisms
   - CSRF protection and secure cookie handling

2. **Data Security**
   - Input validation and sanitization
   - Rate limiting and abuse prevention
   - Encryption for sensitive data

3. **Frontend Security**
   - Content Security Policy implementation
   - Protection against common web vulnerabilities
   - Secure handling of wallet connections

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API servers for easy scaling
   - WebSocket clustering for real-time communication
   - Database sharding strategy for growth

2. **Performance Optimization**
   - CDN integration for static assets
   - Caching strategy for NFT and space data
   - Progressive loading of 3D environments

3. **Resource Management**
   - Efficient 3D rendering with level-of-detail
   - Lazy loading of space assets
   - Background processing for intensive operations

## Development and Deployment Architecture

1. **Development Environment**
   - Local development with Docker containers
   - Mock services for blockchain and IPFS
   - Hot reloading for efficient development

2. **CI/CD Pipeline**
   - Automated testing with Jest and Cypress
   - Staging environment for pre-production testing
   - Blue-green deployment for zero-downtime updates

3. **Monitoring and Logging**
   - Centralized logging with ELK stack
   - Performance monitoring with New Relic or similar
   - Error tracking with Sentry

This architecture design provides a comprehensive blueprint for building the Dormlet application, with a focus on modularity, scalability, and integration with Web3 technologies.
