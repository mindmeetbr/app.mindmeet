import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'
import type { CustomJWT } from '../api/models'

export type UserData = CustomJWT['user']

// type AccessToken = {
//   role?: string[]
//   [key: string]: any
// }

interface AuthState {
  isAuthenticated: boolean
  user: UserData | null
  accessToken: string | null
  refreshToken: string | null
  setUser: (userData: UserData) => void
  setAccessToken: (accessToken: string) => void
  setRefreshToken: (refreshToken: string) => void
  login: (accessToken: string, refreshToken: string) => void
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
      refreshToken: null,
      setUser: userData => set({ user: userData }),
      setAccessToken: accessToken => set({ accessToken }),
      setRefreshToken: refreshToken => set({ refreshToken }),
      login: (accessToken, refreshToken) => {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
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
          accessToken: null,
        })
      },
    }),
    {
      name: 'mindmeet-storage',
    }
  )
)

export default useAuthStore
