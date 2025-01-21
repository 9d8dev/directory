"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    url: "",
    slug: "",
    name: "",
    description: "",
    category: "",
    use_case: "",
    how_to_use: "",
    overview: "",
    screenshot_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add bookmark");
      }

      // Clear form after successful submission
      setFormData({
        url: "",
        slug: "",
        name: "",
        description: "",
        category: "",
        use_case: "",
        how_to_use: "",
        overview: "",
        screenshot_url: "",
      });

      alert("Bookmark added successfully!");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Failed to add bookmark. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Add New Bookmark</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="mb-1 block text-sm font-medium">
              URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-1 block text-sm font-medium"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label
              htmlFor="use_case"
              className="mb-1 block text-sm font-medium"
            >
              Use Case
            </label>
            <textarea
              id="use_case"
              name="use_case"
              value={formData.use_case}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="how_to_use"
              className="mb-1 block text-sm font-medium"
            >
              How to Use
            </label>
            <textarea
              id="how_to_use"
              name="how_to_use"
              value={formData.how_to_use}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="overview"
              className="mb-1 block text-sm font-medium"
            >
              Overview
            </label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="screenshot_url"
              className="mb-1 block text-sm font-medium"
            >
              Screenshot URL
            </label>
            <input
              type="url"
              id="screenshot_url"
              name="screenshot_url"
              value={formData.screenshot_url}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Add Bookmark
          </button>
        </form>
      </div>
    </>
  );
}
