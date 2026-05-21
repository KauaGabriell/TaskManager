import { AppError } from "../../src/utils/AppError.js";
import { hashPassword, verifyPassword } from "../../src/utils/hashAndVerifyPassword.js";

describe("hashAndVerifyPassword", () => {
  it("hashes and verifies a valid password", async () => {
    const hash = await hashPassword("123456");

    await expect(verifyPassword("123456", hash)).resolves.toBe(true);
  });

  it("throws AppError for an invalid password", async () => {
    const hash = await hashPassword("123456");

    await expect(verifyPassword("wrong-password", hash)).rejects.toBeInstanceOf(AppError);
  });
});
