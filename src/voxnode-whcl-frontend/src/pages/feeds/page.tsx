import React, 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Actor, HttpAgent, ActorSubclass, Identity } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { ChevronUp, ChevronDown, User, MessageCircle, MoreHorizontal, CornerDownRight, LogOut, LogIn } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// =================================================================
// == 0. TYPES & MOCK DATA
// =================================================================

// Assuming these types are defined in a separate file, e.g., '@/types'
interface Comment {
    id: string;
    userId: string;
    username: string;
    handle: string;
    time: string;
    content: string;
    replies?: Comment[];
}

interface Post {
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

// Import the generated types and Candid interface from your canister
import {
    idlFactory,
    canisterId,
    _SERVICE
} from '../../../../declarations/voxnode-whcl-backend/voxnode-whcl-backend.did.js';


// =================================================================
// == 1. UI COMPONENTS
// =================================================================

const CreateOpinion: React.FC<{ actor?: ActorSubclass<_SERVICE>, onPost: () => void, isAuthenticated: boolean }> = ({ actor, onPost, isAuthenticated }) => {
    const [content, setContent] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handlePost = async () => {
        if (!content.trim() || !actor || !isAuthenticated) return;
        setIsSubmitting(true);
        try {
            // This is an update call and requires an authenticated actor
            await actor.askQuestion(content);
            setContent('');
            onPost(); // Refresh feed after posting
        } catch (error) {
            console.error("Failed to post opinion:", error);
            // Use a more user-friendly notification system in a real app
            alert("Error: Could not post opinion. Make sure you are logged in.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-4 mb-4 rounded-lg border border-gray-200">
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={isAuthenticated ? "What's on your mind?" : "Please log in to post an opinion."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting || !isAuthenticated}
            />
            <button
                onClick={handlePost}
                disabled={isSubmitting || !content.trim() || !isAuthenticated}
                className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
                {isSubmitting ? "Posting..." : "Post Opinion"}
            </button>
        </div>
    );
};

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    return (
        <div className="relative mb-4 group">
            <div className="absolute inset-y-0 left-0 w-3 rounded-bl transition-all border-l-4 border-b-2 border-gray-200 group-hover:border-blue-300 transition-colors"></div>
            <div className="flex items-start space-x-3 p-3 pl-6 hover:bg-gray-50 rounded-r-lg">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        <User size={18} />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-1 text-sm">
                        <span className="font-semibold text-gray-800">{comment.username}</span>
                        <span className="text-gray-500">{comment.handle}</span>
                        <span className="text-gray-500">• {comment.time}</span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-gray-500 text-xs">
                        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                            <ChevronUp size={14} /> <span>Vote</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                            <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                            <CornerDownRight size={14} /> <span>Reply</span>
                        </button>
                    </div>
                </div>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 pl-8">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection: React.FC<{ comments: Comment[] }> = ({ comments }) => {
    return (
        <div className="mt-4 border-t border-gray-200 pt-4 px-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Comments</h3>
            {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
            ) : (
                comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            )}
        </div>
    );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [showComments, setShowComments] = React.useState(false);
    const toggleComments = () => setShowComments(!showComments);

    const commentSectionVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' } },
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        <User size={20} />
                    </div>
                    <div>
                        <div className="flex items-center space-x-1 text-base">
                            <span className="font-bold text-gray-900">{post.username}</span>
                            <span className="text-gray-500" title={post.userId}>{post.handle}</span>
                            <span className="text-gray-500">• {post.time}</span>
                        </div>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-1">
                    <button className="p-1 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors"><ChevronUp size={20} /></button>
                    <span className="text-sm font-medium">{post.upvotes}</span>
                    <button className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"><ChevronDown size={20} /></button>
                </div>
                <button onClick={toggleComments} className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">{post.commentsCount}</span>
                </button>
            </div>
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        key="comment-section"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={commentSectionVariants}
                        className="overflow-hidden"
                    >
                        <CommentSection comments={post.comments} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DevTools: React.FC<{ actor?: ActorSubclass<_SERVICE>, onSeed: () => void, isAuthenticated: boolean }> = ({ actor, onSeed, isAuthenticated }) => {
    const [message, setMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSeedClick = async () => {
        if (!actor || !isAuthenticated) {
            setMessage("Error: Actor not available. Please log in.");
            return;
        }
        setIsLoading(true);
        setMessage("Seeding in progress...");
        try {
            // Assuming 'seed' is a method in your canister for testing
            // This is just a placeholder, your canister does not have this method.
            // const response = await actor.seed();
            setMessage("Seed function is not implemented in the canister.");
            onSeed();
        } catch (error) {
            console.error("Failed to seed database:", error);
            setMessage(`An unexpected error occurred: ${String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 p-4 my-4 rounded-lg">
            <h2 className="text-lg font-bold text-yellow-800">Developer Tools</h2>
            <p className="text-yellow-700 text-sm mt-1">Reset and populate the canister with test data.</p>
            <button
                onClick={handleSeedClick}
                disabled={isLoading || !isAuthenticated}
                className="mt-3 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 transition-colors"
            >
                {isLoading ? "Seeding..." : "Seed Database"}
            </button>
            {message && <p className="mt-2 text-sm text-yellow-900 bg-yellow-200 p-2 rounded-md">{message}</p>}
        </div>
    );
};


// =================================================================
// == 2. PAGE COMPONENTS
// =================================================================

interface FeedPageProps {
    actor: ActorSubclass<_SERVICE>;
    isAuthenticated: boolean;
}

export const FeedPage: React.FC<FeedPageProps> = ({ actor, isAuthenticated }) => {
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const parseCanisterData = (data: string[]): Post[] => {
        return data.map((entry, index) => {
            const parts = entry.split('/');
            const [questionContent, questionerId, answerContent, responderId] = parts;
            const comments: Comment[] = [];
            if (answerContent && responderId) {
                comments.push({
                    id: `${index}-comment-1`,
                    userId: responderId,
                    username: `User...${responderId.slice(-4)}`,
                    handle: `@${responderId.slice(0, 8)}`,
                    time: '5m',
                    content: answerContent,
                });
            }
            return {
                id: `post-${index}`,
                userId: questionerId,
                username: `User...${questionerId.slice(-4)}`,
                handle: `@${questionerId.slice(0, 8)}`,
                time: '2h',
                content: questionContent,
                upvotes: Math.floor(Math.random() * 100), // Note: upvotes are random for now
                commentsCount: comments.length,
                comments: comments,
            };
        }).reverse(); // Show newest posts first
    };

    const fetchPosts = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // This is a query call, it can be called by an anonymous actor
            const rawQuestions = await actor.getAllQuestions();
            const formattedPosts = parseCanisterData(rawQuestions);
            setPosts(formattedPosts);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Could not load posts from the canister.");
        } finally {
            setIsLoading(false);
        }
    }, [actor]);

    React.useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className="max-w-2xl mx-auto p-4">
            {process.env.NODE_ENV === 'development' && <DevTools actor={actor} onSeed={fetchPosts} isAuthenticated={isAuthenticated} />}
            <CreateOpinion actor={actor} onPost={fetchPosts} isAuthenticated={isAuthenticated} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Feed</h2>
                <button onClick={fetchPosts} disabled={isLoading} className="text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:text-gray-400">Refresh</button>
            </div>
            {isLoading && <p className="text-center text-gray-500">Loading posts...</p>}
            {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
            {!isLoading && !error && (
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map((post) => <PostCard key={post.id} post={post} />)
                    ) : (
                        <p className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">No posts found. Be the first to post or try seeding the database!</p>
                    )}
                </div>
            )}
        </div>
    );
};
