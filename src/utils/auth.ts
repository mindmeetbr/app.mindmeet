import { redirect } from '@tanstack/react-router'
import useAuthStore from '../stores/auth-store'
import type { PapelEnum } from '../api/models'

export function exigirPapel(...papeis: PapelEnum[]) {
  return () => {
    const { user } = useAuthStore.getState()

    if (!user || !papeis.includes(user.papel as PapelEnum)) {
      throw redirect({ to: '/app' })
    }
  }
}
