import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { userProfiles } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import SettingsForm from './SettingsForm';
import { User, Calendar, Settings } from 'lucide-react';
import { ThemeToggleWithLabel } from '../../../components/ThemeToggle';

async function getUserProfile() {
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

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id));

    return { user, profile };
}

export default async function SettingsPage() {
    const { user, profile } = await getUserProfile();

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-sm">
                        <Settings className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
                        <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
                    </div>
                </div>

                {/* Member Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {memberSince}</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100">Profile</h2>
                    </div>
                    <SettingsForm
                        initialData={{
                            displayName: profile?.displayName || '',
                            email: user.email || '',
                            location: profile?.location || '',
                            bio: profile?.bio || '',
                            avatar: profile?.avatarUrl || 'default',
                        }}
                    />
                </div>

                {/* Appearance Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                        <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100">Appearance</h2>
                    </div>
                    <ThemeToggleWithLabel />
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 transition-colors duration-200">
                    <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-6">Notifications</h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">Email notifications</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Receive study reminders and updates</p>
                            </div>
                            <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-500 transition-colors">
                                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-6 transition-transform" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">Study reminders</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Daily reminders to maintain your streak</p>
                            </div>
                            <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-emerald-500 transition-colors">
                                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-6 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
