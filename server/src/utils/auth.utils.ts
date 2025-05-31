import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const SALT_ROUNDS = 10;

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this is set in your environment variables

/**
 * Hashes the plain password with bcrypt.
 * @param password - Plain text password
 * @returns Promise<string> - hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compares plain password with hashed password.
 * @param plainPassword - Plain text password
 * @param hashedPassword - Hashed password from DB
 * @returns Promise<boolean> - true if match
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generates a JWT token for user.
 * @param payload - Payload to encode (like user id, email)
 * @param expiresIn - Optional token expiry string like '1h', '7d' etc.
 * @returns string - JWT token
 */
export function generateJWT(
  payload: object,
  expiresIn: SignOptions['expiresIn'] = '1h'
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a JWT token.
 * @param token - JWT token string
 * @returns object | null - decoded payload if valid, null if invalid
 */
export function verifyJWT(token: string): object | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as object;
  } catch (err) {
    // token invalid or expired
    return null;
  }
}
