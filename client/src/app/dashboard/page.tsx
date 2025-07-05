'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Code, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  LogOut,
  Settings,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useQuestionsStore } from '@/store/questionStore';
import ProblemsDashboard from '@/components/ProblemDashboard/page';

interface User {
  id: string;
  email: string;
  name: string;
  exp?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { 
    user: storeUser, 
    isAuthenticated, 
    logout, 
    updateUser,  // This is the function that exists in your store
    setLoading,
    clearError 
  } = useAuthStore();
  const { questions, fetchQuestions, isLoading } = useQuestionsStore();
  
  // Local state for handling token-based authentication
  const [user, setLocalUser] = useState<User | null>(storeUser);
  const [loading, setComponentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const decodeJWTToken = (token) => {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid JWT structure - expected 3 parts');
        }

        const payload = parts[1];
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedPayload = JSON.parse(atob(paddedPayload));
        
        console.log('=== JWT PAYLOAD DEBUG ===');
        console.log('Raw payload:', decodedPayload);
        console.log('Available fields:', Object.keys(decodedPayload));
        console.log('=== END DEBUG ===');
        
        // Map common JWT fields to your User interface
        const userId = decodedPayload.id || 
                       decodedPayload.sub || 
                       decodedPayload.user_id || 
                       decodedPayload.userId ||
                       decodedPayload.uid;
        
        const userEmail = decodedPayload.email || 
                          decodedPayload.email_address || 
                          decodedPayload.mail;
        if (!userEmail) {
          throw new Error("Decoded token missing required field: email");
        }
        
        const userName = decodedPayload.name || 
                         decodedPayload.display_name ||
                         decodedPayload.displayName ||
                         decodedPayload.full_name ||
                         (decodedPayload.given_name && decodedPayload.family_name 
                           ? `${decodedPayload.given_name} ${decodedPayload.family_name}` 
                           : null) ||
                         (decodedPayload.first_name && decodedPayload.last_name 
                           ? `${decodedPayload.first_name} ${decodedPayload.last_name}` 
                           : null) ||
                         userEmail?.split('@')[0] || 
                         'User';
        
        // Create user object matching your User interface
        const normalizedUser = {
          id: userId || userEmail || 'unknown',
          email: userEmail || '',
          name: userName,
          exp: decodedPayload.exp,
          // Add any other fields your User interface expects
          createdAt: decodedPayload.iat ? new Date(decodedPayload.iat * 1000).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('Normalized user:', normalizedUser);
        return normalizedUser;
        
      } catch (error) {
        console.error('JWT decode error:', error);
        throw new Error(`Token decode failed: ${error.message}`);
      }
    };

    const handleTokenFromURL = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        try {
          console.log('Processing URL token...');
          
          const userPayload = decodeJWTToken(token);
          
          // Store token
          localStorage.setItem('authToken', token);
          
          // Set local user
          setLocalUser(userPayload);
          
          // Update the auth store - this will set user and isAuthenticated
          // We need to manually set the state since updateUser only updates existing user
          useAuthStore.setState({
            user: userPayload,
            isAuthenticated: true,
            error: null,
            isLoading: false
          });
          
          console.log('User successfully authenticated via URL token');
          
          // Clean the URL
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
        } catch (error) {
          console.error('Token processing failed:', error);
          setError(`Authentication failed: ${error.message}`);
          localStorage.removeItem('authToken');
          setTimeout(() => router.push('auth/login'), 3000);
        }
      } else {
        checkStoredToken();
      }
    };

    const checkStoredToken = () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        try {
          console.log('Validating stored token...');
          
          const userPayload = decodeJWTToken(storedToken);
          
          // Check expiration
          if (userPayload.exp && userPayload.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          
          // Set local user
          setLocalUser(userPayload);
          
          // Update auth store
          useAuthStore.setState({
            user: userPayload,
            isAuthenticated: true,
            error: null,
            isLoading: false
          });
          
          console.log('Stored token validated successfully');
          
        } catch (error:unknown) {
          console.error('Stored token validation failed:', error);
          localStorage.removeItem('authToken');

          if ((error as Error).message.includes('expired')) {
            setError('Your session has expired. Please login again.');
          } else {
            setError('Invalid authentication data. Please login again.');
          }

          setTimeout(() => router.push('auth/login'), 2000);
        }
      } else {
        // Check store authentication (for other auth methods)
        if (isAuthenticated && storeUser) {
          setLocalUser(storeUser);
          console.log('Using existing store authentication');
        } else {
          console.log('No authentication found, redirecting to login');
          router.push('auth/login');
        }
      }
    };

    // Execute authentication check
    handleTokenFromURL();
    setComponentLoading(false);
  }, []);

  // Fetch questions when user is authenticated
  useEffect(() => {
    if (user) {
      fetchQuestions();
    }
  }, [user, fetchQuestions]);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('authToken');
    // Clear store (this will set user to null and isAuthenticated to false)`
    logout();
    // Clear local state
    setLocalUser(null);
    // Redirect
    router.push('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User not found state
  if (!user || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // ... rest of your component remains the same
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">CodeJudge</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-sm font-medium text-foreground">
                Dashboard
              </Link>
              <Link href="/problems" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Problems
              </Link>
              <Link href="/contests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contests
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">({user.email})</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to solve some coding challenges today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/problems">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Browse Problems</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{questions.length}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  Available problems
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Challenge</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">
                Complete your daily challenge
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Contest</CardTitle>
              <Trophy className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 days</div>
              <p className="text-xs text-muted-foreground">
                Weekly coding contest
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contest Rank</CardTitle>
              <Trophy className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#1,247</div>
              <p className="text-xs text-muted-foreground">Global ranking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Problems */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Problems</CardTitle>
                <CardDescription>
                  Continue where you left off or try something new
                </CardDescription>
              </div>
              <Link href="/problems">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <ProblemsDashboard/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}