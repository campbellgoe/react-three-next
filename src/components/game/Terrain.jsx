import React from 'react'
import { usePlane } from '@react-three/cannon'
// import { MeshReflectorMaterial } from '@react-three/drei'
import { DoubleSide } from 'three'

export default function Terrain() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={0xff9988} />
      {/* <MeshReflectorMaterial
        side={DoubleSide}
        mirror={0}
        roughness={0.7}
        color={0xffcc00}
        metalness={0.05}
      /> */}
    </mesh>
  )
}