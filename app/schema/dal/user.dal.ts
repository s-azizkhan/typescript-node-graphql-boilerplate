import User, { UserInput, UserOutput } from "../models/User.model";

export class UserDAL {
  static async createUser(userData: UserInput): Promise<UserOutput> {
    const user = await User.create(userData);
    return user;
  }

  static async getUserByEmail(email: string): Promise<UserOutput | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  static async findOrCreateUserByEmail(email: string): Promise<UserOutput> {
    const user = await this.getUserByEmail(email);
    if (user) return user;
    // create name from email
    const name = email.replace(/.@*/, "");
    // random password
    const password = Math.random().toString(36).substring(2);
    const newUser = await User.create({ email, name, password });
    return newUser;
  }
}