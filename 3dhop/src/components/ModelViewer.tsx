// components/ModelViewer.tsx
'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const ModelViewer = ({ modelUrl }: { modelUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, 720 / 500, 0.1, 1000));
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number>(null);

  // Limpieza completa
  const cleanUp = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    if (controls.current) {
      controls.current.dispose();
    }
    
    if (renderer.current) {
      renderer.current.dispose();
      renderer.current.domElement.remove();
      renderer.current = null;
    }
    
    scene.current.clear();
  };

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    cleanUp(); // Limpiar cualquier instancia anterior

    // 1. Configuración del Renderer
    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.current.setSize(720, 500);
    renderer.current.outputColorSpace = THREE.SRGBColorSpace;
    renderer.current.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.current.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.current.domElement);

    // 2. Configuración de Cámara
    camera.current.position.set(3, 3, 3);
    camera.current.lookAt(0, 0, 0);

    // 3. Configuración de Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 10, 7.5);
    scene.current.add(directionalLight);

    // 4. Environment Map
    new RGBELoader()
      .load('\\environments\\industrial_sunset_02_4k.hdr', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const pmremGenerator = new THREE.PMREMGenerator(renderer.current!);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
        scene.current.environment = envMap;
        scene.current.background = envMap;
        
        texture.dispose();
        pmremGenerator.dispose();
      });

    // 5. Controles
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;

    // 6. Cargar Modelo
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      // Limpiar modelo anterior
      scene.current.clear();
      scene.current.add(ambientLight);
      scene.current.add(directionalLight);

      // Configurar nuevo modelo
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.envMapIntensity = 2.5; // Aumentado para mejor reflejo
          child.material.needsUpdate = true;
        }
      });
      
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center); // Centrar modelo
      
      const scale = 2 / box.getSize(new THREE.Vector3()).length();
      gltf.scene.scale.set(scale, scale, scale);
      
      scene.current.add(gltf.scene);
    });

    // 7. Animación
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.current!.update();
      renderer.current!.render(scene.current, camera.current);
    };
    animate();

    return () => {
      cleanUp();
      URL.revokeObjectURL(modelUrl);
    };
  }, [modelUrl]);

  return <div ref={containerRef} />;
};

export default ModelViewer;