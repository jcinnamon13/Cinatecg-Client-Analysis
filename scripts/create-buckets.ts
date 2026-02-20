import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createBuckets() {
    console.log('Creating documents bucket...');
    const { data: d1, error: e1 } = await supabase.storage.createBucket('documents', { public: false });
    if (e1) {
        console.error('Error creating documents bucket:', e1.message);
    } else {
        console.log('Documents bucket created:', d1);
    }

    console.log('Creating exports bucket...');
    const { data: d2, error: e2 } = await supabase.storage.createBucket('exports', { public: false });
    if (e2) {
        console.error('Error creating exports bucket:', e2.message);
    } else {
        console.log('Exports bucket created:', d2);
    }
}

createBuckets();
