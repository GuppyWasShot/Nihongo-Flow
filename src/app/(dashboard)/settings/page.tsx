import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../../../lib/db';
import { userProfiles } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import SettingsForm from './SettingsForm';
import { User, Calendar } from 'lucide-react';

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

    // Get user profile from database
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id));

    return { user, profile };
}

export default async function SettingsPage() {
    const { user, profile } = await getUserProfile();

    // Format member since date
    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        })
        : 'Recently';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                </div>
                <p className="text-gray-600">Manage your profile and preferences</p>
            </div>

            {/* Member Since Badge */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">
                        Member since {memberSince}
                    </span>
                </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                <SettingsForm
                    initialData={{
                        email: user.email!,
                        displayName: profile?.displayName || '',
                        avatarUrl: profile?.avatarUrl || '',
                        location: profile?.location || '',
                        bio: profile?.bio || '',
                    }}
                />
            </div>

            {/* Additional Settings Sections */}
            <div className="mt-6 bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive study reminders and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-900">Study Reminders</p>
                            <p className="text-sm text-gray-600">Daily reminders to practice Japanese</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
