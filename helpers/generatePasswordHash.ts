import { hash, compare } from "bcryptjs";

export async function generatePasswordHash(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPasswordHash(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}
