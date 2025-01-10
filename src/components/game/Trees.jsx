import React from 'react'
import { useBox, useCylinder } from '@react-three/cannon'

function Tree({ position }/*: { position: [number, number, number] }*/) {
  const [trunkRef] = useCylinder(() => ({ mass: 1, position, args: [0.2, 0.2, 1.5, 16] }))
  const [leavesRef] = useBox(() => ({ mass: 1, position: [position[0], position[1] + 1.5, position[2]], args: [1, 1.5, 1] }))

  return (
    <group>
      <mesh ref={trunkRef} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh ref={leavesRef} castShadow>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  )
}

export default function Trees() {
  return (
    <>
      <Tree position={[-8, 0.75, -8]} />
      <Tree position={[8, 0.75, 8]} />
      <Tree position={[-3, 0.75, 10]} />
      <Tree position={[12, 0.75, -5]} />
    </>
  )
}

