"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import { MultiImageUpload } from "./ImageUpload";
import type { ProductImage, ProductVariant } from "@/types";

export interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number;
  category: string;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  stockQuantity: number;
  stockStatus: string;
  featured: boolean;
  active: boolean;
  specifications: Record<string, string>;
  careInstructions: string;
  shippingInfo: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  seoTitle: string;
  seoDescription: string;
  displayOrder: number;
  difficultyLevel: string;
  lightRequirements: string;
  wateringInfo: string;
  careLevel: string;
  suitableRoom: string;
  plantSize: string;
  petSafety: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const defaultData: ProductFormData = {
  name: "",
  slug: "",
  sku: "",
  shortDescription: "",
  fullDescription: "",
  price: 0,
  category: "",
  tags: [],
  variants: [],
  images: [],
  stockQuantity: 0,
  stockStatus: "in_stock",
  featured: false,
  active: true,
  specifications: {},
  careInstructions: "",
  shippingInfo: "",
  dimensions: { unit: "cm" },
  seoTitle: "",
  seoDescription: "",
  displayOrder: 0,
  difficultyLevel: "",
  lightRequirements: "",
  wateringInfo: "",
  careLevel: "",
  suitableRoom: "",
  plantSize: "",
  petSafety: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none focus:ring-1 focus:ring-[#4A2C6E]";
const labelClass = "block text-sm font-medium text-[#2D2D2D] mb-1";

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  loading = false,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    ...defaultData,
    ...initialData,
    specifications: initialData?.specifications || {},
    variants: initialData?.variants || [],
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    dimensions: initialData?.dimensions || { unit: "cm" },
  });
  const [tagInput, setTagInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);

  useEffect(() => {
    if (autoSlug && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, autoSlug]);

  const update = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const addVariant = () => {
    update("variants", [
      ...form.variants,
      { name: "", sku: "", price: undefined, stock: 0, image: "" },
    ]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const variants = form.variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    update("variants", variants);
  };

  const removeVariant = (index: number) => {
    update("variants", form.variants.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      update("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const addSpec = () => {
    if (specKey.trim()) {
      update("specifications", {
        ...form.specifications,
        [specKey.trim()]: specValue,
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">
          Basic Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                update("slug", e.target.value);
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description</label>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea
              rows={5}
              value={form.fullDescription}
              onChange={(e) => update("fullDescription", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">
          Pricing & Inventory
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Price (CAD) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Compare at Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compareAtPrice ?? ""}
              onChange={(e) =>
                update(
                  "compareAtPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Sale Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice ?? ""}
              onChange={(e) =>
                update(
                  "salePrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => update("stockQuantity", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock Status</label>
            <select
              value={form.stockStatus}
              onChange={(e) => update("stockStatus", e.target.value)}
              className={inputClass}
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.weight ?? ""}
              onChange={(e) =>
                update(
                  "weight",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-gray-300 text-[#4A2C6E]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
              className="rounded border-gray-300 text-[#4A2C6E]"
            />
            Active
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">Images</h2>
        <MultiImageUpload
          images={form.images}
          onChange={(images) => update("images", images)}
        />
      </section>

      {/* Variants */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2D2D2D]">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 rounded-lg bg-[#E8E0F0] px-3 py-1.5 text-sm font-medium text-[#4A2C6E] hover:bg-[#ddd0ed]"
          >
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-sm text-gray-500">No variants added.</p>
        ) : (
          <div className="space-y-3">
            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-[#E8E0F0] p-4 sm:grid-cols-5"
              >
                <input
                  placeholder="Name"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="SKU"
                  value={variant.sku || ""}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price ?? ""}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "price",
                      e.target.value ? Number(e.target.value) : 0
                    )
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", Number(e.target.value))
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Plant Fields */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">
          Plant Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["difficultyLevel", "Difficulty Level"],
              ["lightRequirements", "Light Requirements"],
              ["wateringInfo", "Watering Info"],
              ["careLevel", "Care Level"],
              ["suitableRoom", "Suitable Room"],
              ["plantSize", "Plant Size"],
              ["petSafety", "Pet Safety"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass}>Care Instructions</label>
            <textarea
              rows={3}
              value={form.careInstructions}
              onChange={(e) => update("careInstructions", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Shipping Info</label>
            <textarea
              rows={2}
              value={form.shippingInfo}
              onChange={(e) => update("shippingInfo", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Tags & Specs */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">
          Tags & Specifications
        </h2>
        <div className="mb-4">
          <label className={labelClass}>Tags</label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className={inputClass}
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[#E8E0F0] px-3 py-1 text-xs font-medium text-[#4A2C6E]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "tags",
                      form.tags.filter((t) => t !== tag)
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Specifications</label>
          <div className="flex gap-2">
            <input
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
              className={inputClass}
              placeholder="Key"
            />
            <input
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              className={inputClass}
              placeholder="Value"
            />
            <button
              type="button"
              onClick={addSpec}
              className="rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              Add
            </button>
          </div>
          {Object.entries(form.specifications).length > 0 && (
            <dl className="mt-3 space-y-1">
              {Object.entries(form.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded bg-[#FAF8F5] px-3 py-2 text-sm"
                >
                  <span>
                    <strong>{key}:</strong> {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const specs = { ...form.specifications };
                      delete specs[key];
                      update("specifications", specs);
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#2D2D2D]">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              value={form.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea
              rows={2}
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#4A2C6E] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#3d2459] disabled:opacity-50"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
