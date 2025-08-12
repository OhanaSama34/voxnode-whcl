import React, { useState, useEffect, useCallback } from 'react';
import { PostCard } from '@/components/post-card';
import { ChevronUp, ChevronDown, User, CornerDownRight } from 'lucide-react';
import { CreateOpinion } from '@/components/create-opinion';
import { Post, Comment } from '@/types';
import {posts as mockPosts} from '@/datas/d_post';

export const FeedPage = ({ actor, isAuthenticated }: { actor: any; isAuthenticated?: boolean }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log('actor:', actor);

  const fetchPosts = useCallback(async () => {
    if (!actor) {
      setIsLoading(false);
      return;
    }
    setError(null);
    try {
      const rawPosts: string[] = await actor.getAllQuestions();
      const formattedPosts = parseCanisterData(rawPosts);
      setPosts(formattedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load opinions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [actor, fetchPosts]);

  return (
    <>
      <CreateOpinion actor={actor} onPostCreated={fetchPosts} />
      {/*{actor}*/}
      <div className="pb-2 bt-2 divide-y divide-gray-200">
        {isLoading && <p className="text-center p-4">Loading opinions...</p>}
        {error && <p className="text-center p-4 text-red-500">{error}</p>}
        {!isLoading && !error && posts.length === 0 && (
          <p className="text-center p-4 text-gray-500">No opinions have been shared yet. Be the first!</p>
        )}
        {!isLoading && !error && posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

const parseCanisterData = (data: string[]): Post[] => {
  if (!data) return [];
  return data.map((entry, index) => {
    const parts = entry.split('/');
    if (parts.length < 2) return null;
    const post: Post = {
      id: index.toString(),
      content: parts[0],
      userId: parts[1],
      username: `User-${parts[1].substring(0, 5)}`,
      handle: `@${parts[1].substring(0, 5)}...`,
      time: 'Just now',
      upvotes: 0,
      commentsCount: 0,
      comments: [],
    };
    if (parts.length === 4) {
      const comment: Comment = {
        id: `${index}-1`,
        content: parts[2],
        userId: parts[3],
        username: `User-${parts[3].substring(0, 5)}`,
        handle: `@${parts[3].substring(0, 5)}...`,
        time: 'Just now',
        replies: [],
      };
      post.comments.push(comment);
      post.commentsCount = 1;
    }
    return post;
  }).filter((post): post is Post => post !== null).reverse();
};
