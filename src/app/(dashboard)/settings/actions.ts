'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { db } from '../../../lib/db';
import { userProfiles } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function updateProfile(formData: FormData) {
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
        return { error: 'Not authenticated' };
    }

    const displayName = formData.get('displayName') as string;
    const avatarUrl = formData.get('avatarUrl') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;

    try {
        // Update or insert user profile
        const existing = await db.select().from(userProfiles).where(eq(userProfiles.id, user.id));

        if (existing.length > 0) {
            await db.update(userProfiles)
                .set({
                    displayName: displayName || null,
                    avatarUrl: avatarUrl || null,
                    location: location || null,
                    bio: bio || null,
                    updatedAt: new Date(),
                })
                .where(eq(userProfiles.id, user.id));
        } else {
            await db.insert(userProfiles).values({
                id: user.id,
                email: user.email!,
                displayName: displayName || null,
                avatarUrl: avatarUrl || null,
                location: location || null,
                bio: bio || null,
            });
        }

        revalidatePath('/settings');
        return { success: 'Profile updated successfully!' };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }
}
