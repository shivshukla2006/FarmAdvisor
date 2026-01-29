import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Search, Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  application_link: string | null;
  state: string | null;
  scheme_type: string | null;
  active: boolean | null;
  created_at: string;
}

const emptyScheme = {
  title: "",
  description: "",
  eligibility: "",
  benefits: "",
  application_link: "",
  state: "",
  scheme_type: "",
  active: true,
};

export const SchemesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editScheme, setEditScheme] = useState<Scheme | null>(null);
  const [deleteScheme, setDeleteScheme] = useState<Scheme | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyScheme);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schemes, isLoading } = useQuery({
    queryKey: ["admin-schemes", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("government_schemes")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as Scheme[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("government_schemes").insert({
        title: data.title,
        description: data.description,
        eligibility: data.eligibility,
        benefits: data.benefits,
        application_link: data.application_link || null,
        state: data.state || null,
        scheme_type: data.scheme_type || null,
        active: data.active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schemes"] });
      toast({ title: "Scheme created successfully" });
      setIsCreating(false);
      setFormData(emptyScheme);
    },
    onError: (error) => {
      toast({ title: "Error creating scheme", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("government_schemes")
        .update({
          title: data.title,
          description: data.description,
          eligibility: data.eligibility,
          benefits: data.benefits,
          application_link: data.application_link || null,
          state: data.state || null,
          scheme_type: data.scheme_type || null,
          active: data.active,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schemes"] });
      toast({ title: "Scheme updated successfully" });
      setEditScheme(null);
    },
    onError: (error) => {
      toast({ title: "Error updating scheme", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete related bookmarks
      await supabase.from("scheme_bookmarks").delete().eq("scheme_id", id);
      // Then delete the scheme
      const { error } = await supabase.from("government_schemes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schemes"] });
      toast({ title: "Scheme deleted successfully" });
      setDeleteScheme(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting scheme", description: error.message, variant: "destructive" });
    },
  });

  const openEditDialog = (scheme: Scheme) => {
    setFormData({
      title: scheme.title,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      application_link: scheme.application_link || "",
      state: scheme.state || "",
      scheme_type: scheme.scheme_type || "",
      active: scheme.active ?? true,
    });
    setEditScheme(scheme);
  };

  const openCreateDialog = () => {
    setFormData(emptyScheme);
    setIsCreating(true);
  };

  const handleSubmit = () => {
    if (editScheme) {
      updateMutation.mutate({ id: editScheme.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const SchemeForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          placeholder="Scheme title"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          placeholder="Describe the scheme"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
            placeholder="e.g., Maharashtra"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="scheme_type">Scheme Type</Label>
          <Input
            id="scheme_type"
            value={formData.scheme_type}
            onChange={(e) => setFormData((p) => ({ ...p, scheme_type: e.target.value }))}
            placeholder="e.g., Subsidy"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="eligibility">Eligibility</Label>
        <Textarea
          id="eligibility"
          value={formData.eligibility}
          onChange={(e) => setFormData((p) => ({ ...p, eligibility: e.target.value }))}
          placeholder="Who can apply?"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData((p) => ({ ...p, benefits: e.target.value }))}
          placeholder="What benefits are provided?"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="application_link">Application Link</Label>
        <Input
          id="application_link"
          value={formData.application_link}
          onChange={(e) => setFormData((p) => ({ ...p, application_link: e.target.value }))}
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData((p) => ({ ...p, active: checked }))}
        />
        <Label htmlFor="active">Active</Label>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Government Schemes
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scheme
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading schemes...
                  </TableCell>
                </TableRow>
              ) : schemes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No schemes found
                  </TableCell>
                </TableRow>
              ) : (
                schemes?.map((scheme) => (
                  <TableRow key={scheme.id}>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <div className="font-medium truncate">{scheme.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {scheme.description.substring(0, 80)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{scheme.state || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{scheme.scheme_type || "General"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={scheme.active ? "default" : "secondary"}>
                        {scheme.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(scheme.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {scheme.application_link && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={scheme.application_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(scheme)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteScheme(scheme)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editScheme} onOpenChange={() => { setIsCreating(false); setEditScheme(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editScheme ? "Edit Scheme" : "Add New Scheme"}</DialogTitle>
            <DialogDescription>
              {editScheme ? "Update the scheme details below." : "Fill in the details for the new government scheme."}
            </DialogDescription>
          </DialogHeader>
          <SchemeForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditScheme(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.description}>
              {editScheme ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteScheme} onOpenChange={() => setDeleteScheme(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scheme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteScheme?.title}"? This will also remove all user bookmarks for this scheme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteScheme && deleteMutation.mutate(deleteScheme.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
