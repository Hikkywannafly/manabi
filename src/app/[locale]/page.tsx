'use client';

import { useTranslations } from "next-intl";

export default function HomePage() {
    const t = useTranslations('common');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {t('welcome')}
                </h1>
                <p className="text-gray-600 mb-6">
                    {t('description')}
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                        <strong>Current locale:</strong> vi
                    </p>
                    <p className="text-sm text-gray-500">
                        <strong>Status:</strong> Basic next-intl setup working!
                    </p>
                </div>
            </div>
        </div>
    );
}