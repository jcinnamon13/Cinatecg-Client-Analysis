import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { File, UploadCloud, ChevronRight, FileText, Settings, Users } from 'lucide-react';
import { formatRelativeDate, getStatusColor, getStatusLabel } from '@/lib/utils';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch clients and their documents
    const { data: clients } = await supabase
        .from('clients')
        .select(`
            *,
            documents (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Aggregate stats
    const totalClients = clients?.length || 0;

    let totalDocs = 0;
    let pendingDocs = 0;

    clients?.forEach(client => {
        totalDocs += client.documents?.length || 0;
        pendingDocs += client.documents?.filter((d: { status: string }) => ['uploading', 'analysing'].includes(d.status)).length || 0;
    });

    return (
        <div className="flex flex-col gap-6 animate-fade-in max-w-6xl mx-auto py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400 text-sm">
                        Overview of your client onboarding documents and AI analyses.
                    </p>
                </div>
                <Link href="/upload" className="btn-primary group">
                    <UploadCloud className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                    Upload New Document
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Users strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 font-medium mb-1">Total Clients</div>
                            <div className="text-3xl font-bold text-white">{totalClients}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <FileText strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 font-medium mb-1">Documents Analysed</div>
                            <div className="text-3xl font-bold text-white">{totalDocs - pendingDocs}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Settings strokeWidth={1.5} className={pendingDocs > 0 ? "animate-spin-slow" : ""} />
                        </div>
                        <div>
                            <div className="text-sm text-amber-400/80 font-medium mb-1">Pending Analysis</div>
                            <div className="text-3xl font-bold text-amber-400">{pendingDocs}</div>
                        </div>
                    </div>
                </div>
            </div>

            {totalClients === 0 ? (
                <div className="glass-card mt-8 flex flex-col items-center justify-center p-16 text-center shadow-lg border-dashed border-2 border-white/5">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                        <File className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No clients yet</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                        Get started by uploading your first client onboarding form for our AI consultant to analyse and generate actionable recommendations.
                    </p>
                    <Link href="/upload" className="btn-primary px-8 py-3 text-sm font-medium">
                        <UploadCloud className="w-4 h-4 inline-block mr-2" />
                        First Upload
                    </Link>
                </div>
            ) : (
                <div className="mt-8 space-y-6">
                    <h2 className="text-lg font-semibold text-white px-1">Recent Clients</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {clients?.map(client => (
                            <div key={client.id} className="glass-card overflow-hidden hover:border-slate-700/50 transition-colors flex flex-col h-full">
                                <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-3 overflow-hidden pr-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shadow-white/20 shrink-0">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white text-base truncate" title={client.name}>{client.name}</h3>
                                            <p className="text-xs text-slate-400">Added {formatRelativeDate(client.created_at)}</p>
                                        </div>
                                    </div>
                                    <Link href={`/clients/${client.id}`} className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3 py-1.5 rounded-full transition-colors flex items-center shrink-0">
                                        View All
                                        <ChevronRight className="w-3 h-3 ml-1" />
                                    </Link>
                                </div>

                                <div className="p-2 flex-grow">
                                    {client.documents && client.documents.length > 0 ? (
                                        <ul className="space-y-1">
                                            {client.documents.slice(0, 3).map((doc: { id: string, file_type: string, file_name: string, status: string }) => (
                                                <li key={doc.id}>
                                                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors group">
                                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                                            <File className={`w-5 h-5 shrink-0 ${doc.file_type === 'pdf' ? 'text-red-400' : doc.file_type === 'docx' ? 'text-blue-400' : 'text-emerald-400'}`} />
                                                            <span className="text-sm text-slate-300 truncate font-medium group-hover:text-white transition-colors" title={doc.file_name}>
                                                                {doc.file_name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 shrink-0 ml-4">
                                                            <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border ${getStatusColor(doc.status)}`}>
                                                                {getStatusLabel(doc.status)}
                                                            </span>
                                                            <Link href={`/documents/${doc.id}`} className="text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1" title="View Document">
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-6 text-center text-sm text-slate-500 h-full flex items-center justify-center">
                                            No documents yet.
                                        </div>
                                    )}
                                </div>

                                {client.documents && client.documents.length > 3 && (
                                    <div className="px-5 py-3 border-t border-[var(--border)] bg-white/[0.01]">
                                        <Link href={`/clients/${client.id}`} className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                                            + {client.documents.length - 3} more {client.documents.length - 3 === 1 ? 'document' : 'documents'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
