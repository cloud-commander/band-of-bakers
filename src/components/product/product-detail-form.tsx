"use client";

import { useState } from "react";
import { Product, ProductVariant, BakeSaleWithLocation } from "@/lib/repositories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

interface ProductDetailFormProps {
  product: Product & { variants?: ProductVariant[] };
  upcomingBakeSales: BakeSaleWithLocation[];
}

export function ProductDetailForm({ product, upcomingBakeSales }: ProductDetailFormProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || "base"
  );
  const [selectedBakeSaleId, setSelectedBakeSaleId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant
    ? product.base_price + selectedVariant.price_adjustment
    : product.base_price;

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock =
    product.stock_quantity !== null &&
    product.stock_quantity !== undefined &&
    product.stock_quantity > 0 &&
    product.stock_quantity < 5;

  const handleAddToCart = () => {
    if (!selectedBakeSaleId) {
      toast.error("Please select a collection date");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name + (selectedVariant ? ` - ${selectedVariant.name}` : ""),
      price: currentPrice,
      image: product.image_url || undefined,
      quantity: parseInt(quantity),
      variantId: selectedVariant?.id,
      bakeSaleId: selectedBakeSaleId,
      bakeSaleDate: upcomingBakeSales.find((bs) => bs.id === selectedBakeSaleId)?.date,
      bakeSaleLocation: upcomingBakeSales.find((bs) => bs.id === selectedBakeSaleId)?.location.name,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`${DESIGN_TOKENS.typography.h1.size} ${DESIGN_TOKENS.typography.h1.weight} mb-2`}
          style={{ fontFamily: DESIGN_TOKENS.typography.h1.family }}
        >
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <p
            className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight}`}
            style={{ color: DESIGN_TOKENS.colors.accent }}
          >
            £{currentPrice.toFixed(2)}
          </p>
          {isOutOfStock && (
            <span className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold rounded-full">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-orange-500 text-white px-3 py-1 text-sm font-bold rounded-full">
              Low Stock: {product.stock_quantity} left
            </span>
          )}
        </div>
        {product.available_from && (
          <p
            className={`${DESIGN_TOKENS.typography.body.sm.size} mt-2`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Available from:{" "}
            {new Date(product.available_from).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <p
        className={`${DESIGN_TOKENS.typography.body.base.size} leading-relaxed`}
        style={{ color: DESIGN_TOKENS.colors.text.muted }}
      >
        {product.description}
      </p>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label
            className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
          >
            Select Size
          </label>
          <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Standard - £{product.base_price.toFixed(2)}</SelectItem>
              {product.variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  {variant.name} - £{(product.base_price + variant.price_adjustment).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Bake Sale Selector */}
      <div>
        <label
          className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
        >
          Select Collection Date
        </label>
        <Select value={selectedBakeSaleId} onValueChange={setSelectedBakeSaleId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a bake sale date" />
          </SelectTrigger>
          <SelectContent>
            {upcomingBakeSales.map((bakeSale) => (
              <SelectItem key={bakeSale.id} value={bakeSale.id}>
                {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" at "}
                {bakeSale.location.name}
                {" - Order by "}
                {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p
          className={`${DESIGN_TOKENS.typography.body.sm.size} mt-2`}
          style={{ color: DESIGN_TOKENS.colors.text.muted }}
        >
          Orders must be placed before the cutoff date
        </p>
      </div>

      {/* Quantity */}
      <div>
        <label
          className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
        >
          Quantity
        </label>
        <Select value={quantity} onValueChange={setQuantity}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add to Cart */}
      <div className="pt-4">
        <AnimatedButton
          size="lg"
          className="w-full md:w-auto px-12"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
        </AnimatedButton>
      </div>
    </div>
  );
}
