import { MutationResolvers } from "../../../generated/graphql";
import { UserDAL } from "../../../schema/dal/user.dal";
import { createJwtToken } from "../../../utils/auth";

export const userSignUp: MutationResolvers["userSignUp"] = async (_, { data: { email, name, password } }) => {
    try {

        // For this example, let's assume the user is found in the database.
        const user = await UserDAL.getUserByEmail(email);

        if (user) {
            throw new Error('User already exist with same credentials');
        }

        const userCreated = await UserDAL.createUser({
            email,
            password,
            name
        });

        // If the user is authenticated, create a JWT token and send it in the response.
        const token = createJwtToken(userCreated);
        return {
            accessToken: token,
            message: 'User created successfully'
        };
    } catch (error) {
        throw error;
    }
}