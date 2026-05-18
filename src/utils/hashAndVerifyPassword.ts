import bcrypt from 'bcrypt';
import { AppError } from './AppError.js';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function verifyPassword(password: string, userPassword: string) {
  const passwordMatch = await bcrypt.compare(password, userPassword);

  if (!passwordMatch) throw new AppError('Invalid Credentials', 401);
  return passwordMatch;
}
