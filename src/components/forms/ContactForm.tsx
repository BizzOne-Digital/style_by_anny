"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast("Message sent! We'll get back to you soon.");
        reset();
      } else {
        toast(result.error || "Failed to send message", "error");
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          {...register("name")}
          error={errors.name?.message}
          required
        />
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Phone" type="tel" {...register("phone")} />
        <Input label="Subject" {...register("subject")} />
      </div>
      <Input label="Order Number (optional)" {...register("orderNumber")} />
      <Textarea
        label="Message"
        {...register("message")}
        error={errors.message?.message}
        required
        rows={5}
      />
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
