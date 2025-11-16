"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Social Media App API",
            version: "1.0.0",
            description: `
📘 **Social Media App API Documentation**

This documentation covers **REST APIs**, **GraphQL queries**, and **Socket.io (Real-time)** events.
      `,
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Posts", description: "Posts management" },
            { name: "Comments", description: "Post comments" },
            { name: "Admin", description: "Admin actions" },
            { name: "Home", description: "Feed and search endpoints" },
            { name: "Profile", description: "User profile endpoints" },
            { name: "WebSocket", description: "Real-time chat via Socket.io" },
            { name: "GraphQL", description: "GraphQL queries" },
        ],
    },
    apis: ["./modules/**/*.ts", "./src/modules/**/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app) => {
    // REST API documentation
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log("📘 Swagger REST docs available at: http://localhost:3000/api-docs");
    // WebSocket (Socket.io) events
    app.get("/api-docs/socket", (_, res) => {
        res.json({
            tag: "WebSocket",
            namespace: "/chat",
            events: [
                {
                    event: "get-chat-history",
                    direction: "Client → Server",
                    description: "Retrieve private chat history",
                    payloadExample: { receiverId: "68f3f26c62b203ac353e95ff" },
                },
                {
                    event: "send-private-message",
                    direction: "Client → Server",
                    description: "Send a private message",
                    payloadExample: {
                        receiverId: "68f3f26c62b203ac353e95ff",
                        message: "Hello 👋",
                    },
                },
                {
                    event: "send-group-message",
                    direction: "Client → Server",
                    description: "Send a message inside a group",
                    payloadExample: {
                        groupId: "73af93e1d344a92caadc7e12",
                        message: "Hey group!",
                    },
                },
                {
                    event: "get-group-chat",
                    direction: "Client → Server",
                    description: "Fetch group chat messages",
                    payloadExample: { groupId: "73af93e1d344a92caadc7e12" },
                },
                {
                    event: "new-private-message",
                    direction: "Server → Client",
                    description: "Receive a new private message",
                    payloadExample: { from: "user1", text: "How are you?" },
                },
                {
                    event: "new-group-message",
                    direction: "Server → Client",
                    description: "Receive a new group message",
                    payloadExample: {
                        groupId: "...",
                        from: "user1",
                        text: "Welcome everyone!",
                    },
                },
            ],
        });
    });
    // GraphQL queries
    app.get("/api-docs/graphql", (_, res) => {
        res.json({
            tag: "GraphQL",
            endpoint: "/graphql",
            queries: [
                {
                    query: "Profile",
                    description: "Get current user's profile info",
                    example: `query Profile {
  Profile {
    _id
    username
    profilePicture
    coverPicture
    DOB
    email
    phone
  }
}`,
                },
                {
                    query: "BlockedUsers",
                    description: "Get list of blocked users",
                    example: `query BlockedUsers {
  blockUsers {
    _id
    username
    profilePicture
    coverPicture
  }
}`,
                },
                {
                    query: "Requests",
                    description: "Get list of friend requests by status",
                    example: `query Requests($status: friend_status!) {
  Requests(status: $status) {
    _id
    status
    requestFromId {
      _id
      username
      profilePicture
      coverPicture
    }
  }
}`,
                    variablesExample: { status: "pending" },
                },
                {
                    query: "Myposts",
                    description: "Get user's posts (paginated)",
                    example: `query MyPosts($page: Int!) {
  Myposts(page: $page) {
    _id
    content
    attachments
    reactionCount
    commentCount
    sharedCount
    sharedFrom
  }
}`,
                    variablesExample: { page: 1 },
                },
            ],
        });
    });
};
exports.swaggerDocs = swaggerDocs;
