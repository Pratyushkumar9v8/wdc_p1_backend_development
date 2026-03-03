import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Mail, Phone, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  phone: string;
}

export function Profile() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : {
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Software developer passionate about creating amazing web experiences.",
      phone: "+1 (555) 123-4567"
    };
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      await authService.logout();
      navigate("/");
      return;
    }

    setIsDeleting(true);
    
    try {
      await userService.deleteUser(Number(userId));
      toast.success("Account deleted successfully");
      setIsDeleteDialogOpen(false);
      await authService.logout();
      navigate("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to delete account. Please try again.";
      toast.error(errorMessage);
      console.error("Delete account error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl">Profile</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Name</span>
                    </div>
                    <p className="text-lg">{profile.name}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p>{profile.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p>{profile.phone}</p>
                  </div>

                  <div>
                    <div className="text-gray-600 mb-1">
                      <span className="text-sm">Bio</span>
                    </div>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button onClick={handleEditProfile} className="flex-1">
                  Edit Profile
                </Button>
                
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1" disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
