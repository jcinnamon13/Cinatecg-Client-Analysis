import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { FileText, Sparkles, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { cleanSummary } from '@/lib/utils';

interface AnalysisBlock {
    question: string;
    original_response: string;
    improved_response: string;
    recommendations: string[];
    flags: string[];
}

export default async function SharedReportPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const resolvedParams = await params;
    const token = resolvedParams.token;

    // Use a public-read supabase client (anon key, no auth required)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Find document by share token
    const { data: document, error } = await supabase
        .from('documents')
        .select(`
            *,
            clients (name),
            analyses (summary, structured_result, created_at)
        `)
        .eq('share_token', token)
        .eq('status', 'ready')
        .maybeSingle();

    if (error || !document) {
        notFound();
    }

    const clientName = document.clients?.name || 'Client';
    const analysis = document.analyses?.[0];
    const results: AnalysisBlock[] = (analysis?.structured_result as unknown as AnalysisBlock[]) || [];

    return (
        <div className="min-h-screen bg-[#070B14] text-white">
            {/* Gradient background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
                {/* Header */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">CinaTech Analysis Report</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-white">{clientName}</h1>
                            <p className="text-zinc-400 text-sm mt-0.5">{document.file_name}</p>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                {analysis?.summary && (
                    <div className="p-8 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm rounded-2xl border border-indigo-500/20 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                        <div className="flex items-center space-x-3 mb-4">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-xl font-semibold text-white">Executive Summary</h2>
                        </div>
                        <div className="text-zinc-300 space-y-4">
                            {cleanSummary(analysis.summary).split('\n\n').map((p: string, i: number) => (
                                <p key={i} className="leading-relaxed">{p}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detailed Q&A Blocks */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white px-2">Detailed Analysis</h3>
                    {results.map((block, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-start space-x-3">
                                    <MessageSquare className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-[15px] font-medium text-zinc-200">{block.question}</h4>
                                        <div className="mt-3 p-4 bg-black/20 rounded-lg border border-white/5">
                                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Client&apos;s Answer</span>
                                            <p className="text-zinc-400 text-sm leading-relaxed">{block.original_response}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                        <span className="text-sm font-medium text-indigo-300">Strategic Translation</span>
                                    </div>
                                    <p className="text-white text-[15px] leading-relaxed pl-6 border-l-2 border-indigo-500/50">
                                        {block.improved_response}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    {block.recommendations?.length > 0 && (
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                <span className="text-sm font-medium text-emerald-300">Actionable Recommendations</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {block.recommendations.map((rec, rIdx) => (
                                                    <li key={rIdx} className="flex items-start space-x-2 text-sm text-zinc-400">
                                                        <span className="text-emerald-500/50 mt-1 flex-shrink-0">•</span>
                                                        <span className="leading-relaxed">{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {block.flags?.length > 0 && (
                                        <div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                <span className="text-sm font-medium text-amber-300">Areas for Clarification</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {block.flags.map((flag, fIdx) => (
                                                    <li key={fIdx} className="flex items-start space-x-2 text-sm text-zinc-400">
                                                        <span className="text-amber-500/50 mt-1 flex-shrink-0">•</span>
                                                        <span className="leading-relaxed">{flag}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center py-6 border-t border-white/10">
                    <p className="text-zinc-500 text-sm">
                        Generated by{' '}
                        <span className="text-indigo-400 font-medium">CinaTech Client Analysis Portal</span>
                        {' '}— Powered by Claude AI
                    </p>
                </div>
            </div>
        </div>
    );
}
