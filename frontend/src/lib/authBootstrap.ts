//src/lib/authBootstrap.ts

import { setAccessToken, clearAccessToken } from '@/lib/authToken'
import { BASE_URL } from '@/lib/config'


export async function authBootstrap() {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        })

        const json = await res.json().catch(() => null)
        const payload = json?.data ?? json  // unwrap

        if (!res.ok || !payload?.access_token) {
            clearAccessToken()
            return false
        }

        setAccessToken(payload.access_token)
        return true
    } catch {
        clearAccessToken()
        return false
    }
}