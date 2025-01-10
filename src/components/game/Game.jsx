import React, { Suspense } from 'react'
import { Sky, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Physics } from '@react-three/cannon'

import Terrain from './Terrain'
import Buildings from './Buildings'
import Trees from './Trees'
import Vehicles from './Vehicles'
import Player from './Player'

export default function Game() {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={60} />
      <Suspense fallback={null}>
        <Physics>
          <Terrain />
          <Buildings />
          <Trees />
          <Vehicles />
          <Player />
        </Physics>
      </Suspense>
      {/* <OrbitControls target={[0, 0, 0]} /> */}
    </>
  )
}

