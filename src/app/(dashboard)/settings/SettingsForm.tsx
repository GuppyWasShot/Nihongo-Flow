'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { Loader2 } from 'lucide-react';

interface SettingsFormProps {
    initialData: {
        displayName: string;
        email: string;
        location: string;
        bio: string;
        avatar: string;
    };
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.98]"
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

const avatarOptions = [
    { id: 'default', emoji: '👤' },
    { id: 'cat', emoji: '🐱' },
    { id: 'dog', emoji: '🐕' },
    { id: 'panda', emoji: '🐼' },
    { id: 'sakura', emoji: '🌸' },
    { id: 'fuji', emoji: '🗻' },
];

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(initialData.avatar);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        formData.set('avatar', selectedAvatar);

        const result = await updateProfile(formData);

        if ('error' in result && result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }

        setTimeout(() => setMessage(null), 4000);
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Avatar
                </label>
                <div className="flex gap-3 flex-wrap">
                    {avatarOptions.map((avatar) => (
                        <button
                            key={avatar.id}
                            type="button"
                            onClick={() => setSelectedAvatar(avatar.id)}
                            className={`flex items-center justify-center w-14 h-14 text-2xl rounded-2xl transition-all duration-200 ${selectedAvatar === avatar.id
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 ring-2 ring-emerald-500 dark:ring-emerald-400 scale-110'
                                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {avatar.emoji}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display Name */}
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Display Name
                </label>
                <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    defaultValue={initialData.displayName}
                    placeholder="Enter your display name"
                    className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
            </div>

            {/* Email (Read Only) */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={initialData.email}
                    readOnly
                    className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Email cannot be changed</p>
            </div>

            {/* Location */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={initialData.location}
                    placeholder="e.g., Tokyo, Japan"
                    className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
            </div>

            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={initialData.bio}
                    placeholder="Tell us about yourself and your Japanese learning goals..."
                    className="w-full px-5 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
                />
            </div>

            {/* Status Message */}
            {message && (
                <div
                    className={`px-5 py-4 rounded-xl text-sm ${message.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50'
                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-700/50'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    );
}
