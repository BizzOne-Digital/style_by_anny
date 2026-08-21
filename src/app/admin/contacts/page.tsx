"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatDate } from "@/lib/utils";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const toast = useAdminToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts");
      const json = await res.json();
      if (json.success) {
        const items = Array.isArray(json.data)
          ? json.data
          : (json.data?.items ?? []);
        setContacts(items);
      }
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const markAsRead = async (id: string, read: boolean, replied?: boolean) => {
    try {
      const res = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read, replied }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      fetchContacts();
      if (selected?._id === id) {
        setSelected({ ...selected, read, replied: replied ?? selected.replied });
      }
      toast.success("Updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Contact deleted");
      setDeleteId(null);
      if (selected?._id === deleteId) setSelected(null);
      fetchContacts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Contact>[] = [
    {
      key: "name",
      header: "Name",
      render: (c) => (
        <button
          type="button"
          onClick={() => {
            setSelected(c);
            if (!c.read) markAsRead(c._id, true);
          }}
          className={`text-left font-medium hover:text-[#4A2C6E] ${
            !c.read ? "font-bold" : ""
          }`}
        >
          {c.name}
        </button>
      ),
    },
    { key: "email", header: "Email" },
    {
      key: "subject",
      header: "Subject",
      render: (c) => c.subject || c.inquiryType || "—",
    },
    {
      key: "read",
      header: "Status",
      render: (c) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            c.replied
              ? "bg-green-100 text-green-800"
              : c.read
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {c.replied ? "Replied" : c.read ? "Read" : "New"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (c) => formatDate(c.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <div className="flex gap-2">
          {!c.read && (
            <button
              type="button"
              onClick={() => markAsRead(c._id, true)}
              className="text-[#4A2C6E]"
              title="Mark as read"
            >
              <MailOpen className="h-4 w-4" />
            </button>
          )}
          {!c.replied && (
            <button
              type="button"
              onClick={() => markAsRead(c._id, true, true)}
              className="text-green-600"
              title="Mark as replied"
            >
              <Mail className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setDeleteId(c._id)}
            className="text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Contacts" subtitle="Contact form submissions" />
      <main className="flex-1 p-4 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataTable
              columns={columns}
              data={contacts}
              keyField="_id"
              loading={loading}
              searchKeys={["name", "email", "subject", "message"]}
              emptyMessage="No contact submissions yet"
            />
          </div>

          <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <h2 className="mb-4 font-semibold">Message Detail</h2>
            {selected ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">From</p>
                  <p className="font-medium">{selected.name}</p>
                  <p>{selected.email}</p>
                  {selected.phone && <p>{selected.phone}</p>}
                </div>
                {selected.subject && (
                  <div>
                    <p className="text-gray-500">Subject</p>
                    <p>{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Message</p>
                  <p className="whitespace-pre-wrap">{selected.message}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {formatDate(selected.createdAt)}
                </p>
                <div className="flex gap-2 pt-2">
                  {!selected.replied && (
                    <button
                      type="button"
                      onClick={() => markAsRead(selected._id, true, true)}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white"
                    >
                      Mark Replied
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a message to view details
              </p>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Contact"
        message="Are you sure you want to delete this contact submission?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
