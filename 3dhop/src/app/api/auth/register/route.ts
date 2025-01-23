import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validación más estricta
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Validación mejorada
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    // Verificar usuario existente
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 }
      );
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("password:${password}")
    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword
      }
    });

    return NextResponse.json(
      { 
        success: true,
        userId: newUser.id,
        message: "Usuario creado exitosamente" 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Manejo seguro de errores
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Error desconocido";
    
    console.error("Error en registro:", errorMessage);
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}