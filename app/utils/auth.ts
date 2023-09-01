import jwt from 'jsonwebtoken';
import { configData } from '../config/config';
import User from '../schema/models/User.model';
import UserInterface from '../interfaces/user.interface';

interface JwtPayload {
    id: string;
    email: string;
}

interface JwtDecoded extends JwtPayload {
    id: string;
    email: string;
    exp: number;
    iat: number;
}
export function createJwtToken(user: UserInterface): string {
    const payload: JwtPayload = {
        id: user.id,
        email: user.email
    }
    return jwt.sign(payload, configData.JWT_SECRET, {
        expiresIn: configData.JWT_EXPIRATION
    })
}

export async function decodeJwtToken(token: string) {
    try {
        const decoded = jwt.verify(token, configData.JWT_SECRET) as JwtDecoded;
        return decoded;
    } catch (error) {
        return null; // Invalid token or token has expired.
    }
}

export async function getUserFromToken(token?: string) {
    if (!token) return null;

    const decoded = await decodeJwtToken(token);
    if (!decoded) return null;

    // check expiration
    if (decoded.exp < Date.now() / 1000) {
        return null;
    }

    // get the user by id
    const user = await User.findByPk(decoded.id);

    return user;

}