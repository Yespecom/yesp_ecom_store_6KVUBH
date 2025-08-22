"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Settings,
  Package,
  Heart,
  Bell,
  Edit3,
  Save,
  X,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthDialog } from "@/components/auth-dialog"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
  }
}

interface Address {
  id: string
  type: "home" | "work" | "other"
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  // Mock profile data - in a real app, this would come from an API
  useEffect(() => {
    if (isAuthenticated() && user) {
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          joinDate: "2024-01-01",
          totalOrders: 5,
          totalSpent: 12499,
          preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true,
          },
        }

        const mockAddresses: Address[] = [
          {
            id: "1",
            type: "home",
            fullName: user.name,
            phone: user.phone || "+91 9876543210",
            address: "123 Main Street, Apartment 4B",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            isDefault: true,
          },
          {
            id: "2",
            type: "work",
            fullName: user.name,
            phone: user.phone || "+91 9876543210",
            address: "456 Business Park, Office 12",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400002",
            isDefault: false,
          },
        ]

        setProfile(mockProfile)
        setAddresses(mockAddresses)
        setEditedProfile(mockProfile)
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const handleSaveProfile = () => {
    if (profile && editedProfile) {
      setProfile({ ...profile, ...editedProfile })
      setIsEditing(false)
      // In a real app, you would make an API call here
      alert("Profile updated successfully!")
    }
  }

  const handleCancelEdit = () => {
    setEditedProfile(profile || {})
    setIsEditing(false)
  }

  const handlePreferenceChange = (key: keyof UserProfile["preferences"], value: boolean) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          [key]: value,
        },
      }
      setProfile(updatedProfile)
      // In a real app, you would make an API call here
    }
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }
    // In a real app, you would make an API call here
    alert("Password changed successfully!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setShowPasswordForm(false)
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="max-w-md mx-auto text-center py-20">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-500 mb-8">Please login to view your profile</p>
            <AuthDialog />
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-10">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm animate-pulse">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profile not found</h2>
            <p className="text-gray-500 mb-8">Unable to load your profile information</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold font-montserrat text-gray-900">My Profile</h1>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="rounded-xl border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200 bg-transparent"
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl sticky top-4">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <p className="text-gray-500 mb-6">{profile.email}</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-semibold">
                      {new Date(profile.joinDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-semibold">{profile.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold">₹{profile.totalSpent.toLocaleString()}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                      <Package className="h-4 w-4 mr-3" />
                      My Orders
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center">
                        <User className="h-6 w-6 mr-3 text-blue-500" />
                        Personal Information
                      </CardTitle>
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                          className="rounded-lg bg-transparent"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveProfile} size="sm" className="rounded-lg">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            className="rounded-lg bg-transparent"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            value={isEditing ? editedProfile.name || "" : profile.name}
                            onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, name: e.target.value })}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={isEditing ? editedProfile.email || "" : profile.email}
                            onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, email: e.target.value })}
                            className="pl-10"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={isEditing ? editedProfile.phone || "" : profile.phone || ""}
                          onChange={(e) => isEditing && setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl flex items-center">
                        <MapPin className="h-6 w-6 mr-3 text-green-500" />
                        Saved Addresses
                      </CardTitle>
                      <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h4 className="font-semibold text-gray-900 capitalize">{address.type} Address</h4>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-gray-600">
                              <p className="font-medium">{address.fullName}</p>
                              <p>{address.phone}</p>
                              <p>{address.address}</p>
                              <p>
                                {address.city}, {address.state} {address.pincode}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Lock className="h-6 w-6 mr-3 text-red-500" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-900">Password</h4>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                      <Button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg bg-transparent"
                      >
                        Change Password
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <div className="p-6 bg-gray-50 rounded-xl space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button onClick={handlePasswordChange} size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                          <Button
                            onClick={() => setShowPasswordForm(false)}
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                      <Settings className="h-6 w-6 mr-3 text-purple-500" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive order updates via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.emailNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                            <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.smsNotifications}
                          onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-orange-500" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Marketing Emails</h4>
                            <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                          </div>
                        </div>
                        <Switch
                          checked={profile.preferences.marketingEmails}
                          onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
