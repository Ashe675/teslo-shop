import NextAuth, { Session, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';
import Google from 'next-auth/providers/google';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {
        // authorized({ auth, request: { nextUrl } }) {
        //     const isLoggedIn = !!auth?.user;
        //     const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        //     if (isOnDashboard) {
        //         if (isLoggedIn) return true;
        //         return false; // Redirect unauthenticated users to login page
        //     } else if (isLoggedIn) {
        //         return Response.redirect(new URL('/dashboard', nextUrl));
        //     }
        //     return true;
        // },
        jwt({ token, user }) {
            if (user) {
                token.data = user;
            }
            return token
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session({ session, token }: { session: Session, token: any }) {

            session.user = token.data;

            return session
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase()
                    }
                })

                if (!user) return null

                if (!bcryptjs.compareSync(password, user.password)) return null

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...userWithoutPassword } = user;

                return userWithoutPassword;
            },
        }),
        Google
    ]
} satisfies NextAuthConfig;


export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);