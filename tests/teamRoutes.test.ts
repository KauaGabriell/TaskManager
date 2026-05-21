import request from "supertest";
import { app } from "../src/app.js";
import { makeAuthToken } from "./helpers/auth.js";
import { prismaMock, resetPrismaMock } from "./helpers/prismaMock.js";

jest.mock("../src/libs/prisma.js", () => ({
  prisma: require("./helpers/prismaMock.js").prismaMock,
}));

describe("team routes", () => {
  const adminUser = { id: "11111111-1111-4111-8111-111111111111", role: "admin" };
  const memberUser = { id: "22222222-2222-4222-8222-222222222222", role: "member" };

  beforeEach(() => {
    resetPrismaMock();
  });

  it("allows admin to create a team", async () => {
    prismaMock.team.create.mockResolvedValue({
      id: "team-1",
      name: "Backend",
      description: "API team",
      createdAt: new Date("2026-05-21T00:00:00.000Z"),
      updatedAt: new Date("2026-05-21T00:00:00.000Z"),
    });

    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${makeAuthToken(adminUser)}`)
      .send({
        name: "Backend",
        description: "API team",
      });

    expect(response.status).toBe(201);
    expect(prismaMock.team.create).toHaveBeenCalledWith({
      data: {
        description: "API team",
        name: "Backend",
      },
    });
  });

  it("blocks member from listing teams", async () => {
    const response = await request(app)
      .get("/teams")
      .set("Authorization", `Bearer ${makeAuthToken(memberUser)}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("returns teams for admin ordered by controller query", async () => {
    prismaMock.team.findMany.mockResolvedValue([
      { id: "team-2", name: "Frontend" },
      { id: "team-1", name: "Backend" },
    ]);

    const response = await request(app)
      .get("/teams")
      .set("Authorization", `Bearer ${makeAuthToken(adminUser)}`);

    expect(response.status).toBe(200);
    expect(prismaMock.team.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
    });
    expect(response.body).toHaveLength(2);
  });
});
