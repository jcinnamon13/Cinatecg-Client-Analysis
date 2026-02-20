import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDocs() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: docs } = await supabase
        .from('documents')
        .select('id, file_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

    console.log(docs);
}

checkDocs();
