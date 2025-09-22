"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";

const formSchema = z.object({
  document_date: z.date(),
  major_head: z.string().min(1, "Major head is required"),
  minor_head: z.string().min(1, "Minor head is required"),
  tags: z.array(z.object({ tag_name: z.string() })),
  document_remarks: z.string().min(1, "Remarks are required"),
  file: z.any().refine((file) => file instanceof File, "Please select a file to upload"),
});

type FormData = z.infer<typeof formSchema>;

export default function UploadDocument() {
  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [existingTags, setExistingTags] = useState<{ id: string; label: string }[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_date: new Date(),
      major_head: "",
      minor_head: "",
      tags: [],
      document_remarks: "",
      file: undefined,
    },
  });

  // Reset form and clear tags when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
      setExistingTags([]);
    }
  }, [open, form]);

  const { userData } = useAuthStore();
  const token = userData?.token || '';
  const user_id = userData?.user_id || '';

  // Fetch tags from API
  const fetchTags = useCallback(async (term: string) => {
    setLoadingTags(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documentManagement/documentTags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token
        },
        body: JSON.stringify({ term }),
      });
      const res = await response.json();
      if (res.status && Array.isArray(res.data)) {
        setExistingTags(res.data);
      } else {
        setExistingTags([]);
      }
    } catch {
      setExistingTags([]);
    }
    setLoadingTags(false);
  }, [token]);

  // Debounced tag search (only fetch if input is not empty)
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const term = tagInput.trim();
      if (term) {
        fetchTags(term);
      } else {
        setExistingTags([]);
      }
    }, 400);
    // Cleanup
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tagInput, open, fetchTags]);

  const onSubmit = async (data: FormData) => {
    // Validate required fields
    if (!data.file) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!data.major_head || !data.minor_head || !data.document_remarks) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Format date as dd-mm-yyyy
    const formattedDate = `${data.document_date.getDate().toString().padStart(2, '0')}-${(data.document_date.getMonth() + 1).toString().padStart(2, '0')}-${data.document_date.getFullYear()}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append(
      "data",
      JSON.stringify({
        major_head: data.major_head,
        minor_head: data.minor_head,
        document_date: formattedDate,
        document_remarks: data.document_remarks,
        tags: data.tags,
        user_id,
      })
    );

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documentManagement/saveDocumentEntry`, {
        method: "POST",
        body: formData,
        headers: {
          token: token || "",
        },
      });
      const responseData = await response.json();
      if (responseData?.status) {
        setOpen(false);
        form.reset();
        toast.success("Document uploaded successfully!");
      } else {
        toast.error("Failed to upload document.");
      }
    } catch {
      toast.error("An error occurred during upload.");
    }
  };

  const addTag = (tag: string) => {
    if (tag && !form.getValues("tags").some(t => t.tag_name === tag)) {
      form.setValue("tags", [...form.getValues("tags"), { tag_name: tag }]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue("tags", form.getValues("tags").filter(t => t.tag_name !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-sm font-medium px-6 py-2">Upload Document</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg mx-auto rounded-2xl p-4 sm:p-6 overflow-auto" style={{ maxHeight: '90vh' }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Document</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4">
            Upload a new document with details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date picker */}
            <FormField
              control={form.control}
              name="document_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Document Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value?.toISOString().split('T')[0]} onChange={(e) => field.onChange(new Date(e.target.value))} className="h-10 text-sm px-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Major head & Minor head in one row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="major_head"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-1">Major Head</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-10 text-sm px-3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="minor_head"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-1">Minor Head</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-10 text-sm px-3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Search or add tag, press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="h-10 text-sm px-3"
                      />
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.watch("tags").map((tag) => (
                          <Badge key={tag.tag_name} variant="secondary" className="cursor-pointer px-2 py-0.5 text-sm" onClick={() => removeTag(tag.tag_name)}>
                            {tag.tag_name} <span className="ml-1 text-base">×</span>
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-400 mt-2">
                        {loadingTags ? (
                          <span>Loading tags...</span>
                        ) : (
                          <>
                            Suggested tags: {existingTags.length === 0 ? <span>No tags found.</span> : existingTags.map(tag => (
                              <Badge key={tag.id} variant="outline" className="cursor-pointer mr-2 px-2 py-0.5 text-sm" onClick={() => addTag(tag.label)}>
                                {tag.label}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Remarks */}
            <FormField
              control={form.control}
              name="document_remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">Remarks</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 text-sm px-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* File */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1">File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      className="h-10 text-sm px-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2 w-full px-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-8 text-sm px-6 border border-gray-300 font-medium w-1/2">
                Cancel
              </Button>
              <Button type="submit" className="h-8 text-sm px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md w-1/2">
                Upload
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}