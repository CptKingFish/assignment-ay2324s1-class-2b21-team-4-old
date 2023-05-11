import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});

// configure TRPCClient to use WebSockets transport
const client = createTRPCProxyClient({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});