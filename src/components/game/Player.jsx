import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { Vector3 } from 'three'

// Simple input management
const keys = { w: false, s: false, a: false, d: false }


export default function Player() {
  const { camera } = useThree()
  const [ref, boxPhysical] = useBox(() => ({ mass: 1, position: [0, 1, 0], args: [2, 1.5, 3] }),)
  const velocity = useRef([0, 0, 0])
  useEffect(() => {
    if (typeof document != 'undefined') {
      const keydown = (e) => (keys[e.key.toLowerCase()] = true)
      const keyup = (e) => (keys[e.key.toLowerCase()] = false)

      document.addEventListener('keydown', keydown)
      document.addEventListener('keyup', keyup)
      return () => {
        document.removeEventListener('keydown', keydown)
        document.removeEventListener('keyup', keyup)
      }
    }
  }, [])
  const direction = useMemo(() => new Vector3(), [])
  const frontVector = useMemo(() => new Vector3(), [])
  const sideVector = useMemo(() => new Vector3(), [])
  const cameraOffset = useMemo(() => new Vector3(0, 5, 10), [])

  const position = useMemo(() => new Vector3(), [])
  useFrame(() => {
    direction.set(0, 0, 0)

    frontVector.set(0, 0, Number(keys.s) - Number(keys.w))
    sideVector.set(Number(keys.a) - Number(keys.d), 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(5).applyEuler(camera.rotation)

    boxPhysical.velocity.set(direction.x, velocity.current[1], direction.z)

    if (ref.current) {
      position.setFromMatrixPosition(ref.current.matrixWorld)
      camera.position.copy(position).add(cameraOffset)
      camera.lookAt(position)
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 1.5, 3]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}
