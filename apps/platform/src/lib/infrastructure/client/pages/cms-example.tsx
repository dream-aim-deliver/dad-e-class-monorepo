'use client';

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { trpc } from "../trpc/cms-client";

// This is a simple example component that uses the CMS client
// It can be used to demonstrate how to fetch data from the CMS
// and display it in a Next.js page.
export default function CMSExample() {
    const locale = useLocale() as TLocale;
    const { data: session, status } = useSession();

    const [cmsVersion] = trpc.version.useSuspenseQuery();
    const skillsQuery = trpc.getSkills.useQuery({
        userId: "1",
    }, {
        enabled: !!session, // Only run when authenticated
        retry: false, // Don't retry on auth errors
    });

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-900 px-6 py-8 border-b border-gray-700">
                        <h1 className="text-3xl font-bold text-white mb-2">CMS Example</h1>
                        <div className="flex items-center text-gray-300">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Current locale: <span className="font-semibold ml-1 text-gray-100">{locale}</span>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-8">
                        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-2 1-1 1H6a2 2 0 01-2-2v-1l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-100">Authentication Status</h2>
                            </div>
                            <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                                {status === "loading" ? (
                                    <div className="flex items-center text-gray-400">
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                                        <span className="text-sm">Loading authentication status...</span>
                                    </div>
                                ) : session ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                                            <span className="text-sm font-medium text-green-400">Authenticated</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Name</p>
                                                <p className="text-sm text-gray-100 font-medium">{session.user?.name || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                                                <p className="text-sm text-gray-100 font-medium">{session.user?.email || 'N/A'}</p>
                                            </div>
                                            {session.user?.roles && session.user.roles.length > 0 && (
                                                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Roles</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {session.user.roles.map((role, index) => (
                                                            <span key={index} className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs">
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {session.expires && (
                                                <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Session Expires</p>
                                                    <p className="text-sm text-gray-100 font-medium">{new Date(session.expires).toLocaleString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-400 rounded-full mr-3"></div>
                                        <span className="text-sm font-medium text-red-400">Not authenticated</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-100">CMS Version</h2>
                            </div>
                            <div className="bg-gray-800 rounded-lg border border-gray-600 p-4 overflow-x-auto">
                                <pre className="text-sm text-gray-300 font-mono">{JSON.stringify(cmsVersion, null, 2)}</pre>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-100">Skills</h2>
                            </div>
                            <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                                {!session ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-4 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-gray-200 mb-1">Authentication Required</p>
                                            <p className="text-xs text-gray-400">Please sign in to view skills</p>
                                        </div>
                                    </div>
                                ) : skillsQuery.isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="flex items-center text-gray-400">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                                            <span className="text-sm">Loading skills...</span>
                                        </div>
                                    </div>
                                ) : skillsQuery.error ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-center">
                                            <div className="w-12 h-12 mx-auto mb-4 bg-red-500/10 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium text-red-400 mb-1">Error Loading Skills</p>
                                            <p className="text-xs text-gray-400">{skillsQuery.error.message}</p>
                                        </div>
                                    </div>
                                ) : skillsQuery.data?.skills && skillsQuery.data.skills.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {skillsQuery.data.skills.map((skill: string, index: number) => (
                                            <div key={index} className="flex items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-100 truncate">
                                                        {skill}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">No skills found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}