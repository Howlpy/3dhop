import '@/app/globals.css'

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
      <body>{children}</body>
    </html>
  );
}