"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { sendAssessmentEmail } from "@/app/actions/send-email";

interface User {
    _id: string;
    name: string;
    email: string;
    picture?: string;
    socialLinks?: {
        github?: string;
        gitlab?: string;
        medium?: string;
        devto?: string;
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
    audioUrl?: string;
    audioRecorded: boolean;
    audioRecordedAt?: string;
    profileCompleted: boolean;
    hireableStatus?: 'hireable' | 'near_hireable' | 'unhireable' | 'not_assessed';
    strengths?: string[];
    weaknesses?: string[];
    createdAt: string;
    emailSent?: boolean;
    emailSentAt?: string;
    isBeginnerLevel?: boolean;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<'strengths' | 'weaknesses' | null>(null);
    const [editValue, setEditValue] = useState("");
    const [emailConfirmUser, setEmailConfirmUser] = useState<User | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, search]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/api/admin/users", {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    search,
                },
            });

            if (response.data.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                router.push("/admin/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/admin/logout");
            router.push("/admin/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination({ ...pagination, page: 1 });
        fetchUsers();
    };

    const updateUserStatus = async (userId: string, status: string) => {
        console.log('🔄 Updating status for user:', userId, 'to:', status);
        try {
            const response = await api.patch(`/api/admin/users/${userId}`, {
                hireableStatus: status,
            });
            console.log('✅ Status update response:', response.data);
            fetchUsers();
        } catch (err: any) {
            console.error("❌ Error updating status:", err.response?.data || err);
        }
    };

    const handleAddItem = async (userId: string, type: 'strengths' | 'weaknesses') => {
        setEditingUser(userId);
        setEditMode(type);
        setEditValue("");
    };

    const saveItem = async () => {
        if (!editingUser || !editMode || !editValue.trim()) return;

        const user = users.find(u => u._id === editingUser);
        if (!user) return;

        const currentItems = user[editMode] || [];
        const newItems = [...currentItems, editValue.trim()];

        console.log('💾 Saving item:', editMode, 'for user:', editingUser);
        try {
            const response = await api.patch(`/api/admin/users/${editingUser}`, {
                [editMode]: newItems,
            });
            console.log('✅ Item saved:', response.data);
            setEditingUser(null);
            setEditMode(null);
            setEditValue("");
            fetchUsers();
        } catch (err: any) {
            console.error("❌ Error saving item:", err.response?.data || err);
        }
    };

    const removeItem = async (userId: string, type: 'strengths' | 'weaknesses', index: number) => {
        const user = users.find(u => u._id === userId);
        if (!user) return;

        const currentItems = user[type] || [];
        const newItems = currentItems.filter((_, i) => i !== index);

        console.log('🗑️ Removing item:', type, 'index:', index, 'for user:', userId);
        try {
            const response = await api.patch(`/api/admin/users/${userId}`, {
                [type]: newItems,
            });
            console.log('✅ Item removed:', response.data);
            fetchUsers();
        } catch (err: any) {
            console.error("❌ Error removing item:", err.response?.data || err);
        }
    };

    const handleSendEmail = async () => {
        if (!emailConfirmUser) return;

        setIsSendingEmail(true);
        try {
            const result = await sendAssessmentEmail({
                userId: emailConfirmUser._id,
                to: emailConfirmUser.email,
                userName: emailConfirmUser.name,
                hireableStatus: emailConfirmUser.hireableStatus || 'not_assessed',
                strengths: emailConfirmUser.strengths,
                weaknesses: emailConfirmUser.weaknesses,
            });

            if (result.success) {
                alert(`Email successfully sent to ${emailConfirmUser.email}`);
                // Refresh list to update status UI
                fetchUsers();
            } else {
                alert(`Failed to send email: ${result.error}`);
            }
        } catch (err) {
            console.error("Error sending email:", err);
            alert("An unexpected error occurred while sending email.");
        } finally {
            setIsSendingEmail(false);
            setEmailConfirmUser(null);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'hireable': return 'bg-green-100 text-green-700 border-green-300';
            case 'near_hireable': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'unhireable': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'hireable': return 'Hireable';
            case 'near_hireable': return 'Near Hireable';
            case 'unhireable': return 'Unhireable';
            default: return 'Not Assessed';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-sm text-gray-600">Student Submissions</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00D084] text-white rounded-lg hover:bg-[#00B872] transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Total Students</p>
                        <p className="text-3xl font-bold text-gray-900">{pagination.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Hireable</p>
                        <p className="text-3xl font-bold text-green-600">
                            {users.filter((u) => u.hireableStatus === 'hireable').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Near Hireable</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {users.filter((u) => u.hireableStatus === 'near_hireable').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Unhireable</p>
                        <p className="text-3xl font-bold text-red-600">
                            {users.filter((u) => u.hireableStatus === 'unhireable').length}
                        </p>
                    </div>
                </div>

                {/* User List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-600">No students found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <img
                                        src={user.picture || "/onboard.png"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {user.profileCompleted && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                        Profile ✓
                                                    </span>
                                                )}
                                                {user.audioRecorded && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                        Audio ✓
                                                    </span>
                                                )}
                                                {user.isBeginnerLevel && (
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                                        Beginner
                                                    </span>
                                                )}
                                                {user.emailSent ? (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg flex items-center gap-1 border border-gray-200">
                                                        Email Sent ✓
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setEmailConfirmUser(user)}
                                                        className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-lg hover:bg-gray-900 flex items-center gap-1"
                                                    >
                                                        ✉️ Send Mail
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Toggle */}
                                        <div className="mb-3">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Hireable Status:</p>
                                            <div className="flex gap-2">
                                                {['hireable', 'near_hireable', 'unhireable', 'not_assessed'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateUserStatus(user._id, status)}
                                                        className={`px-3 py-1 text-xs font-semibold rounded-full border-2 transition-all ${user.hireableStatus === status
                                                            ? getStatusColor(status)
                                                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {getStatusLabel(status)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Strengths */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-semibold text-gray-700">Strengths:</p>
                                                <button
                                                    onClick={() => handleAddItem(user._id, 'strengths')}
                                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.strengths?.map((strength, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-2"
                                                    >
                                                        {strength}
                                                        <button
                                                            onClick={() => removeItem(user._id, 'strengths', idx)}
                                                            className="text-green-900 hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                                {(!user.strengths || user.strengths.length === 0) && (
                                                    <span className="text-xs text-gray-500">No strengths added</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Weaknesses */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-semibold text-gray-700">Weaknesses:</p>
                                                <button
                                                    onClick={() => handleAddItem(user._id, 'weaknesses')}
                                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.weaknesses?.map((weakness, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-2"
                                                    >
                                                        {weakness}
                                                        <button
                                                            onClick={() => removeItem(user._id, 'weaknesses', idx)}
                                                            className="text-red-900 hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                                {(!user.weaknesses || user.weaknesses.length === 0) && (
                                                    <span className="text-xs text-gray-500">No weaknesses added</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        {user.socialLinks && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Social Links:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.socialLinks.github && (
                                                        <a
                                                            href={user.socialLinks.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200"
                                                        >
                                                            GitHub
                                                        </a>
                                                    )}
                                                    {user.socialLinks.linkedin && (
                                                        <a
                                                            href={user.socialLinks.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                                                        >
                                                            LinkedIn
                                                        </a>
                                                    )}
                                                    {user.socialLinks.twitter && (
                                                        <a
                                                            href={user.socialLinks.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-sky-100 text-sky-700 text-xs rounded-full hover:bg-sky-200"
                                                        >
                                                            Twitter
                                                        </a>
                                                    )}
                                                    {user.socialLinks.website && (
                                                        <a
                                                            href={user.socialLinks.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200"
                                                        >
                                                            Website
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Audio */}
                                        {user.audioUrl && (
                                            <button
                                                onClick={() => setSelectedAudio(user.audioUrl!)}
                                                className="px-4 py-2 bg-[#00D084] text-white rounded-lg hover:bg-[#00B872] transition-colors text-sm"
                                            >
                                                🔊 Listen to Audio
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            disabled={pagination.page === pagination.pages}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Audio Modal */}
            {selectedAudio && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
                    onClick={() => setSelectedAudio(null)}
                >
                    <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Student Audio</h3>
                                <button
                                    onClick={() => setSelectedAudio(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ✕
                                </button>
                            </div>
                            <audio
                                src={selectedAudio}
                                controls
                                autoPlay
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Item Modal */}
            {editingUser && editMode && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
                    onClick={() => {
                        setEditingUser(null);
                        setEditMode(null);
                        setEditValue("");
                    }}
                >
                    <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Add {editMode === 'strengths' ? 'Strength' : 'Weakness'}
                            </h3>
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder={`Enter ${editMode === 'strengths' ? 'strength' : 'weakness'}...`}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084] mb-4"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && saveItem()}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={saveItem}
                                    className="flex-1 px-4 py-2 bg-[#00D084] text-white rounded-lg hover:bg-[#00B872]"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setEditMode(null);
                                        setEditValue("");
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Confirmation Modal */}
            {emailConfirmUser && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
                    onClick={() => !isSendingEmail && setEmailConfirmUser(null)}
                >
                    <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Send Assessment Results</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to send the assessment results email to <b>{emailConfirmUser.name}</b> ({emailConfirmUser.email})?
                            </p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                                <p><b>Status:</b> {getStatusLabel(emailConfirmUser.hireableStatus)}</p>
                                <p><b>Strengths:</b> {emailConfirmUser.strengths?.length || 0} items</p>
                                <p><b>Weaknesses:</b> {emailConfirmUser.weaknesses?.length || 0} items</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSendEmail}
                                    disabled={isSendingEmail}
                                    className="flex-1 px-4 py-2 bg-[#00D084] text-white rounded-lg hover:bg-[#00B872] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isSendingEmail ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending...
                                        </>
                                    ) : "Yes, Send Mail"}
                                </button>
                                <button
                                    onClick={() => setEmailConfirmUser(null)}
                                    disabled={isSendingEmail}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
