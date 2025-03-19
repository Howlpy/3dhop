// app/api/auth/[...nextauth]/route.ts
import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/utils/prisma"



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
        // Validar campos
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Campos requeridos");
        }
        // Buscar usuario existente
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });
        //Verificar existencia y contraseña
        if (!user || !user.password) {
          throw new Error("Usuario no registrado");
        }
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