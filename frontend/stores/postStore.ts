import {create} from "zustand";

export interface Post {
    id: number;
    user_id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string };
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface PostState {
    posts: Post[];
    meta: PaginationMeta | null;
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;

    fetchPosts: (token: string, page?: number) => Promise<void>;
    fetchPost: (token: string, id: number) => Promise<void>;
    createPost: (token: string, title: string, content: string) => Promise<Post | null>;
    updatePost: (token: string, id: number, title: string, content: string) => Promise<Post | null>;
    deletePost: (token: string, id: number) => Promise<boolean>;
    clearError: () => void;
    clearCurrentPost: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function authHeaders(token: string) {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export const usePostStore = create<PostState>()((set) => ({
    posts: [],
    meta: null,
    currentPost: null,
    isLoading: false,
    error: null,

    fetchPosts: async (token, page = 1) => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch(`${API_URL}/posts?page=${page}`, {
                headers: authHeaders(token),
            });
            const data = await res.json();
            if (!res.ok) {
                set({error: data?.message ?? "Gagal memuat posts.", isLoading: false});
                return;
            }
            set({
                posts: data.data,
                meta: {
                    current_page: data.current_page,
                    last_page: data.last_page,
                    per_page: data.per_page,
                    total: data.total,
                    from: data.from,
                    to: data.to,
                },
                isLoading: false,
            });
        } catch {
            set({error: "Tidak bisa terhubung ke server.", isLoading: false});
        }
    },

    fetchPost: async (token, id) => {
        set({isLoading: true, error: null, currentPost: null});
        try {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                headers: authHeaders(token),
            });
            const data = await res.json();
            if (!res.ok) {
                set({error: data?.message ?? "Post tidak ditemukan.", isLoading: false});
                return;
            }
            set({currentPost: data, isLoading: false});
        } catch {
            set({error: "Tidak bisa terhubung ke server.", isLoading: false});
        }
    },

    createPost: async (token, title, content) => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify({title, content}),
            });
            const data = await res.json();
            if (!res.ok) {
                const msg = data?.errors
                    ? Object.values(data.errors as Record<string, string[]>).flat().join(" ")
                    : data?.message ?? "Gagal membuat post.";
                set({error: msg, isLoading: false});
                return null;
            }
            set({isLoading: false});
            return data as Post;
        } catch {
            set({error: "Tidak bisa terhubung ke server.", isLoading: false});
            return null;
        }
    },

    updatePost: async (token, id, title, content) => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: "PUT",
                headers: authHeaders(token),
                body: JSON.stringify({title, content}),
            });
            const data = await res.json();
            if (!res.ok) {
                const msg = data?.errors
                    ? Object.values(data.errors as Record<string, string[]>).flat().join(" ")
                    : data?.message ?? "Gagal mengupdate post.";
                set({error: msg, isLoading: false});
                return null;
            }
            set({isLoading: false});
            return data as Post;
        } catch {
            set({error: "Tidak bisa terhubung ke server.", isLoading: false});
            return null;
        }
    },

    deletePost: async (token, id) => {
        set({isLoading: true, error: null});
        try {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: authHeaders(token),
            });
            if (!res.ok) {
                const data = await res.json();
                set({error: data?.message ?? "Gagal menghapus post.", isLoading: false});
                return false;
            }
            set({isLoading: false});
            return true;
        } catch {
            set({error: "Tidak bisa terhubung ke server.", isLoading: false});
            return false;
        }
    },

    clearError: () => set({error: null}),
    clearCurrentPost: () => set({currentPost: null}),
}));