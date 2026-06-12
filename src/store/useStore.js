import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      couple: { name1: 'Ti', name2: 'Ona' },
      trips: [],
      bucketList: [],

      setCouple: (name1, name2) => set({ couple: { name1, name2 } }),

      addTrip: (trip) =>
        set((state) => ({
          trips: [
            ...state.trips,
            {
              ...trip,
              id: crypto.randomUUID(),
              itinerary: [],
              packingList: [],
              expenses: [],
              notes: '',
            },
          ],
        })),

      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTrip: (id) =>
        set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),

      addActivity: (tripId, day, activity) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t
            const itinerary = [...t.itinerary]
            const dayIdx = itinerary.findIndex((d) => d.day === day)
            if (dayIdx >= 0) {
              itinerary[dayIdx] = {
                ...itinerary[dayIdx],
                activities: [
                  ...itinerary[dayIdx].activities,
                  { ...activity, id: crypto.randomUUID(), done: false },
                ],
              }
            } else {
              itinerary.push({ day, activities: [{ ...activity, id: crypto.randomUUID(), done: false }] })
            }
            return { ...t, itinerary }
          }),
        })),

      toggleActivity: (tripId, day, activityId) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t
            return {
              ...t,
              itinerary: t.itinerary.map((d) => {
                if (d.day !== day) return d
                return {
                  ...d,
                  activities: d.activities.map((a) =>
                    a.id === activityId ? { ...a, done: !a.done } : a
                  ),
                }
              }),
            }
          }),
        })),

      deleteActivity: (tripId, day, activityId) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== tripId) return t
            return {
              ...t,
              itinerary: t.itinerary.map((d) => {
                if (d.day !== day) return d
                return { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
              }),
            }
          }),
        })),

      addExpense: (tripId, expense) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id !== tripId
              ? t
              : { ...t, expenses: [...(t.expenses || []), { ...expense, id: crypto.randomUUID() }] }
          ),
        })),

      deleteExpense: (tripId, expenseId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id !== tripId
              ? t
              : { ...t, expenses: (t.expenses || []).filter((e) => e.id !== expenseId) }
          ),
        })),

      addPackingItem: (tripId, item) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  packingList: [
                    ...(t.packingList || []),
                    { ...item, id: crypto.randomUUID(), packed: false },
                  ],
                }
          ),
        })),

      togglePackingItem: (tripId, itemId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  packingList: (t.packingList || []).map((i) =>
                    i.id === itemId ? { ...i, packed: !i.packed } : i
                  ),
                }
          ),
        })),

      deletePackingItem: (tripId, itemId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id !== tripId
              ? t
              : { ...t, packingList: (t.packingList || []).filter((i) => i.id !== itemId) }
          ),
        })),

      addBucketItem: (item) =>
        set((state) => ({
          bucketList: [...state.bucketList, { ...item, id: crypto.randomUUID(), done: false }],
        })),

      toggleBucketItem: (id) =>
        set((state) => ({
          bucketList: state.bucketList.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        })),

      deleteBucketItem: (id) =>
        set((state) => ({ bucketList: state.bucketList.filter((i) => i.id !== id) })),

      resetAll: () =>
        set({ trips: [], bucketList: [], couple: { name1: 'Ti', name2: 'Ona' } }),
    }),
    { name: 'nas-odmor-storage' }
  )
)

export default useStore
