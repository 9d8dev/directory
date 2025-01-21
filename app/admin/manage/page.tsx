"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/admin-header";
import Link from "next/link";

interface Bookmark {
  url: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  use_case: string | null;
  how_to_use: string | null;
  overview: string | null;
  screenshot_url: string | null;
}

export default function ManageBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const response = await fetch("/api/bookmarks");
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
      const data = await response.json();
      setBookmarks(data);
      setFilteredBookmarks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load bookmarks");
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }

    const searchLower = searchValue.toLowerCase();
    const filtered = bookmarks.filter((bookmark) => {
      return (
        bookmark.name.toLowerCase().includes(searchLower) ||
        bookmark.url.toLowerCase().includes(searchLower) ||
        bookmark.description?.toLowerCase().includes(searchLower) ||
        bookmark.category?.toLowerCase().includes(searchLower) ||
        bookmark.use_case?.toLowerCase().includes(searchLower) ||
        bookmark.overview?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredBookmarks(filtered);
  };

  // Delete bookmark
  const handleDelete = async (url: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/bookmarks/${encodeURIComponent(url)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      // Refresh the bookmarks list
      fetchBookmarks();
    } catch (err) {
      console.error("Error deleting bookmark:", err);
      alert("Failed to delete bookmark. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="mx-auto max-w-7xl p-6">
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminHeader />
        <div className="mx-auto max-w-7xl p-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Bookmarks</h1>
          <Link
            href="/admin"
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Add New Bookmark
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-lg border p-3 pl-10 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Found {filteredBookmarks.length} bookmark
            {filteredBookmarks.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.url}
              className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{bookmark.name}</h2>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-500 hover:underline"
                  >
                    {bookmark.url}
                  </a>
                  {bookmark.description && (
                    <p className="mt-2 text-gray-600">{bookmark.description}</p>
                  )}
                  {bookmark.category && (
                    <p className="mt-1 text-sm text-gray-500">
                      Category: {bookmark.category}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(bookmark.url)}
                  className="ml-4 text-red-500 transition-colors hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredBookmarks.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              {searchTerm
                ? `No bookmarks found matching "${searchTerm}"`
                : "No bookmarks found. Add some bookmarks to get started!"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
