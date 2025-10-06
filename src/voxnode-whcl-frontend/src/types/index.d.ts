export interface Comment {
  id: string;
  userId: string;
  username: string;
  handle: string;
  time: string;
  content: string;
  replies?: Comment[]; // Added replies for nesting
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  handle: string;
  time: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  comments: Comment[];
}
