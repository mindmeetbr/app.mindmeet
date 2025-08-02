import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import type { Jwt } from '../api/models'

export type UserData = Jwt['user']

type AccessToken = {
  role?: string[]
  [key: string]: any
}

interface AuthState {
  isAuthenticated: boolean
  user: UserData | null
  accessToken: string | null
  setUser: (userData: UserData) => void
  setAccessToken: (accessToken: string) => void
  login: (accessToken: string) => void
  logout: () => void
  limparStorage: () => void
}

type AuthPersist = PersistOptions<AuthState>

const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], AuthPersist>(
    (set): AuthState => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setUser: userData => set({ user: userData }),
      setAccessToken: accessToken => set({ accessToken }),
      login: (accessToken) => {
        const decodedToken: AccessToken = jwtDecode(accessToken)
        const userData = decodedToken.user
        set({
          user: userData,
          isAuthenticated: true,
          accessToken
        })
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
        })
      },
      limparStorage: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null
        })
      },
    }),
    {
      name: 'mindmeet-storage',
    }
  )
)

export default useAuthStore