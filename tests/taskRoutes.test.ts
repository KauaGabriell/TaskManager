import request from "supertest";
import { app } from "../src/app.js";
import { makeAuthToken } from "./helpers/auth.js";
import { prismaMock, resetPrismaMock } from "./helpers/prismaMock.js";

jest.mock("../src/libs/prisma.js", () => ({
  prisma: require("./helpers/prismaMock.js").prismaMock,
}));

describe("task routes", () => {
  const adminUser = { id: "11111111-1111-4111-8111-111111111111", role: "admin" };
  const memberUser = { id: "22222222-2222-4222-8222-222222222222", role: "member" };
  const teammateUserId = "33333333-3333-4333-8333-333333333333";
  const teamId = "44444444-4444-4444-8444-444444444444";
  const taskId = "55555555-5555-4555-8555-555555555555";

  beforeEach(() => {
    resetPrismaMock();
  });

  it("returns only member-owned tasks in index", async () => {
    prismaMock.task.findMany.mockResolvedValue([{ id: "task-1", title: "Own task" }]);

    const response = await request(app)
      .get("/tasks?status=pending")
      .set("Authorization", `Bearer ${makeAuthToken(memberUser)}`);

    expect(response.status).toBe(200);
    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        priority: undefined,
        status: "pending",
        user_id: memberUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    expect(response.body).toEqual([{ id: "task-1", title: "Own task" }]);
  });

  it("allows admin to list tasks without user filter", async () => {
    prismaMock.task.findMany.mockResolvedValue([{ id: "task-1", title: "Any task" }]);

    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${makeAuthToken(adminUser)}`);

    expect(response.status).toBe(200);
    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        priority: undefined,
        status: undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  it("creates a task when member belongs to the team and assigned user is also in the team", async () => {
    prismaMock.teamMember.findUniqueOrThrow
      .mockResolvedValueOnce({ user_id: memberUser.id, team_id: teamId })
      .mockResolvedValueOnce({ user_id: teammateUserId, team_id: teamId });
    prismaMock.task.create.mockResolvedValue({
      id: taskId,
      title: "Implement endpoint",
      priority: "high",
    });

    const response = await request(app)
      .post(`/tasks/teams/${teamId}`)
      .set("Authorization", `Bearer ${makeAuthToken(memberUser)}`)
      .send({
        title: "Implement endpoint",
        description: "Create tests",
        priority: "high",
        assignedTo: teammateUserId,
      });

    expect(response.status).toBe(201);
    expect(prismaMock.teamMember.findUniqueOrThrow).toHaveBeenNthCalledWith(1, {
      where: {
        user_id_team_id: {
          user_id: memberUser.id,
          team_id: teamId,
        },
      },
    });
    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        title: "Implement endpoint",
        description: "Create tests",
        priority: "high",
        assigned_to: { connect: { id: teammateUserId } },
        team: { connect: { id: teamId } },
      },
    });
  });

  it("creates a status log when task status changes", async () => {
    prismaMock.task.findUniqueOrThrow.mockResolvedValue({
      id: taskId,
      user_id: memberUser.id,
      team_id: teamId,
      status: "pending",
    });
    prismaMock.task.update.mockResolvedValue({
      id: taskId,
      status: "completed",
    });
    prismaMock.taskHistory.create.mockResolvedValue({
      id: "log-1",
    });

    const response = await request(app)
      .patch(`/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${makeAuthToken(memberUser)}`)
      .send({
        status: "completed",
      });

    expect(response.status).toBe(200);
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: taskId },
      data: { status: "completed" },
    });
    expect(prismaMock.taskHistory.create).toHaveBeenCalledWith({
      data: {
        task: { connect: { id: taskId } },
        changedBy: { connect: { id: memberUser.id } },
        oldStatus: "pending",
        newStatus: "completed",
      },
    });
  });

  it("returns task logs only for admin users", async () => {
    prismaMock.taskHistory.findMany.mockResolvedValue([
      {
        id: "log-1",
        oldStatus: "pending",
        newStatus: "completed",
        changedBy: { id: adminUser.id, name: "Admin" },
      },
    ]);

    const response = await request(app)
      .get(`/tasks/${taskId}/logs`)
      .set("Authorization", `Bearer ${makeAuthToken(adminUser)}`);

    expect(response.status).toBe(200);
    expect(prismaMock.taskHistory.findMany).toHaveBeenCalledWith({
      where: { task_id: taskId },
      select: {
        id: true,
        oldStatus: true,
        newStatus: true,
        changedAt: true,
        changedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { changedAt: "desc" },
    });
  });
});
