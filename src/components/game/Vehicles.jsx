import React from 'react'
import { useBox } from '@react-three/cannon'

function Vehicle({ position, color }/*: { position: [number, number, number]; color: string }*/) {
  const [ref] = useBox(() => ({ mass: 1, position, args: [2, 1, 3] }))

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 1, 3]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function Vehicles() {
  return (
    <>
      <Vehicle position={[-10, 0.5, 0]} color="red" />
      <Vehicle position={[10, 0.5, -5]} color="blue" />
    </>
  )
}

