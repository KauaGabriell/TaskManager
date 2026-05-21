import jwt from "jsonwebtoken";
import { authConfig } from "../../src/configs/auth.js";

function makeAuthToken(user: { id: string; role: string }) {
  return jwt.sign({ role: user.role }, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
    subject: user.id,
  });
}

export { makeAuthToken };
