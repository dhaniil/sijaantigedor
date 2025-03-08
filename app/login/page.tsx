"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GitHubButton from "@/components/auth/github-button";
import GoogleButton from "@/components/auth/google-button";
import DiscordButton from "@/components/auth/discord-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  // State for login tab
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // State for signup tab
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
    } else {
      router.push("/protected");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    setSignupMessage(null);

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setSignupError(error.message);
    } else {
      setSignupMessage("Check your email for the confirmation link.");
    }
    setSignupLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Login with your email and password or continue with a provider.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loginError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">{loginError}</p>
                  </div>
                )}
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md bg-white dark:bg-black"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label htmlFor="password" className="block text-sm font-medium">
                        Password
                      </label>
                      <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md bg-white dark:bg-black"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full" 
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <GitHubButton />
                  <GoogleButton />
                  <DiscordButton />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your email and create a password to register.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signupError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">{signupError}</p>
                  </div>
                )}
                
                {signupMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="text-sm">{signupMessage}</p>
                  </div>
                )}
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="signup-email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md bg-white dark:bg-black"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="signup-password" className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md bg-white dark:bg-black"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full" 
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <GitHubButton />
                  <GoogleButton />
                  <DiscordButton />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
