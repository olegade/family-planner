import type { FastifyInstance } from "fastify";
import { listFamilyMembers, createFamilyMember, deleteFamilyMember } from "./family.service.js";

// Register all routes related to family members
export async function registerFamilyRoutes(app: FastifyInstance) {
  app.get("/family-members", async () => {
    const members = await listFamilyMembers();
    return members;
  });

  app.post(
    "/family-members",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "role"],
          properties: {
            name: { type: "string", minLength: 1 },
            role: { type: "string", enum: ["PARENT", "CHILD"] },
            color: { type: "string" }
          },
          additionalProperties: false
        }
      }
    },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        role: "PARENT" | "CHILD";
        color?: string;
      };

      const member = await createFamilyMember(body);

      reply.code(201);
      return member;
    }
  );

    app.delete("/family-members/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    if (!id) {
      reply.code(400);
      return { message: "Id is required" };
    }

    try {
      await deleteFamilyMember(id);
      reply.code(204);
      return null;
    } catch (err) {
      // Could be Prisma error if not found, etc.
      reply.code(404);
      return { message: "Family member not found" };
    }
  });
}