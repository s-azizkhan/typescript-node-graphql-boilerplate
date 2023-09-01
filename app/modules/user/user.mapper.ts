import { UserData } from "../../generated/graphql";
import User from "../../schema/models/User.model";

export default class UserMapper {
    constructor() {

    }
    public static toUser(user: User): UserData {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
} 