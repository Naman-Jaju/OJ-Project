import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  Target, 
  BookOpen,
  ChevronRight,
  Play,
  Award,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">CodeJudge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link href="auth/signup">
                <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 code-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              New: Advanced Algorithm Challenges
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Master Your
              <span className="block gradient-text">Coding Skills</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Join thousands of developers improving their programming skills with our 
              comprehensive online judge platform. Practice, compete, and excel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 glow-effect text-lg px-8 py-6">
                  <Play className="h-5 w-5 mr-2" />
                  Start Coding Now
                </Button>
              </Link>
              <Link href="auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  Log In
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose CodeJudge?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to become a better programmer in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">1000+ Problems</CardTitle>
                <CardDescription>
                  From beginner to expert level with detailed solutions and explanations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl">Live Contests</CardTitle>
                <CardDescription>
                  Participate in weekly contests and climb the global leaderboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
                <CardDescription>
                  Connect with fellow programmers and learn from each other
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-info" />
                </div>
                <CardTitle className="text-xl">Learn & Practice</CardTitle>
                <CardDescription>
                  Comprehensive tutorials and practice problems for all skill levels
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Achievements</CardTitle>
                <CardDescription>
                  Earn badges and certificates as you progress through challenges
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Detailed analytics and insights to track your improvement
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="gradient-bg border-primary/20">
            <CardContent className="p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Level Up Your Coding?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our community of developers and start your journey to becoming a better programmer today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="auth/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="auth/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                    Log In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">CodeJudge</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 CodeJudge. All rights reserved. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}