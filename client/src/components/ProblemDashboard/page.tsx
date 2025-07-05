'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Code2,
  Timer,
  MemoryStick
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  acceptedSubmissions: number;
  totalSubmissions: number;
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProblemsResponse {
  success: boolean;
  data: {
    problems: Problem[];
    pagination: PaginationData;
  };
}

const ProblemsDashboard = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Fetch problems from API
  const fetchProblems = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(difficultyFilter && { difficulty: difficultyFilter }),
        ...(tagsFilter && { tags: tagsFilter }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/problems?${params}`);
      const data: ProblemsResponse = await response.json();

      if (data.success) {
        setProblems(data.data.problems);
        setPagination(data.data.pagination);
      } else {
        console.error('Failed to fetch problems');
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch problems on component mount and when filters change
  useEffect(() => {
    fetchProblems(1);
  }, [searchTerm, difficultyFilter, tagsFilter, sortBy, sortOrder]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchProblems(page);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Calculate acceptance rate
  const getAcceptanceRate = (accepted: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((accepted / total) * 100)}%`;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              All Problems
            </CardTitle>
            <CardDescription>
              Browse and solve coding problems to improve your skills
            </CardDescription>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="acceptedSubmissions">Acceptance</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
          >
            {sortOrder === 'ASC' ? '↑' : '↓'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Problems List */}
            <div className="space-y-4">
              {problems.map((problem) => (
                <Link key={problem.id} href={`/problems/${problem.id}`}>
                  <div className="group p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-all duration-200 cursor-pointer hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Problem Header */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            #{problem.id}
                          </span>
                          <h3 className="font-medium text-lg group-hover:text-primary transition-colors truncate">
                            {problem.title}
                          </h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {problem.tags.slice(0, 6).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs hover:bg-primary/10 transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {problem.tags.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{problem.tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                        
                        {/* Problem Stats */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            <span>{problem.timeLimit}ms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" />
                            <span>{problem.memoryLimit}MB</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-600 font-medium">
                              {getAcceptanceRate(problem.acceptedSubmissions, problem.totalSubmissions)}
                            </span>
                            <span>acceptance rate</span>
                          </div>
                          <div>
                            <span className="font-medium">
                              {problem.acceptedSubmissions.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              /{problem.totalSubmissions.toLocaleString()} solved
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Solve
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} problems
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={pagination.currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemsDashboard;