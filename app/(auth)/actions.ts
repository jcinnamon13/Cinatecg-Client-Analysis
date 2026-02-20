'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function register(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const agencyName = formData.get('agencyName') as string;

    const supabase = await createClient();

    // Supabase Auth requires an origin for email redirects if enabled, 
    // but for simple password auth it will just create the user.
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                agency_name: agencyName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Assuming email confirmation is off for this prototype, we can redirect to login or dashboard.
    // Sometimes signUp automatically logs the user in if email confirmation is disabled.
    revalidatePath('/', 'layout');
    redirect('/dashboard');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
