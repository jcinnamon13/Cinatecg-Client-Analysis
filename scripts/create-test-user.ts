import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createTestUser() {
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'admin2@cinatech.app',
        password: 'password123',
        email_confirm: true,
        user_metadata: {
            full_name: 'CinaTech Admin',
            agency_name: 'CinaTech Agency'
        }
    });

    if (error) {
        console.error('Failed to create user:', error.message);
        process.exit(1);
    }
    console.log('Test user created successfully:', data.user.id);
}

createTestUser();
