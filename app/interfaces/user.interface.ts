export interface AuthenticationSuccessInterface {
    accessToken: string
};

export default interface UserInterface {
    id: string,
    name: string,
    email: string,
    createdAt: Date
    updatedAt?: Date
    deletedAt?: Date
};