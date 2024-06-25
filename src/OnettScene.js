import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import * as THREE from 'three'

const colors = {
  brilliantLavender: '#FAC3FB',
  lightGoldenrodYellow: '#F6F4D2',
  unbleachedSilk: '#FEDECF',
  pink: '#FEC5C6'
}

function RoundBase() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[25, 64]} />
      <meshPhongMaterial color={colors.lightGoldenrodYellow} />
    </mesh>
  )
}

function CuteBuilding({ width, height, depth, position, color }) {
  return (
    <group position={[position[0], position[1] + height / 2, position[2]]}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshPhongMaterial color={color} />
      </mesh>
      <mesh position={[0, height / 2 + height / 4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(width, depth) / 1.5, height / 2, 4]} />
        <meshPhongMaterial color={colors.pink} />
      </mesh>
      <mesh position={[width / 4, 0, depth / 2 + 0.01]}>
        <circleGeometry args={[width / 6, 32]} />
        <meshPhongMaterial color={colors.lightGoldenrodYellow} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-width / 4, 0, depth / 2 + 0.01]}>
        <circleGeometry args={[width / 6, 32]} />
        <meshPhongMaterial color={colors.lightGoldenrodYellow} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function CuteRailway() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 0, -10),
      new THREE.Vector3(-10, 0.2, -5),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(10, 0.2, 5),
      new THREE.Vector3(20, 0, 10)
    ])
  }, [])

  return (
    <mesh>
      <tubeGeometry args={[curve, 100, 0.05, 8, false]} />
      <meshPhongMaterial color={colors.brilliantLavender} />
    </mesh>
  )
}

function CuteStreetlight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 32]} />
        <meshPhongMaterial color={colors.unbleachedSilk} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color={colors.lightGoldenrodYellow} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.5} distance={2} color={colors.lightGoldenrodYellow} />
    </group>
  )
}

function CuteTree({ position }) {
  const leaves = useRef()

  useFrame(({ clock }) => {
    leaves.current.rotation.x = Math.sin(clock.getElapsedTime() * 2) * 0.05
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshPhongMaterial color={colors.unbleachedSilk} />
      </mesh>
      <mesh ref={leaves} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhongMaterial color={colors.brilliantLavender} />
      </mesh>
    </group>
  )
}

function CutePerson({ initialPosition }) {
  const person = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    person.current.position.x = initialPosition[0] + Math.sin(t) * 2
    person.current.position.z = initialPosition[2] + Math.cos(t) * 2
  })

  return (
    <group ref={person} position={initialPosition}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        <meshPhongMaterial color={colors.pink} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshPhongMaterial color={colors.unbleachedSilk} />
      </mesh>
    </group>
  )
}

function CuteCloud({ position }) {
  const cloud = useRef()

  useFrame(({ clock }) => {
    cloud.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.5) * 2
  })

  return (
    <group ref={cloud} position={position}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.random() * 1 - 0.5, Math.random() * 0.3, Math.random() * 1 - 0.5]} scale={[0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhongMaterial color="white" />
        </mesh>
      ))}
    </group>
  )
}

function CuteTrain({ railwayCurve }) {
  const train = useRef()

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() * 0.05) % 1
    const position = railwayCurve.getPointAt(t)
    train.current.position.copy(position)
    const tangent = railwayCurve.getTangentAt(t)
    train.current.lookAt(position.add(tangent))
  })

  return (
    <mesh ref={train}>
      <boxGeometry args={[0.5, 0.25, 0.15]} />
      <meshPhongMaterial color={colors.pink} />
    </mesh>
  )
}

export default function OnettScene() {
  const railwayCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 0, -10),
      new THREE.Vector3(-10, 0.2, -5),
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(10, 0.2, 5),
      new THREE.Vector3(20, 0, 10)
    ])
  }, [])

  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
      <Sky sunPosition={[100, 10, 100]} />
      <ambientLight intensity={0.6} />
      <directionalLight intensity={0.8} position={[1, 1, 1]} />
      <OrbitControls />

      <RoundBase />
      <CuteBuilding width={1} height={1.5} depth={1} position={[-2.5, 0, -2.5]} color={colors.pink} />
      <CuteBuilding width={0.75} height={1} depth={0.75} position={[0, 0.25, 0]} color={colors.brilliantLavender} />
      <CuteBuilding width={1.25} height={1.75} depth={1.25} position={[2.5, 0.1, 2.5]} color={colors.unbleachedSilk} />
      <CuteBuilding width={0.6} height={0.8} depth={0.6} position={[-1.5, 0.35, 1.5]} color={colors.pink} />
      <CuteBuilding width={1} height={1.2} depth={1} position={[3.5, 0, -1]} color={colors.brilliantLavender} />
      <CuteBuilding width={0.8} height={1} depth={0.8} position={[-3.5, 0.1, 3.5]} color={colors.unbleachedSilk} />

      <CuteRailway />
      <CuteStreetlight position={[-1, 0, -1]} />
      <CuteStreetlight position={[1, 0, 1]} />
      <CuteStreetlight position={[-1, 0, 1]} />
      <CuteStreetlight position={[1, 0, -1]} />

      <CuteTree position={[-3, 0, 0]} />
      <CuteTree position={[3, 0, -3]} />

      <CutePerson initialPosition={[1, 0, -1]} />
      <CutePerson initialPosition={[-1.5, 0, 2]} />

      <CuteCloud position={[5, 10, 5]} />
      <CuteCloud position={[-6, 8, -4]} />

      <CuteTrain railwayCurve={railwayCurve} />
    </Canvas>
  )
}