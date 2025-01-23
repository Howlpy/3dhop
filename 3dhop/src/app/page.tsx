// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <div className="absolute inset-0">
          <Image
            src="/hero-3dprint.jpg"
            alt="Impresión 3D profesional"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/40" />
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Impresión 3D a 
              <span className="bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent"> tu alcance</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Transformamos tus ideas en objetos tangibles con precisión y rapidez
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl transition-shadow duration-300"
            >
              Comenzar proyecto
            </Link>
          </div>
        </div>
      </div>

      {/* Nuestro Proceso */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Cómo funciona nuestro servicio
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '📤', title: 'Sube tu modelo', desc: 'Formatos STL, OBJ o 3MF' },
              { icon: '🧮', title: 'Calcula costo', desc: 'En base a volumen y material' },
              { icon: '🖨️', title: 'Imprimimos', desc: 'Usando tecnología profesional' },
              { icon: '🚚', title: 'Entrega', desc: 'En tu domicilio en 3-5 días' }
            ].map((step, i) => (
              <div key={i} className="text-center p-6 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para materializar tus ideas?
          </h2>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
}