import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UserContext } from "~/contexts/UserProvider";
import { apiReq } from "~/utils";
import { User } from "~/types";

export default function AuthPage() {
    const { user, login } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    let router = useRouter();
    const [activeTab, setActiveTab] = useState("signin");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.signinEmail.value;
        const password = form.signinPassword.value;

        const response = await apiReq("signin", { email, password });

        if (!response.success) {
            console.error(response.message);
            alert(response.message);
            return;
        }

        console.log("here")
        console.log(response)

        login(response.user as User);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const email = form.signupEmail.value;
        const password = form.signupPassword.value;

        const response = await apiReq("signup", { username, email, password });

        if (!response.success) {
            console.error(response.message);
            alert(response.message);
            return;
        }

        login(response.user as User);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
                Welcome
            </CardTitle>
            <CardDescription className="text-center">
                Sign in to your account or create a new one
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="signinEmail">Email</Label>
                    <Input
                        id="signinEmail"
                        type="email"
                        placeholder="john@example.com"
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="signinPassword">Password</Label>
                    <Input id="signinPassword" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                    Sign In
                    </Button>
                </form>
                </TabsContent>
                <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                        id="signupEmail"
                        type="email"
                        placeholder="john@example.com"
                        required
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input id="signupPassword" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
                    Sign Up
                    </Button>
                </form>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
        </div>
    );
}