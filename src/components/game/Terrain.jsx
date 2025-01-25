import React from 'react'
import { usePlane } from '@react-three/cannon'
import { DoubleSide } from 'three'
export default function Terrain() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshLambertMaterial color={0xff9988} />
    </mesh>
  )
}