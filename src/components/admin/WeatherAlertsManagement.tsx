import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Pencil, Trash2, CloudRain, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type AlertSeverity = Database["public"]["Enums"]["alert_severity"];

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: AlertSeverity;
  location: string;
  start_time: string;
  end_time: string | null;
  affected_regions: string[] | null;
  created_at: string;
}

const emptyAlert = {
  title: "",
  description: "",
  alert_type: "",
  severity: "info" as AlertSeverity,
  location: "",
  start_time: "",
  end_time: "",
  affected_regions: "",
};

export const WeatherAlertsManagement = () => {
  const [editAlert, setEditAlert] = useState<WeatherAlert | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<WeatherAlert | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyAlert);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["admin-weather-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weather_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WeatherAlert[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("weather_alerts").insert({
        title: data.title,
        description: data.description,
        alert_type: data.alert_type,
        severity: data.severity,
        location: data.location,
        start_time: data.start_time,
        end_time: data.end_time || null,
        affected_regions: data.affected_regions ? data.affected_regions.split(",").map((r) => r.trim()) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-weather-alerts"] });
      toast({ title: "Weather alert created successfully" });
      setIsCreating(false);
      setFormData(emptyAlert);
    },
    onError: (error) => {
      toast({ title: "Error creating alert", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("weather_alerts")
        .update({
          title: data.title,
          description: data.description,
          alert_type: data.alert_type,
          severity: data.severity,
          location: data.location,
          start_time: data.start_time,
          end_time: data.end_time || null,
          affected_regions: data.affected_regions ? data.affected_regions.split(",").map((r) => r.trim()) : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-weather-alerts"] });
      toast({ title: "Weather alert updated successfully" });
      setEditAlert(null);
    },
    onError: (error) => {
      toast({ title: "Error updating alert", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("weather_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-weather-alerts"] });
      toast({ title: "Weather alert deleted successfully" });
      setDeleteAlert(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting alert", description: error.message, variant: "destructive" });
    },
  });

  const openEditDialog = (alert: WeatherAlert) => {
    setFormData({
      title: alert.title,
      description: alert.description,
      alert_type: alert.alert_type,
      severity: alert.severity,
      location: alert.location,
      start_time: alert.start_time,
      end_time: alert.end_time || "",
      affected_regions: alert.affected_regions?.join(", ") || "",
    });
    setEditAlert(alert);
  };

  const openCreateDialog = () => {
    setFormData({
      ...emptyAlert,
      start_time: new Date().toISOString().slice(0, 16),
    });
    setIsCreating(true);
  };

  const handleSubmit = () => {
    if (editAlert) {
      updateMutation.mutate({ id: editAlert.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const AlertForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          placeholder="e.g., Heavy Rainfall Warning"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          placeholder="Describe the weather alert..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="alert_type">Alert Type</Label>
          <Input
            id="alert_type"
            value={formData.alert_type}
            onChange={(e) => setFormData((p) => ({ ...p, alert_type: e.target.value }))}
            placeholder="e.g., Rain, Storm, Heat"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="severity">Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value: AlertSeverity) => setFormData((p) => ({ ...p, severity: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
          placeholder="e.g., Maharashtra, India"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="datetime-local"
            value={formData.start_time}
            onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_time">End Time (optional)</Label>
          <Input
            id="end_time"
            type="datetime-local"
            value={formData.end_time}
            onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="affected_regions">Affected Regions (comma-separated)</Label>
        <Input
          id="affected_regions"
          value={formData.affected_regions}
          onChange={(e) => setFormData((p) => ({ ...p, affected_regions: e.target.value }))}
          placeholder="e.g., Pune, Mumbai, Nashik"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            Weather Alerts
          </CardTitle>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading alerts...
                  </TableCell>
                </TableRow>
              ) : alerts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No weather alerts found
                  </TableCell>
                </TableRow>
              ) : (
                alerts?.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <div className="font-medium truncate">{alert.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {alert.description.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{alert.alert_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1 capitalize">{alert.severity}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>{format(new Date(alert.start_time), "MMM d, HH:mm")}</div>
                        {alert.end_time && (
                          <div className="text-muted-foreground">
                            to {format(new Date(alert.end_time), "MMM d, HH:mm")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(alert)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteAlert(alert)}
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
      <Dialog open={isCreating || !!editAlert} onOpenChange={() => { setIsCreating(false); setEditAlert(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editAlert ? "Edit Weather Alert" : "Create Weather Alert"}</DialogTitle>
            <DialogDescription>
              {editAlert ? "Update the weather alert details." : "Create a new weather alert for farmers."}
            </DialogDescription>
          </DialogHeader>
          <AlertForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreating(false); setEditAlert(null); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.title || !formData.description || !formData.start_time}>
              {editAlert ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAlert} onOpenChange={() => setDeleteAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Weather Alert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteAlert?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteAlert && deleteMutation.mutate(deleteAlert.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
