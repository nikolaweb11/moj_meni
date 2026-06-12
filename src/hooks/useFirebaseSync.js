import { useEffect, useRef } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, isConfigured } from '../firebase'
import useStore from '../store/useStore'

const DATA_DOC = () => doc(db, 'moj-meni', 'shared')

export function useFirebaseSync() {
  const trips = useStore((s) => s.trips)
  const bucketList = useStore((s) => s.bucketList)
  const couple = useStore((s) => s.couple)

  const lastRemote = useRef(null)
  const isReady = useRef(false)
  const writeTimer = useRef(null)

  useEffect(() => {
    if (!isConfigured) return

    const unsub = onSnapshot(
      DATA_DOC(),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          // Store what we received so write effect can detect local-only changes
          lastRemote.current = JSON.stringify({
            trips: data.trips ?? [],
            bucketList: data.bucketList ?? [],
            couple: data.couple ?? {},
          })
          useStore.setState({
            trips: data.trips ?? [],
            bucketList: data.bucketList ?? [],
            couple: data.couple ?? useStore.getState().couple,
          })
        } else {
          // First run — push local localStorage data up to Firestore
          const { trips, bucketList, couple } = useStore.getState()
          setDoc(DATA_DOC(), { trips, bucketList, couple, updatedAt: Date.now() }).catch(console.warn)
        }
        isReady.current = true
      },
      (err) => {
        console.warn('[Firebase] listener error:', err)
        isReady.current = true
      }
    )

    return unsub
  }, [])

  // Write local changes to Firestore (debounced 800ms)
  useEffect(() => {
    if (!isConfigured || !isReady.current) return

    const current = JSON.stringify({ trips, bucketList, couple })
    if (current === lastRemote.current) return // just received this from Firestore, skip

    clearTimeout(writeTimer.current)
    writeTimer.current = setTimeout(() => {
      const s = useStore.getState()
      setDoc(DATA_DOC(), {
        trips: s.trips,
        bucketList: s.bucketList,
        couple: s.couple,
        updatedAt: Date.now(),
      }).catch(console.warn)
    }, 800)

    return () => clearTimeout(writeTimer.current)
  }, [trips, bucketList, couple])
}
