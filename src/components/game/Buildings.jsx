import React, { useEffect } from 'react'
import { useBox } from '@react-three/cannon'

function Building({ position, size }/*: { position: [number, number, number]; size: [number, number, number] }*/) {
  const [ref, api] = useBox(() => ({
    mass: 1, position, args: size, userData: {
      attachable: true,
      attachOffset: size, // offset from player center when attached
    }
  }))
  // Example of creating an attachable object in your Game.jsx or similar component
  useEffect(() => {
    if (ref.current) {
      ref.current.api = api
    }
  }, [api])
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