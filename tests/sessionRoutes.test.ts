import request from "supertest";
import { hashPassword } from "../src/utils/hashAndVerifyPassword.js";
import { prismaMock, resetPrismaMock } from "./helpers/prismaMock.js";

jest.mock("../src/libs/prisma.js", () => ({
  prisma: require("./helpers/prismaMock.js").prismaMock,
}));

import { app } from "../src/app.js";

describe("session routes", () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it("returns a token and the sanitized user on login", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Mari",
      email: "mari@email.com",
      password: await hashPassword("123456"),
      role: "member",
      createdAt: new Date("2026-05-21T00:00:00.000Z"),
      updatedAt: new Date("2026-05-21T00:00:00.000Z"),
    });

    const response = await request(app).post("/sessions").send({
      email: "mari@email.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      id: "user-1",
      email: "mari@email.com",
      role: "member",
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it("returns 401 when credentials are invalid", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Mari",
      email: "mari@email.com",
      password: await hashPassword("123456"),
      role: "member",
      createdAt: new Date("2026-05-21T00:00:00.000Z"),
      updatedAt: new Date("2026-05-21T00:00:00.000Z"),
    });

    const response = await request(app).post("/sessions").send({
      email: "mari@email.com",
      password: "wrong-pass",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Credentials" });
  });
});
