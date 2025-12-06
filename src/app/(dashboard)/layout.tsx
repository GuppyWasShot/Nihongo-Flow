import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logout } from '../(auth)/actions';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeToggle';
import { SidebarNav } from './SidebarNav';
import { MobileBottomNav } from '../../components/MobileBottomNav';

async function getUser() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return user;
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-950 dark:to-slate-900 transition-colors duration-200">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200/80 dark:border-slate-800">
                        <Link href="/learn" className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-sm">
                                <span className="text-2xl">日</span>
                            </div>
                            <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                                Nihongo Flow
                            </span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    {/* Navigation */}
                    <SidebarNav />

                    {/* User Profile */}
                    <div className="border-t border-slate-200/80 dark:border-slate-800 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {user.email}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Student</p>
                            </div>
                        </div>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 transition-colors duration-200">
                <div className="flex items-center justify-between">
                    <Link href="/learn" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-sm">
                            <span className="text-lg">日</span>
                        </div>
                        <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Nihongo Flow
                        </span>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64 pb-24 lg:pb-0">
                <main className="py-8 px-4 sm:px-6 lg:px-10">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </div>
    );
}
