import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config({ path: '.env.local' });

async function downloadBrokenFile() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: document, error: docErr } = await supabase
        .from('documents')
        .select('*')
        .eq('id', 'a3026939-b809-46d5-a05d-20fef328c10b')
        .single();

    if (docErr) {
        console.error('Error fetching doc:', docErr);
        return;
    }

    console.log(`Downloading file from: ${document.file_path}`);

    const { data: fileData, error: downloadErr } = await supabase.storage
        .from('documents')
        .download(document.file_path);

    if (downloadErr) {
        console.error('Error downloading:', downloadErr);
        return;
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    fs.writeFileSync('broken-download.pdf', buffer);
    console.log(`Saved as broken-download.pdf (size: ${buffer.length} bytes)`);
}

downloadBrokenFile();
