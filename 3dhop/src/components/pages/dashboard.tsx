// app/dashboard/page.tsx
"use client";
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import ModelViewer from '@/components/ModelViewer'
import { ModelData } from '@/interfaces/modelInterface';
import { SupportedExtensions } from '@/types/supportedFileTypes';
const DashboardPage = () => {

  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [modelInfo] = useState({
    volume: 15.8,
    price: 4.75,
    printTime: 2.5
  })
  
  const [printingParams, setPrintingParams] = useState({
    infill: 20,
    layerHeight: 0.2,
    color: 'blue',
    quantity: 1
  })
  const [modelData,setModelData] = useState<ModelData>({url: '',type: 'gltf'});
  // Manejador de subida de archivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    const fileType = file.name.split('.').pop()?.toLowerCase() as SupportedExtensions;
    if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')|| file.name.endsWith('.obj')|| file.name.endsWith('.fbx')) {
      const objectUrl = URL.createObjectURL(file)
      setModelData({url: objectUrl,type: fileType})
      setCurrentModel(objectUrl)
    } else {
      alert('Solo se permiten archivos GLB, GLTF, OBJ, FBX')
    }
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb','.gltf'],
      'model/obj': ['.obj'],
      'model/fbx': ['.fbx']
    },
    multiple: false
  })

  // Calcular precio
  const calculatePrice = () => {
    const basePrice = modelInfo.volume * 0.3
    const quantityMultiplier = printingParams.quantity
    return (basePrice * quantityMultiplier).toFixed(2)
  }

  // Limpiar objeto URL al desmontar
  useEffect(() => {
    return () => {
      if (currentModel) {
        URL.revokeObjectURL(currentModel)
      }
    }
  }, [currentModel])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">3DPrintHub</h2>
        </div>
        <nav className="mt-6">
          <Link href="#" className="flex items-center px-6 py-3 text-gray-700 bg-gray-100">
            <span className="mx-3">Mis Modelos</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-100">
            <span className="mx-3">Órdenes</span>
          </Link>
          <Link href="#" className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-100">
            <span className="mx-3">Configuración</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-700">Panel de Control</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Nuevo Proyecto
            </button>
          </header>

          {!currentModel ? (
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center 
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <input {...getInputProps()} />
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">
                    {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu modelo 3D aquí'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Formatos soportados: .glb, .gltf, .obj, .fbx (Tamaño máximo: 50MB)
                  </p>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Seleccionar archivo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Vista Previa</h2>
                    <button 
                      onClick={() => {
                        URL.revokeObjectURL(currentModel)
                        setCurrentModel(null)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar Modelo
                    </button>
                  </div>
                  <div className="relative h-[500px]">
                    {currentModel && <ModelViewer key={currentModel} modelUrl={currentModel} fileType={modelData.type} width="100%" height="100%" />}
                  </div>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={printingParams.quantity}
                        onChange={(e) => setPrintingParams({...printingParams, quantity: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Color del Material</label>
                      <div className="flex gap-2">
                        {['blue', 'red', 'gray', 'black'].map((color) => (
                          <button
                            key={color}
                            onClick={() => setPrintingParams({...printingParams, color})}
                            className={`w-8 h-8 rounded-full border-2 ${
                              printingParams.color === color ? 'border-blue-500' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Densidad de Relleno: {printingParams.infill}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={printingParams.infill}
                        onChange={(e) => setPrintingParams({...printingParams, infill: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-700">Resumen del Pedido</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Volumen:</span>
                    <span>{modelInfo.volume} cm³</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tiempo estimado:</span>
                    <span>{modelInfo.printTime} horas</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Cantidad:</span>
                    <span>{printingParams.quantity}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t text-gray-700">
                    <span>Total:</span>
                    <span className="text-blue-600">€{calculatePrice()}</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
                    Confirmar Pedido
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Archivos Recientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gray-100 rounded-lg mb-3"></div>
                  <h3 className="font-medium text-gray-700">Modelo {item}</h3>
                  <p className="text-sm text-gray-500">Subido hace {item} días</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage