// src/services/authService.ts
import {apiClient} from "@/lib/apiClient.ts";
import {setAccessToken} from "@/lib/authToken.ts";

export interface AdminUser{
    id: string
    email: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    expires_in: number
    user: AdminUser
}


export const authService ={
    async getMe(): Promise<AdminUser | null> {
        const res = await apiClient.get<AdminUser>('/api/admin/me')
        return res.ok ? res.data : null

    },
    async login(creds: LoginRequest) {
        const res =  await apiClient.post<LoginResponse>('/api/auth/login', creds)

        if (res.ok){
            setAccessToken(res.data.access_token)
        }
        return res
    },

    async logout() {
        return apiClient.post('/api/auth/logout')
    }
}