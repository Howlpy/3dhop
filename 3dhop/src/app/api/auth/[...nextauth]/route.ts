// app/api/auth/[...nextauth]/route.ts
import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar campos
        console.log(credentials)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Campos requeridos");
        }
        console.log(credentials)
        // 2. Buscar usuario existente
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });
        console.log(credentials)
        // 3. Verificar existencia y contraseña
        if (!user || !user.password) {
          throw new Error("Usuario no registrado");
        }
        console.log(credentials.password + " " +user.password)
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log(isValid);
        if (!isValid) {
            throw new Error("Contraseña incorrecta");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: '/auth/error',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };