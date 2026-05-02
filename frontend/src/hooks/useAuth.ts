
import {authService, type LoginRequest} from "@/services/authService.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {clearAccessToken} from "@/lib/authToken.ts";


export const authKeys = {
    me: ['auth', 'me'] as const
}


export const meQueryOptions = () => ({
    queryKey: authKeys.me,
    queryFn: async () => {
        const user = await authService.getMe()
        if (!user) throw new Error('Not authenticated')
        return user
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
})

export const useLogin = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (creds: LoginRequest) => authService.login(creds),
        onSuccess:(res) => {
            if (res.ok){
                qc.invalidateQueries({queryKey: authKeys.me})
            }
        }
    })

}

export const useLogout = () => {
 const qc = useQueryClient()

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearAccessToken()  // 👈 missing this
            qc.invalidateQueries({ queryKey: authKeys.me })
            qc.clear()          // 👈 clear all cached queries
        },
    })
}