import '@/app/globals.css'
import { NextAuthProvider } from '@/providers/NextAuthProvider';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="es">
      <head>
        <title>3dhop</title>
      </head>
      <NextAuthProvider>
        
      <body>{children}</body>
      
      </NextAuthProvider>
    </html>
    
  );
}