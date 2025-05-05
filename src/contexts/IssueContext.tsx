import React, { createContext, useState, useContext, useEffect } from 'react';

export type IssueStatus = 'pending' | 'in-progress' | 'resolved' | 'closed';
export type IssueCategory = 'electrical' | 'plumbing' | 'structural' | 'cleaning' | 'other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: 'low' | 'medium' | 'high';
  reportedBy: {
    id: string;
    name: string;
    role: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  comments: {
    id: string;
    text: string;
    author: string;
    createdAt: string;
  }[];
}

interface IssueContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  addComment: (issueId: string, text: string, author: string) => void;
  getIssueById: (id: string) => Issue | undefined;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    // Clear all existing issues on first load
    localStorage.removeItem('issues');
    setIssues([]);
  }, []);

  useEffect(() => {
    // Save issues to localStorage whenever they change
    localStorage.setItem('issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      ...issue,
      id: `issue-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setIssues([...issues, newIssue]);
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues(
      issues.map((issue) =>
        issue.id === id
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue
      )
    );
  };

  const deleteIssue = (id: string) => {
    setIssues(issues.filter((issue) => issue.id !== id));
  };

  const addComment = (issueId: string, text: string, author: string) => {
    setIssues(
      issues.map((issue) => {
        if (issue.id === issueId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            text,
            author,
            createdAt: new Date().toISOString(),
          };
          return {
            ...issue,
            comments: [...issue.comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      })
    );
  };

  const getIssueById = (id: string) => {
    return issues.find((issue) => issue.id === id);
  };

  const value = {
    issues,
    addIssue,
    updateIssue,
    deleteIssue,
    addComment,
    getIssueById,
  };

  return <IssueContext.Provider value={value}>{children}</IssueContext.Provider>;
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
