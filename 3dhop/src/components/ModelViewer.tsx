// components/ModelViewer.tsx
'use client'
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { SupportedExtensions } from '@/types/supportedFileTypes';
import { modelPosition } from 'three/tsl';

interface ModelLoaderprops {
  modelUrl: string;
  fileType: SupportedExtensions;
  width?: string | number;  // Permitir valores como '100%' o números específicos
  height?: string | number;
}

const ModelViewer = ({ modelUrl, fileType, width = '100%', height = '400px' }: ModelLoaderprops) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, 720 / 500, 0.1, 1000));
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number>(null);
  const resizeObserver = useRef<ResizeObserver | null>(null);

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

  const getLoader = (type: SupportedExtensions) => {
    switch (type) {
      case 'gltf':
        return new GLTFLoader();
      case 'glb':
        return new GLTFLoader();
      case 'obj':
        return new OBJLoader();
      case 'fbx':
        return new FBXLoader();
      default:
        throw new Error(`Tipo de archivo no soportado: ${type}`);
    }
  }
  const loadModel = async () => {
    if (!fileType || !modelUrl) return;
    const loader = getLoader(fileType);
    try {

      const processModel = (result:THREE.Object3D) => {
        scene.current.clear();
        
        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        directionalLight.position.set(5, 10, 7.5);
        scene.current.add(ambientLight, directionalLight);
    
        let modelScene: THREE.Object3D;
    
        if ('scene' in result){
          modelScene = result.scene;
          modelScene.traverse((child) => {
            if (child instanceof THREE.Mesh){
              child.material.envMapIntensity = 2;
              child.material.needsUpdate = true;
            }
          });
        }else{
          modelScene = result;
          modelScene.traverse((child) => {
            if (child instanceof THREE.Mesh){
              child.material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                envMapIntensity: 2,
                metalness: 0.5,
                roughness: 0.5,
              });
            }
          });
        }

        // Calcular dimensiones del modelo
        const box = new THREE.Box3().setFromObject(modelScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Calcular escala basada en el tamaño del modelo
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 10; // Tamaño deseado en unidades de Three.js
        const scale = targetSize / maxDimension;
        modelScene.scale.multiplyScalar(scale);

        // Centrar el modelo
        modelScene.position.sub(center.multiplyScalar(scale));
        
        scene.current.add(modelScene);

        // Calcular posición de cámara óptima
        const distance = targetSize * 2; // Distancia basada en el tamaño objetivo
        const height = targetSize / 2; // Altura de la cámara

        // Posicionar cámara
        camera.current.position.set(distance, height, distance);
        camera.current.lookAt(0, 0, 0);

        // Ajustar controles
        if (controls.current) {
          controls.current.target.set(0, 0, 0);
          controls.current.minDistance = distance * 0.5;
          controls.current.maxDistance = distance * 3;
          controls.current.update();
        }

        // Forzar un render inicial
        if (renderer.current) {
          renderer.current.render(scene.current, camera.current);
        }
      }
      if (fileType === 'gltf' || fileType === 'glb'){
        loader.load(modelUrl, 
          (gltf) => processModel(gltf),
          (progress) => console.log('Cargando:', (progress.loaded / progress.total * 100) + '%'),
          (error) => console.error('Error cargando modelo:', error)
        );
      }else{
        loader.load(modelUrl,
          (result) => processModel(result),
          (progress) => console.log('Cargando:', (progress.loaded / progress.total * 100) + '%'),
          (error) => console.error('Error cargando modelo:', error)
        );
      } 
     
     
  }catch(error){
    console.error('Error al cargar el modelo:', error);
    }
  }

  // Función para manejar el resize
  const handleResize = () => {
    if (!containerRef.current || !renderer.current || !camera.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Actualizar tamaño del renderer
    renderer.current.setSize(rect.width, rect.height);

    // Actualizar aspect ratio de la cámara
    camera.current.aspect = rect.width / rect.height;
    camera.current.updateProjectionMatrix();
  };

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;
    console.log(modelUrl);
    cleanUp();

    renderer.current = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });

    // Configurar el ResizeObserver
    resizeObserver.current = new ResizeObserver(handleResize);
    resizeObserver.current.observe(containerRef.current);

    // Configuración inicial del renderer
    handleResize();  // Llamar inicialmente para establecer el tamaño correcto
    renderer.current.outputColorSpace = THREE.SRGBColorSpace;
    renderer.current.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.current.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.current.domElement);

    // Configuración inicial de la cámara
    camera.current.position.set(5, 3, 5);
    camera.current.lookAt(0, 0, 0);

    // Configurar controles antes de cargar el modelo
    controls.current = new OrbitControls(camera.current, renderer.current.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;
    controls.current.target.set(0, 0, 0);

    loadModel();

    // Environment Map
    new RGBELoader()
      .load('/environments/industrial_sunset_02_4k.hdr', (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const pmremGenerator = new THREE.PMREMGenerator(renderer.current!);
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        
        scene.current.environment = envMap;
        scene.current.background = envMap;
        
        texture.dispose();
        pmremGenerator.dispose();
      });

    // Animación
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controls.current) controls.current.update();
      if (renderer.current) renderer.current.render(scene.current, camera.current);
    };
    animate();

    return () => {
      cleanUp();
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      URL.revokeObjectURL(modelUrl);
    };
  }, [modelUrl, fileType]);

  // Estilizar el contenedor
  return (
    <div 
      ref={containerRef}
      style={{
        width: width,
        height: height,
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};

export default ModelViewer;