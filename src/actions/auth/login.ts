'use server';

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {

        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });

        return "Success"

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        return 'UnknownError'
    }
}

export const login = async (email: string, password: string) => {
    try {
        await signIn('credentials', { email, password })

        return {
            ok: true
        }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        return {
            ok: false,
            message: 'Error al iniciar sesión.'
        }
    }
}

export const loginGoogle = async () => {

    await signIn("google");

}