"use client";

import { GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { WishlistCard } from "@/components/wishlistCard/WishlistCard";
import { WishlistHeader } from "@/components/wishlistCard/components/WishlistHeader";
import { WishlistActions } from "@/components/wishlistCard/components/WishlistActions";
import { NewWishlistDialog } from "@/components/wishlistCard/components/NewWishlistDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useNavigationFlush } from "@/hooks/use-navigation-flush";
import * as wishlistService from "@/services/wishlistService";
import type { WishList, WishlistItem } from "@/types/wishlist";

export function WishlistsClient({
  initialWishlists,
}: {
  initialWishlists: WishList[];
}) {
  useNavigationFlush();

  const router = useRouter();
  const [wishlists, setWishlists] = useState<WishList[]>(initialWishlists);
  const [error, setError] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNewWishlist, setShowNewWishlist] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<WishList[]>(initialWishlists);

  const refreshWishlists = async () => {
    try {
      const nextWishlists = await wishlistService.fetchWishlists();
      setWishlists(nextWishlists);
      setOriginalOrder(nextWishlists);
      router.refresh();
    } catch (error) {
      console.error("Error refreshing wishlists:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const selectedIds = Array.from(selectedLists);
      await wishlistService.deleteWishlists(selectedIds);
      const nextWishlists = wishlists.filter((list) => !selectedLists.has(list.id));
      setWishlists(nextWishlists);
      setOriginalOrder(nextWishlists);
      setSelectedLists(new Set());
      setDeleteMode(false);
      setShowDeleteConfirm(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting wishlists:", error);
      setError("Failed to delete wishlists");
    }
  };

  const handleReorderSave = async () => {
    try {
      const wishlistIds = wishlists.map((wishlist) => wishlist.id);
      await wishlistService.reorderWishlists(wishlistIds);
      setOriginalOrder(wishlists);
      setReorderMode(false);
      router.refresh();
    } catch (error) {
      console.error("Error reordering wishlists:", error);
      setError("Failed to reorder wishlists");
      setWishlists(originalOrder);
      setReorderMode(false);
    }
  };

  const handleCreateWishlist = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    try {
      const newWishlist = await wishlistService.createWishlist({
        name: title,
        description,
        isFavorite: false,
      });
      setWishlists((current) => [...current, { ...newWishlist, items: [] }]);
      router.refresh();
    } catch (error) {
      console.error("Error creating wishlist:", error);
      setError("Failed to create wishlist");
    }
  };

  const handleUpdateWishlist = async (
    id: string,
    data: { name: string; description: string; isFavorite: boolean }
  ) => {
    try {
      const updatedWishlist = await wishlistService.updateWishlist(id, data);
      setWishlists((current) =>
        current.map((wishlist) =>
          wishlist.id === id
            ? {
                ...wishlist,
                name: updatedWishlist.name,
                description: updatedWishlist.description,
                isFavorite: updatedWishlist.isFavorite,
              }
            : updatedWishlist.isFavorite
              ? { ...wishlist, isFavorite: false }
              : wishlist
        )
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setError("Failed to update wishlist");
    }
  };

  const handleUpdateItems = (id: string, items: WishlistItem[]) => {
    setWishlists((current) =>
      current.map((wishlist) =>
        wishlist.id === id
          ? { ...wishlist, items, itemCount: items.length }
          : wishlist
      )
    );
  };

  const toggleListSelection = (id: string) => {
    setSelectedLists((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetModes = () => {
    setDeleteMode(false);
    setReorderMode(false);
    setSelectedLists(new Set());
  };

  return (
    <>
      <div className="container mx-auto max-w-7xl p-6">
        <div className="mt-5 mr-1 mb-8 ml-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <WishlistHeader />
          <WishlistActions
            reorderMode={reorderMode}
            deleteMode={deleteMode}
            selectedCount={selectedLists.size}
            onReorderSave={handleReorderSave}
            onReorderCancel={() => {
              setWishlists(originalOrder);
              setReorderMode(false);
            }}
            onDeleteCancel={() => {
              setDeleteMode(false);
              setSelectedLists(new Set());
            }}
            onDeleteConfirm={() => selectedLists.size > 0 && setShowDeleteConfirm(true)}
            onModeChange={(mode) => {
              resetModes();
              if (mode === "reorder") setReorderMode(true);
              if (mode === "delete") setDeleteMode(true);
            }}
            onNewWishlist={() => setShowNewWishlist(true)}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30">
            {error}
          </div>
        )}

        <Reorder.Group
          axis="y"
          values={wishlists}
          onReorder={setWishlists}
          className={cn(
            "flex flex-col items-start gap-6",
            reorderMode && "w-full"
          )}
        >
          {wishlists.map((wishlist) => (
            <Reorder.Item
              key={wishlist.id}
              value={wishlist}
              dragListener={reorderMode}
              dragControls={undefined}
              className={cn(
                "w-full list-none",
                reorderMode && "flex w-full items-center gap-3"
              )}
            >
              {reorderMode && (
                <GripVertical className="text-muted-foreground h-5 w-5" />
              )}
              <WishlistCard
                {...wishlist}
                deleteMode={deleteMode}
                reorderMode={reorderMode}
                isSelected={selectedLists.has(wishlist.id)}
                onSelect={() => toggleListSelection(wishlist.id)}
                onUpdateItems={handleUpdateItems}
                onUpdate={handleUpdateWishlist}
                availableWishlists={wishlists.map((list) => ({
                  id: list.id,
                  name: list.name,
                }))}
                onRefreshWishlists={refreshWishlists}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected wishlists?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the selected wishlists and their saved items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NewWishlistDialog
        open={showNewWishlist}
        onOpenChange={setShowNewWishlist}
        onSubmit={handleCreateWishlist}
      />
    </>
  );
}
