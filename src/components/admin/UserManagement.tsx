import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Search, MoreHorizontal, Shield, ShieldCheck, User, UserX, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { UserDetailModal } from "./UserDetailModal";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  farm_location: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: AppRole;
}

export const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleAction, setRoleAction] = useState<{ userId: string; role: AppRole; action: "add" | "remove" } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (error) throw error;
      return data as UserRole[];
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "Role added successfully" });
      setRoleAction(null);
    },
    onError: (error) => {
      toast({ title: "Error adding role", description: error.message, variant: "destructive" });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "Role removed successfully" });
      setRoleAction(null);
    },
    onError: (error) => {
      toast({ title: "Error removing role", description: error.message, variant: "destructive" });
    },
  });

  const getUserRoles = (userId: string): AppRole[] => {
    return userRoles?.filter((r) => r.user_id === userId).map((r) => r.role) || [];
  };

  const handleRoleAction = () => {
    if (!roleAction) return;
    if (roleAction.action === "add") {
      addRoleMutation.mutate({ userId: roleAction.userId, role: roleAction.role });
    } else {
      removeRoleMutation.mutate({ userId: roleAction.userId, role: roleAction.role });
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Management
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => {
                  const roles = getUserRoles(user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name || "Unnamed"}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{user.farm_location || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {roles.length > 0 ? (
                            roles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">user</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setDetailModalOpen(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setDetailModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {!roles.includes("admin") && (
                                <DropdownMenuItem
                                  onClick={() => setRoleAction({ userId: user.id, role: "admin", action: "add" })}
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {roles.includes("admin") && (
                                <DropdownMenuItem
                                  onClick={() => setRoleAction({ userId: user.id, role: "admin", action: "remove" })}
                                  className="text-destructive"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </DropdownMenuItem>
                              )}
                              {!roles.includes("moderator") && (
                                <DropdownMenuItem
                                  onClick={() => setRoleAction({ userId: user.id, role: "moderator", action: "add" })}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Moderator
                                </DropdownMenuItem>
                              )}
                              {roles.includes("moderator") && (
                                <DropdownMenuItem
                                  onClick={() => setRoleAction({ userId: user.id, role: "moderator", action: "remove" })}
                                  className="text-destructive"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Remove Moderator
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={!!roleAction} onOpenChange={() => setRoleAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleAction?.action === "add" ? "Add Role" : "Remove Role"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {roleAction?.action === "add" ? "add" : "remove"} the{" "}
              <strong>{roleAction?.role}</strong> role {roleAction?.action === "add" ? "to" : "from"} this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserDetailModal
        userId={selectedUserId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </Card>
  );
};
