"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQAccordionItem {
  _id: string;
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQAccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function FAQAccordion({
  items,
  className,
  allowMultiple = false,
}: FAQAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.has(item._id);
        const panelId = `faq-panel-${item._id}`;
        const buttonId = `faq-button-${item._id}`;

        return (
          <div key={item._id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold transition-colors sm:text-base",
                  isOpen
                    ? "bg-accent/50 text-primary"
                    : "text-text hover:bg-accent/30 hover:text-primary"
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item._id)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-primary transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn(
                "overflow-hidden bg-surface px-5 transition-all",
                isOpen ? "pb-5" : "h-0"
              )}
            >
              <p className="text-sm leading-relaxed text-text-muted">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
