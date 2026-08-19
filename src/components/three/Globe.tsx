"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { corridors, hub } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RADIUS = 1;
const BRASS = "#c98b3f";
const BRASS_HI = "#e9be7c";
const LINE = "#2a2f37";

/** Geographic coordinates → a point on the sphere. */
function toVector(lat: number, lng: number, radius = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/**
 * A great-circle-ish arc between two surface points.
 *
 * The control point is pushed out along the midpoint normal, scaled by the
 * angular distance — so short hops stay low and tight to the surface while
 * long-haul lanes bow out dramatically. A fixed altitude makes every arc look
 * the same and kills the sense of distance.
 */
function arcPoints(from: THREE.Vector3, to: THREE.Vector3) {
  const angle = from.angleTo(to);
  const altitude = 1 + angle * 0.33;
  const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(altitude);
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  return { points: curve.getPoints(72), curve };
}

/**
 * Latitude parallels and longitude meridians, flattened into one segment list.
 *
 * A `sphereGeometry` with `wireframe` is the quick way to get lines on a globe,
 * but it draws the mesh triangulation — it reads as a low-poly 3D model, not as
 * a chart. Real parallels and meridians read as navigation. Everything is
 * merged into a single buffer so the whole graticule costs one draw call.
 */
function useGraticule(step = 20) {
  return useMemo(() => {
    const R = RADIUS * 1.0015;
    const SEGMENTS = 128;
    const points: number[] = [];

    const pushRing = (at: (t: number) => [number, number, number]) => {
      let previous = at(0);
      for (let i = 1; i <= SEGMENTS; i++) {
        const current = at((i / SEGMENTS) * Math.PI * 2);
        points.push(...previous, ...current);
        previous = current;
      }
    };

    // Parallels — poles excluded, they degenerate to a point.
    for (let lat = -90 + step; lat <= 90 - step; lat += step) {
      const phi = (lat * Math.PI) / 180;
      const ringRadius = R * Math.cos(phi);
      const y = R * Math.sin(phi);
      pushRing((t) => [Math.cos(t) * ringRadius, y, Math.sin(t) * ringRadius]);
    }

    // Meridians — each great circle covers two longitudes, so only half a turn.
    for (let lng = 0; lng < 180; lng += step) {
      const theta = (lng * Math.PI) / 180;
      pushRing((t) => [
        Math.cos(t) * R * Math.cos(theta),
        Math.sin(t) * R,
        Math.cos(t) * R * Math.sin(theta),
      ]);
    }

    return new Float32Array(points);
  }, [step]);
}

/** Evenly distributed surface dots — a data-globe texture with no image cost. */
function useDotField(count = 1400) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * ring * RADIUS * 1.002;
      positions[i * 3 + 1] = y * RADIUS * 1.002;
      positions[i * 3 + 2] = Math.sin(theta) * ring * RADIUS * 1.002;
    }
    return positions;
  }, [count]);
}

function GlobeBody({ activeIndex }: { activeIndex: number | null }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const dots = useDotField();
  const graticule = useGraticule();

  const hubPoint = useMemo(() => toVector(hub.lat, hub.lng), []);

  const lanes = useMemo(
    () =>
      corridors.map((corridor) => {
        const end = toVector(corridor.lat, corridor.lng);
        return { ...arcPoints(hubPoint, end), end, name: corridor.name };
      }),
    [hubPoint],
  );

  // Longitude the camera should be facing for the selected corridor.
  const targetY = useMemo(() => {
    if (activeIndex === null) return null;
    const corridor = corridors[activeIndex];
    const midLng = (hub.lng + corridor.lng) / 2;
    return -((midLng + 180) * Math.PI) / 180 - Math.PI / 2;
  }, [activeIndex]);

  useFrame((_, delta) => {
    if (!group.current) return;

    if (targetY !== null) {
      // Ease toward the selected lane along the shortest path.
      let diff = targetY - group.current.rotation.y;
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      group.current.rotation.y += diff * Math.min(1, delta * 2.4);
    } else if (!reduced) {
      group.current.rotation.y += delta * 0.085;
    }
  });

  return (
    <group ref={group} rotation={[0.32, 2.1, 0.12]}>
      {/* Solid core, slightly inset so arcs read against it */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 64, 64]} />
        <meshBasicMaterial color="#0b0d10" />
      </mesh>

      {/* Graticule */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graticule, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={LINE} transparent opacity={0.55} depthWrite={false} />
      </lineSegments>

      {/* Surface dot field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.007}
          color={BRASS}
          transparent
          opacity={0.36}
          sizeAttenuation
        />
      </points>

      {/* Atmosphere rim */}
      <mesh scale={1.075}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <meshBasicMaterial
          color={BRASS}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Lanes */}
      {lanes.map((lane, i) => {
        const isActive = activeIndex === i;
        const dimmed = activeIndex !== null && !isActive;
        return (
          <group key={lane.name}>
            <Line
              points={lane.points}
              color={isActive ? BRASS_HI : BRASS}
              lineWidth={isActive ? 2 : 1}
              transparent
              opacity={dimmed ? 0.14 : isActive ? 1 : 0.5}
            />
            <Pulse curve={lane.curve} offset={i / corridors.length} active={isActive} />
            <Marker position={lane.end} active={isActive} dimmed={dimmed} />
          </group>
        );
      })}

      {/* The hub itself */}
      <Marker position={hubPoint} active hub />
    </group>
  );
}

/** A bead of light travelling the lane, so the network reads as in-motion. */
function Pulse({
  curve,
  offset,
  active,
}: {
  curve: THREE.QuadraticBezierCurve3;
  offset: number;
  active: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  const time = useRef(offset);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    time.current = (time.current + delta * 0.14) % 1;
    const point = curve.getPointAt(time.current);
    ref.current.position.copy(point);
  });

  if (reduced) return null;

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[active ? 0.016 : 0.011, 12, 12]} />
      <meshBasicMaterial color={BRASS_HI} transparent opacity={active ? 1 : 0.75} />
    </mesh>
  );
}

function Marker({
  position,
  active,
  dimmed = false,
  hub: isHub = false,
}: {
  position: THREE.Vector3;
  active: boolean;
  dimmed?: boolean;
  hub?: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  // Billboard the ring so it always faces outward from the globe centre.
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    if (!ringRef.current || !isHub) return;
    const t = (clock.getElapsedTime() % 2.4) / 2.4;
    const scale = 1 + t * 2.4;
    ringRef.current.scale.setScalar(scale);
    (ringRef.current.material as THREE.Material).opacity = (1 - t) * 0.5;
  });

  const opacity = dimmed ? 0.25 : 1;

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[isHub ? 0.02 : 0.013, 14, 14]} />
        <meshBasicMaterial
          color={isHub || active ? BRASS_HI : BRASS}
          transparent
          opacity={opacity}
        />
      </mesh>
      {isHub && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.026, 0.032, 40]} />
          <meshBasicMaterial
            color={BRASS_HI}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/** Gentle pointer-follow tilt, so the globe feels held rather than played. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useFrame(({ pointer }, delta) => {
    if (!group.current || reduced) return;
    const targetX = pointer.y * 0.16;
    const targetY = pointer.x * 0.2;
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 2);
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 2);
  });

  return <group ref={group}>{children}</group>;
}

export default function Globe({ activeIndex = null }: { activeIndex?: number | null }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.05], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Rig>
        <GlobeBody activeIndex={activeIndex} />
      </Rig>
    </Canvas>
  );
}

// Keeps `ThreeElements` referenced so the R3F JSX namespace is loaded for TS.
export type GlobeElements = ThreeElements;
