"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

type ContactFormData = z.infer<typeof contactSchema>;

const INQUIRY_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Question" },
  { value: "plant-care", label: "Plant Care" },
  { value: "wholesale", label: "Wholesale" },
  { value: "other", label: "Other" },
];

export interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      showToast({
        type: "success",
        title: "Message sent",
        message: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch (error) {
      showToast({
        type: "error",
        title: "Something went wrong",
        message:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Select
          label="Inquiry Type"
          options={INQUIRY_OPTIONS}
          error={errors.inquiryType?.message}
          {...register("inquiryType")}
        />
      </div>

      <Input
        label="Subject"
        error={errors.subject?.message}
        {...register("subject")}
      />

      <Input
        label="Order Number"
        hint="If your inquiry is about an existing order"
        error={errors.orderNumber?.message}
        {...register("orderNumber")}
      />

      <Textarea
        label="Message"
        required
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" loading={submitting} size="lg">
        Send Message
      </Button>
    </form>
  );
}
