export const config = {
  port: 5001,
  corsOptions: {
    origin: "http://127.0.0.1:8080",
  },
  swaggerOptions: {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Proof of Equity API",
        description: "API that is used together with poe-ui and poe-contract",
      },
    },
    apis: ["src/swagger.yaml"],
  },
};
