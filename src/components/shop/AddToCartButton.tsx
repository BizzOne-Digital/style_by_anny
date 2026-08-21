"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

export interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity"> & { quantity?: number };
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showIcon?: boolean;
}

export function AddToCartButton({
  item,
  className,
  size = "md",
  fullWidth = false,
  showIcon = true,
}: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const isOutOfStock = item.maxStock <= 0;

  const handleAdd = async () => {
    if (isOutOfStock) return;

    setAdding(true);
    try {
      addItem({ ...item, quantity: item.quantity ?? 1 });
      showToast({
        type: "success",
        title: "Added to cart",
        message: item.name,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button
      variant="primary"
      size={size}
      fullWidth={fullWidth}
      loading={adding}
      disabled={isOutOfStock}
      onClick={handleAdd}
      className={cn(className)}
    >
      {showIcon && <ShoppingBag className="size-4" />}
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
