export interface UserLogin {
    username: string
    password: string
}

export interface PayloadOfRequest {
    username: string
    userid: number
    [propName: string]: any
}

export interface UserSearch {
    id?: number
    username?: string
    active?: number
}