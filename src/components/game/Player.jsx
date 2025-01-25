import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import { Vector3, Quaternion } from 'three'

// Simple input management
const keys = { w: false, s: false, a: false, d: false }


export default function Player() {
  const { camera } = useThree()
  const attachedObjects = useRef(new Set())
  const handleCollision = (event) => {
    const { body, target } = event
    // Check if the colliding object is marked as "attachable"
    if (body.userData?.attachable && body.api) {
      attachedObjects.current.add(body)
      // Disable physics for the attached object using the stored api
      body.api.sleep()
    }
  }
  const rotationSpeed = 2.5 // Adjust this value to control rotation speed
  const maxRotationSpeed = 0.1 // Maximum rotation per frame
  const boxHeight = 0.5
  const [ref, boxPhysical] = useBox(() => ({
    mass: 0.5,
    position: [0, 1.5, 0],
    args: [2, boxHeight, 3],
    onCollide: handleCollision,
    linearDamping: 0.5,
    angularDamping: 0.9, // Increased angular damping
    // Lock rotation except for Y axis
    fixedRotation: true,
    // Alternative: can specify which rotations to allow/prevent
    canRotate: [false, true, false], // [x, y, z]
  }))

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

  const speed = useRef(0)
  const rotation = useRef(0)
  const targetHoverHeight = useRef(1.5) // Default hover height
  const currentHoverHeight = useRef(1.5)
  const MIN_HOVER_HEIGHT = 0.5
  const MAX_HOVER_HEIGHT = 4
  let HOVER_CHANGE_SPEED = 9.81 * 0.333 // Units per second
  useFrame((state, delta) => {
    // Calculate acceleration and braking
    if (keys.w) speed.current = Math.min(speed.current + 0.1, 5) // Accelerate forward
    else if (keys.s) speed.current = Math.max(speed.current - 0.2, -2) // Brake/reverse
    else speed.current *= 0.98 // Natural deceleration

    const rotationAmount = delta * rotationSpeed
    if (keys.d) {
      // Rotate right, reverse direction when going backwards
      rotation.current += Math.min(rotationAmount * Math.sign(speed.current), maxRotationSpeed)
    }
    if (keys.a) {
      // Rotate left, reverse direction when going backwards
      rotation.current -= Math.min(rotationAmount * Math.sign(speed.current), maxRotationSpeed)
    }

    // Apply movement based on current speed and rotation
    direction.set(
      Math.sin(rotation.current) * speed.current,
      0,
      Math.cos(rotation.current) * speed.current
    )

    // Apply physics
    boxPhysical.velocity.set(direction.x, velocity.current[1], direction.z)

    // Update quaternion for actual rotation of the physics body
    const quaternion = new Quaternion()
    quaternion.setFromAxisAngle(new Vector3(0, 1, 0), rotation.current)
    boxPhysical.quaternion.copy(quaternion)


    // Update hover height based on Q and E keys
    let hoverForce = 9.81 * 0.333;
    if (keys.q) {

      HOVER_CHANGE_SPEED += 9.81 * 2;
      hoverForce += HOVER_CHANGE_SPEED * delta;
    }
    if (keys.e) {

      HOVER_CHANGE_SPEED += 9.81 * 2;
      hoverForce -= HOVER_CHANGE_SPEED * delta;
    }

    HOVER_CHANGE_SPEED *= 0.99;


    // Get current rotation
    const currentRotation = ref.current.rotation;

    // Apply stabilizing torque if tilted
    const stabilizationForce = 50 // Adjust this value to change how quickly it stabilizes
    boxPhysical.applyTorque([
      -currentRotation.x * stabilizationForce,
      0, // Allow Y rotation
      -currentRotation.z * stabilizationForce
    ])

    // Apply hover force at four corners to prevent tipping
    const cornerOffset = 1 // Half the width/length of the car
    boxPhysical.applyForce([0, hoverForce, 0], [0, boxHeight, 0])

    // // Update attached objects positions
    // attachedObjects.current.forEach((attachedBody) => {
    //   const offset = attachedBody.userData.attachOffset || [0, 0, 0]
    //   const worldPosition = position.clone()
    //   const rotatedOffset = new Vector3(offset[0], offset[1], offset[2])
    //   rotatedOffset.applyAxisAngle(new Vector3(0, 1, 0), rotation.current)
    //   worldPosition.add(rotatedOffset)

    //   attachedBody.position.copy(worldPosition)
    //   attachedBody.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), rotation.current)
    // })

    // Update camera position with vehicle-like follow
    if (ref.current) {
      position.setFromMatrixPosition(ref.current.matrixWorld)

      // Adjust camera position based on vehicle rotation
      cameraOffset.set(
        Math.sin(rotation.current) * 10,
        5,
        Math.cos(rotation.current) * 10
      )

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
