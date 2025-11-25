import type { FastifyInstance } from "fastify";
import {
  listFamilyEvents,
  createFamilyEvent,
  deleteFamilyEvent,
} from "./events.service.js";

export async function registerEventRoutes(app: FastifyInstance) {
  // GET /family-events
  app.get("/family-events", async (request) => {
    const { from, to } = request.query as {
      from?: string;
      to?: string;
    };

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const events = await listFamilyEvents({
      from: fromDate,
      to: toDate,
    });

    return events;
  });

  // POST /family-events
  app.post(
    "/family-events",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "start", "end", "familyMemberId"],
          properties: {
            title: { type: "string", minLength: 1 },
            start: { type: "string", format: "date-time" },
            end: { type: "string", format: "date-time" },
            location: { type: "string" },
            familyMemberId: { type: "string", minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        title: string;
        start: string;
        end: string;
        location?: string;
        familyMemberId: string;
      };

      const startDate = new Date(body.start);
      const endDate = new Date(body.end);

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        reply.code(400);
        return { message: "Invalid start or end datetime" };
      }

      if (endDate < startDate) {
        reply.code(400);
        return { message: "End must be after start" };
      }

      try {
        const event = await createFamilyEvent({
          title: body.title.trim(),
          start: startDate,
          end: endDate,
          location: body.location?.trim() || null,
          familyMemberId: body.familyMemberId,
        });

        reply.code(201);
        return event;
      } catch {
        reply.code(400);
        return { message: "Could not create event (invalid familyMemberId?)" };
      }
    }
  );

  // DELETE /family-events/:id
  app.delete("/family-events/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    if (!id) {
      reply.code(400);
      return { message: "Id is required" };
    }

    try {
      await deleteFamilyEvent(id);
      reply.code(204);
      return null;
    } catch {
      reply.code(404);
      return { message: "Event not found" };
    }
  });
}