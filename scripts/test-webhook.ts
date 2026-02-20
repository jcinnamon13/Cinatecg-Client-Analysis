import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkPendingDocuments() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: docs, error } = await supabase
        .from('documents')
        .select('*')
        .in('status', ['uploading', 'analysing']);

    if (error) {
        console.error('Error fetching docs:', error);
        return;
    }

    console.log(`Found ${docs.length} pending documents.`);

    // Find the first pdf document to analyze
    const doc = docs.find(d => d.file_type === 'pdf');

    if (!doc) {
        console.log("No pending docx files found to analyze.");
        return;
    }

    console.log(`Triggering analysis for document ${doc.id} (${doc.file_name})...`);

    try {
        const response = await fetch(`http://localhost:3000/api/documents/${doc.id}/analyse`, {
            method: 'POST'
        });

        const result = await response.json();
        console.log('Analysis webhook response:', response.status, result);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

checkPendingDocuments();
