import { create } from 'zustand'

interface FilterState {
  search: string
  sortBy: string
  statusFilter: string
  setSearch: (val: string) => void
  setSortBy: (val: string) => void
  setStatusFilter: (val: string) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  search: '',
  sortBy: 'terbaru',
  statusFilter: 'all',
  setSearch: (search) => set({ search }),
  setSortBy: (sortBy) => set({ sortBy }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}))