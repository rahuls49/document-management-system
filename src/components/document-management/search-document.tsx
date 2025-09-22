"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CalendarIcon, Search, Download, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

interface DocumentSearchResult {
    row_num: number;
    document_id: number;
    major_head: string;
    minor_head: string;
    file_url: string;
    document_date: string;
    document_remarks: string;
    upload_time: string;
    uploaded_by: string;
    total_count: number;
}

interface SearchFilters {
    major_head: string;
    minor_head: string;
    from_date: string;
    to_date: string;
    tags: { tag_name: string }[];
    uploaded_by: string;
    start: number;
    length: number;
    filterId: string;
    search: { value: string };
}

export default function SearchDocument() {
    const { userData } = useAuthStore();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<DocumentSearchResult[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Search filters state
    const [filters, setFilters] = useState<SearchFilters>({
        major_head: "",
        minor_head: "",
        from_date: "",
        to_date: "",
        tags: [],
        uploaded_by: "",
        start: 0,
        length: recordsPerPage,
        filterId: "",
        search: { value: "" }
    });

    // Date states
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [tagInput, setTagInput] = useState("");

    // Handle search form submission
    const handleSearch = async () => {
        if (!userData?.token) {
            toast.error("Authentication token not found");
            return;
        }

        setIsSearching(true);
        try {
            const searchPayload = {
                ...filters,
                from_date: fromDate ? format(fromDate, "yyyy-MM-dd") : "",
                to_date: toDate ? format(toDate, "yyyy-MM-dd") : "",
                start: (currentPage - 1) * recordsPerPage,
                length: recordsPerPage
            };

            const response = await fetch("https://apis.allsoft.co/api/documentManagement/searchDocumentEntry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": userData.token
                },
                body: JSON.stringify(searchPayload)
            });

            const data = await response.json();
            console.log({ data })
            if (data.status) {
                setSearchResults(data.data || []);
                setTotalRecords(data.recordsTotal || 0);
                toast.success(`Found ${data.recordsTotal} documents`);
            } else {
                toast.error("Search failed");
                setSearchResults([]);
                setTotalRecords(0);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("An error occurred while searching");
            setSearchResults([]);
            setTotalRecords(0);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle pagination
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Re-search when page changes
    useEffect(() => {
        if (searchResults.length > 0) {
            handleSearch();
        }
    }, [currentPage]);

    // Auto-search on component mount
    useEffect(() => {
        if (userData?.token) {
            handleSearch();
        }
    }, [userData?.token]);

    // Add tag
    const addTag = () => {
        if (tagInput.trim() && !filters.tags.some(tag => tag.tag_name === tagInput.trim())) {
            setFilters(prev => ({
                ...prev,
                tags: [...prev.tags, { tag_name: tagInput.trim() }]
            }));
            setTagInput("");
        }
    };

    // Remove tag
    const removeTag = (tagToRemove: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag.tag_name !== tagToRemove)
        }));
    };

    // Handle key press for tag input
    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    // Preview document
    const previewDocument = (fileUrl: string) => {
        window.open(fileUrl, "_blank");
    };

    // Download document
    const downloadDocument = (fileUrl: string, filename: string) => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full space-y-6">
            {/* Search Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Documents
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Row 1: Major Head, Minor Head, Search Value */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="major_head">Category</Label>
                            <Select
                                value={filters.major_head || "all"}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, major_head: value === "all" ? "" : value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Personal">Personal</SelectItem>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minor_head">Subcategory</Label>
                            <Select
                                value={filters.minor_head || "all"}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, minor_head: value === "all" ? "" : value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subcategories</SelectItem>
                                    {filters.major_head === "Personal" && (
                                        <>
                                            <SelectItem value="John">John</SelectItem>
                                            <SelectItem value="Tom">Tom</SelectItem>
                                            <SelectItem value="Emily">Emily</SelectItem>
                                        </>
                                    )}
                                    {filters.major_head === "Professional" && (
                                        <>
                                            <SelectItem value="Accounts">Accounts</SelectItem>
                                            <SelectItem value="HR">HR</SelectItem>
                                            <SelectItem value="IT">IT</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="search_value">Search</Label>
                            <Input
                                id="search_value"
                                placeholder="Search documents..."
                                value={filters.search.value}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    search: { value: e.target.value }
                                }))}
                            />
                        </div>
                    </div>

                    {/* Row 2: Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={fromDate}
                                        onSelect={setFromDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>To Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={toDate}
                                        onSelect={setToDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Row 3: Tags and Uploaded By */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tag..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleTagKeyPress}
                                    />
                                    <Button type="button" onClick={addTag} size="sm">
                                        Add
                                    </Button>
                                </div>
                                {filters.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {filters.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {tag.tag_name}
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() => removeTag(tag.tag_name)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="uploaded_by">Uploaded By</Label>
                            <Input
                                id="uploaded_by"
                                placeholder="Username..."
                                value={filters.uploaded_by}
                                onChange={(e) => setFilters(prev => ({ ...prev, uploaded_by: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-end">
                        <Button onClick={handleSearch} disabled={isSearching}>
                            <Search className="mr-2 h-4 w-4" />
                            {isSearching ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Search Results ({totalRecords} documents found)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {searchResults.map((document) => (
                                <div
                                    key={document.document_id}
                                    className="border rounded-lg p-4 space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-medium">
                                                {document.major_head} - {document.minor_head}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {document.document_remarks}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Uploaded by: {document.uploaded_by}</span>
                                                <span>Date: {format(new Date(document.document_date), "PPP")}</span>
                                                <span>Upload Time: {format(new Date(document.upload_time), "PPP")}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => previewDocument(document.file_url)}
                                                className="flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:flex">
                                                    Preview
                                                </span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadDocument(document.file_url, `document_${document.document_id}`)}
                                                className="flex items-center"
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                <span className="hidden sm:flex">
                                                    Download
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            if (totalPages <= 5) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(pageNum)}
                                                            isActive={currentPage === pageNum}
                                                            className="cursor-pointer"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }

                                            // Handle pagination with ellipsis for large page counts
                                            if (currentPage <= 3) {
                                                if (pageNum <= 3) {
                                                    return (
                                                        <PaginationItem key={pageNum}>
                                                            <PaginationLink
                                                                onClick={() => handlePageChange(pageNum)}
                                                                isActive={currentPage === pageNum}
                                                                className="cursor-pointer"
                                                            >
                                                                {pageNum}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                } else if (pageNum === 4) {
                                                    return <PaginationEllipsis key="ellipsis" />;
                                                } else if (pageNum === 5) {
                                                    return (
                                                        <PaginationItem key={totalPages}>
                                                            <PaginationLink
                                                                onClick={() => handlePageChange(totalPages)}
                                                                className="cursor-pointer"
                                                            >
                                                                {totalPages}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                }
                                            }

                                            return null;
                                        })}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* No Results */}
            {searchResults.length === 0 && totalRecords === 0 && !isSearching && (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">No documents found. Try adjusting your search criteria.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}