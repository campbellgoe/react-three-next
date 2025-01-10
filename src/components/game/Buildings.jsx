import React from 'react'
import { useBox } from '@react-three/cannon'

function Building({ position, size }/*: { position: [number, number, number]; size: [number, number, number] }*/) {
  const [ref] = useBox(() => ({ mass: 1, position, args: size }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="lightgray" />
    </mesh>
  )
}

export default function Buildings() {
  return (
    <>
      <Building position={[-5, 2, -5]} size={[4, 4, 4]} />
      <Building position={[5, 1.5, 5]} size={[3, 3, 3]} />
      <Building position={[0, 3, -10]} size={[6, 6, 6]} />
    </>
  )
}