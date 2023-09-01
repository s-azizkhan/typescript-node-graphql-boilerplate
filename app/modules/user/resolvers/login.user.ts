import { MutationResolvers } from "../../../generated/graphql";
import { UserDAL } from "../../../schema/dal/user.dal";
import { createJwtToken } from "../../../utils/auth";

export const userLogin: MutationResolvers["userSignIn"] = async (_, { data: { email, password } }) => {
    try {

        // For this example, let's assume the user is found in the database.
        const user = await UserDAL.getUserByEmail(email);

        if (!user) {
            throw new Error('User already exist with same credentials');
        }

        // validate password
        const validPass = await user.verifyPassword(password);
        if (!validPass) {
            throw new Error('Authentication failed.');
        }
        // If the user is authenticated, create a JWT token and send it in the response.
        const token = createJwtToken(user);
        return {
            accessToken: token,
            message: 'Logged in successfully.'
        };
    } catch (error) {
        throw error;
    }
}