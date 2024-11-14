'use server';

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Exa from "exa-js"

interface ActionState {
  success?: boolean;
  error?: string;
}

// Category Actions
export async function createCategory(prevState: ActionState | null, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const color = formData.get("color") as string;
    const icon = formData.get("icon") as string;

    await db.insert(categories).values({
      name,
      description,
      slug,
      color,
      icon,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(prevState: ActionState | null, formData: FormData) {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No category ID provided" };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const color = formData.get("color") as string;
    const icon = formData.get("icon") as string;

    await db
      .update(categories)
      .set({
        name,
        description,
        slug,
        color,
        icon,
      })
      .where(eq(categories.id, id));

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(prevState: ActionState | null, formData: FormData) {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No category ID provided" };
    }

    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category" };
  }
}

// Bookmark Actions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createBookmark(prevState: ActionState | null, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string;
    
    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    const url = formData.get("url") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const overview = formData.get("overview") as string;
    const search_results = formData.get("search_results") as string;
    const favicon = formData.get("favicon") as string;
    const ogImage = formData.get("ogImage") as string;
    const isFavorite = formData.get("isFavorite") === "true";
    const isArchived = formData.get("isArchived") === "true";

    const { overview: finalOverview, search_results: finalSearchResults } = await generateContent(url, search_results);

    await db.insert(bookmarks).values({
      title,
      slug,
      url,
      description,
      categoryId: categoryId === 'none' ? null : categoryId,
      overview: finalOverview,
      search_results: finalSearchResults,
      favicon,
      ogImage,
      isFavorite,
      isArchived,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to create bookmark" };
  }
}

export async function updateBookmark(prevState: ActionState | null, formData: FormData) {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string;
    
    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    const url = formData.get("url") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const overview = formData.get("overview") as string;
    const search_results = formData.get("search_results") as string;
    const favicon = formData.get("favicon") as string;
    const ogImage = formData.get("ogImage") as string;
    const isFavorite = formData.get("isFavorite") === "true";
    const isArchived = formData.get("isArchived") === "true";

    const { overview: finalOverview, search_results: finalSearchResults } = await generateContent(url, search_results);

    await db
      .update(bookmarks)
      .set({
        title,
        slug,
        url,
        description,
        categoryId: categoryId === 'none' ? null : categoryId,
        overview: finalOverview,
        search_results: finalSearchResults,
        favicon,
        ogImage,
        isFavorite,
        isArchived,
      })
      .where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to update bookmark" };
  }
}

export async function deleteBookmark(prevState: ActionState | null, formData: FormData) {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const url = formData.get("url") as string;

    await db.delete(bookmarks).where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${encodeURIComponent(url)}`);
    
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete bookmark" };
  }
}

// URL Scraping Action
export async function scrapeUrl(prevState: ActionState | null, formData: FormData) {
  try {
    const url = formData.get('url') as string;
    if (!url) return { error: 'URL is required' };
    
    const exa = new Exa("8e22846c-616f-4a1f-a677-db54533d1065");
    
    const result = await exa.getContents(
      [url],
      {
        subpages: 6,
        summary: true,
        text: true,
        livecrawl: "fallback"
      }
    );
    
    console.log(result);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error scraping URL:', error);
    return { error: 'Failed to scrape URL' };
  }
}

export async function generateContent(url: string, searchResults: string | null) {
  try {
    // Get search results from Exa if not provided
    let finalSearchResults = searchResults;
    if (!finalSearchResults && url) {
      try {
        const exa = new Exa();
        const results = await exa.search(url);
        finalSearchResults = JSON.stringify(results);
      } catch (error) {
        console.error('Error fetching Exa search results:', error);
        throw new Error('Failed to fetch search results');
      }
    }

    if (!finalSearchResults) {
      throw new Error('No search results available');
    }

    // Generate overview using Claude
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        searchResults: finalSearchResults,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate overview');
    }

    const data = await response.json();
    return {
      overview: data.overview,
      search_results: finalSearchResults,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}