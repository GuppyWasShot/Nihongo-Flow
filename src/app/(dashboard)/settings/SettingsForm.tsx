'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfile } from './actions';
import { User, MapPin, FileText, Image } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    );
}

interface SettingsFormProps {
    initialData: {
        email: string;
        displayName: string;
        avatarUrl: string;
        location: string;
        bio: string;
    };
}

const LOCATIONS = [
    'Jakarta, Indonesia',
    'Surabaya, Indonesia',
    'Bandung, Indonesia',
    'Medan, Indonesia',
    'Semarang, Indonesia',
    'Makassar, Indonesia',
    'Bali, Indonesia',
    'Other',
];

const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
];

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState(initialData.avatarUrl || PRESET_AVATARS[0]);

    async function handleSubmit(formData: FormData) {
        formData.set('avatarUrl', selectedAvatar);

        const result = await updateProfile(formData);

        if ('error' in result && result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if ('success' in result && result.success) {
            setMessage({ type: 'success', text: result.success });
            setTimeout(() => setMessage(null), 3000);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Image className="w-4 h-4" />
                        <span>Profile Picture</span>
                    </div>
                </label>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <img
                            src={selectedAvatar}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full border-4 border-indigo-100 dark:border-indigo-900"
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {PRESET_AVATARS.map((avatar) => (
                            <button
                                key={avatar}
                                type="button"
                                onClick={() => setSelectedAvatar(avatar)}
                                className={`w-12 h-12 rounded-full border-2 ${selectedAvatar === avatar
                                    ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-300 dark:ring-indigo-700'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                                    } transition-all`}
                            >
                                <img src={avatar} alt="Avatar option" className="w-full h-full rounded-full" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Display Name */}
            <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Display Name</span>
                    </div>
                </label>
                <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    defaultValue={initialData.displayName}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
            </div>

            {/* Email (Read-only) */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={initialData.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
            </div>

            {/* Location */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Location</span>
                    </div>
                </label>
                <select
                    id="location"
                    name="location"
                    defaultValue={initialData.location}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                >
                    <option value="">Select your location</option>
                    {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Bio</span>
                    </div>
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={initialData.bio}
                    placeholder="Tell us a bit about yourself and your Japanese learning journey..."
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maximum 200 characters</p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-xl ${message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <SubmitButton />
            </div>
        </form>
    );
}
