"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { useAuth } from "@/context/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();

  // The layout handles loading and redirects, so we can assume user exists.
  if (!user) {
    return null;
  }

  return (
    <main className="grid flex-1 items-start gap-4">
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
        <div className="grid gap-4">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Update your personal information here.
                  </CardDescription>
                </CardHeader>
                <ProfileForm />
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password here. After saving, you will be logged out.
                  </CardDescription>
                </CardHeader>
                <PasswordForm />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}