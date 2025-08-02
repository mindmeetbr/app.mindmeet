import { create } from 'zustand'
import { persist, type PersistOptions } from 'zustand/middleware'

interface PreferencesState {
  hideFinancialDetails: boolean
  toggleFinancialDetails: () => void
  setHideFinancialDetails: (hide: boolean) => void
}

type PreferencesPersist = PersistOptions<PreferencesState>

const usePreferencesStore = create<PreferencesState>()(
  persist<PreferencesState, [], [], PreferencesPersist>(
    (set, get): PreferencesState => ({
      hideFinancialDetails: false,
      toggleFinancialDetails: () => set(state => ({ 
        hideFinancialDetails: !state.hideFinancialDetails 
      })),
      setHideFinancialDetails: (hide) => set({ hideFinancialDetails: hide }),
    }),
    {
      name: 'mindmeet-preferences',
    }
  )
)

export default usePreferencesStore