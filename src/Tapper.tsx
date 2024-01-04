import { useEffect, useCallback, useMemo, useState } from 'react'

const avg = (things) => things.length === 0 ? NaN : Math.round(things.reduce((a, b) => a+b, 0) / things.length)

export function Tapper({ onBpmChange }) {
  const [taps, setTaps] = useState([])

  const deltas = useMemo(() => {
    if (taps.length < 2) {
      return [] 
    }

    const [head, ...tail] = taps

    return tail.reduce((accu, tap, previousTapIndex) => {
      const previousTap = taps[previousTapIndex]

      if (!previousTap) {
        return accu
      }

      const delta = tap - previousTap

      return [
        ...accu,
        delta
      ]
    }, [])
    }, [taps])

  const averageBpm = useMemo(() => {
    const bpms = deltas.map(delta => Math.round((1000 * 60) / delta))

    return avg(bpms)
  }, [deltas])

  useEffect(() => {
    onBpmChange(averageBpm)
    }, [averageBpm, onBpmChange])

  const onTap = useCallback(() => {
    const now = new Date()

    const nowDelta = now - taps[taps.length - 1]
    const avgDelta = avg(deltas)
    if (Number.isNaN(nowDelta) || Number.isNaN(avgDelta)) {
      setTaps(t => [...t, now])

      return
    }

    if ((nowDelta / avgDelta) > 1.1) {
      setTaps([now])

      return
    }

    setTaps(t => [...t, now])
  }, [deltas, taps])

  return (
  <>
    <button onClick={onTap}>tap</button>
  </>
  )
}
