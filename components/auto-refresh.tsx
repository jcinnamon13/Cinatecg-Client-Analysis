'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * When a document is in 'uploading' or 'analysing' state,
 * this component auto-refreshes the page every 5 seconds
 * until the status changes to 'ready' or 'error'.
 */
export function AutoRefresh({ status }: { status: string }) {
    const router = useRouter();
    const isPending = status === 'uploading' || status === 'analysing';

    useEffect(() => {
        if (!isPending) return;

        const interval = setInterval(() => {
            router.refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [isPending, router]);

    return null;
}
