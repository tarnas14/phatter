import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Tapper } from './Tapper'

const MOVES = [
  "running man",
  "t-step",
  "poli pocket",
  "slide",
]

const getRandomMove = () => {
  return MOVES[Math.floor((Math.random() * MOVES.length))]
}

function App() {
  const [tick, setTick] = useState(NaN)
  const [tickingBpm, setTickingBpm] = useState(NaN)
  const [chosenBpm, setChosenBpm] = useState(120)
  const [tappedBpm, setTappedBpm] = useState(NaN)
  const [moves, setMoves] = useState([{ tick: 0, move: getRandomMove() }])
  const intervalId = useRef(null)

  const onStart = () => {
    setMoves(m => m.length === 1 ? m : [{ tick: 0, move: getRandomMove() }])
    clearInterval(intervalId.current)
    setTick(0)

    const bpm = chosenBpm || tappedBpm
    setTickingBpm(bpm)
    const interval = Math.round((1000 * 60)/bpm)
    intervalId.current = setInterval(() => setTick(t => t + 1), interval)
  }

  const count = Number.isNaN(tick) ? NaN : (tick % 8) + 1

  useEffect(() => () => clearInterval(intervalId.current), []);

  useEffect(() => {
    if (Number.isNaN(tickingBpm)) {
      return
    }

    if (count !== 0 && count % 5 === 0) {
      setMoves(m => [...m, { tick: tick, move: getRandomMove() }])
    }
  }, [tick, tickingBpm, count])

  return <>
    <div>COUNT: {!count ? null : count}</div>
    <div className="moves">
      <div className="move previous">t-step</div>
      <div className="move main">running man</div>
      <div className="move next">poli pocket</div>
      <div className="move prepared">happy feet</div>
    </div>
    
    <button onClick={onStart}>start</button>
    <div>BPM</div>
    <div style={{ display: 'flex', gridRowGap: '1em' }}>
      {fiveBelow(tappedBpm) || "?"} {tappedBpm || "?"} {fiveAbove(tappedBpm) || "?"}
    </div>
    <Tapper onBpmChange={setTappedBpm} />
  </>
}

export default App

function fiveAbove(bpm) {
  if (Number.isNaN(bpm)) {
    return NaN
  }

  if (bpm % 5 === 0) {
    return bpm + 5
  }

  return Math.ceil(bpm / 5) * 5
}

function fiveBelow(bpm) {
  if (Number.isNaN(bpm)) {
    return NaN
  }

  if (bpm % 5 === 0) {
    return bpm - 5
  }

  return Math.floor(bpm / 5) * 5
}

// {moves.slice(-3).map(({ tick, move }, index) => <div key={tick} className={`move ${index === 1 ? 'main' : ''}`}>{move}</div>)}
