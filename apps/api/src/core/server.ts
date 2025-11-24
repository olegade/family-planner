import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerFamilyRoutes } from "../modules/family/family.routes.js";

// Builds and configures the Fastify server instance
export function buildServer(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  // Enable CORS so the frontend on localhost:3000 can call this API
  app.register(cors, {
    origin: "http://localhost:3000"
    // If you want to allow everything during dev, you could also use:
    // origin: true
  });


  // Health endpoint to verify the API is running
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Register domain routes
  registerFamilyRoutes(app);

  return app;
}