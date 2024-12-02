"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createCategory, updateCategory, deleteCategory } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/lib/data";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [createState, createAction] = useFormState(createCategory, null);
  const [updateState, updateAction] = useFormState(updateCategory, null);
  const [deleteState, deleteAction] = useFormState(deleteCategory, null);

  // Handle form submission results
  if (createState?.success || updateState?.success || deleteState?.success) {
    toast.success("Category updated successfully!");
    window.location.reload(); // Refresh to show changes
  }

  if (createState?.error || updateState?.error || deleteState?.error) {
    toast.error(createState?.error || updateState?.error || deleteState?.error);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing bookmarks.
              </DialogDescription>
            </DialogHeader>
            <form action={createAction} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  onChange={(e) => {
                    // Also update the slug field
                    const slugInput = document.getElementById('slug') as HTMLInputElement;
                    if (slugInput) {
                      slugInput.value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div>
                <Label htmlFor="color">Color (hex)</Label>
                <Input
                  id="color"
                  name="color"
                  type="color"
                  className="h-10 px-2"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input id="icon" name="icon" placeholder="📚" />
              </div>
              <DialogFooter>
                <Button type="submit">Create Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.color && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.color}
                    </div>
                  )}
                </TableCell>
                <TableCell>{category.icon}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <form action={updateAction} className="space-y-4">
            <input type="hidden" name="id" value={selectedCategory?.id} />
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                defaultValue={selectedCategory?.name} 
                required 
                onChange={(e) => {
                  // Also update the slug field
                  const slugInput = document.getElementById('edit-slug') as HTMLInputElement;
                  if (slugInput) {
                    slugInput.value = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug</Label>
              <Input id="edit-slug" name="slug" defaultValue={selectedCategory?.slug} required />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={selectedCategory?.description || ""}
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Color (hex)</Label>
              <Input
                id="edit-color"
                name="color"
                type="color"
                className="h-10 px-2"
                defaultValue={selectedCategory?.color || "#000000"}
              />
            </div>
            <div>
              <Label htmlFor="edit-icon">Icon (emoji)</Label>
              <Input
                id="edit-icon"
                name="icon"
                defaultValue={selectedCategory?.icon || ""}
                placeholder="📚"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={selectedCategory?.id} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
