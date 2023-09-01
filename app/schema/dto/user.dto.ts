export type CreateUserDTO = {
    name?: string,
    email: string,
    password: string
}
export type LoginUserDTO = Exclude<CreateUserDTO, 'name' >

export type UpdateUserDTO = Exclude<CreateUserDTO, 'password' | 'email'>