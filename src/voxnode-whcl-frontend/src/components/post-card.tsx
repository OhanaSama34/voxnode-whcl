import React, { useState } from 'react';
import { CommentSection } from '@/components/comment';
import { Post } from '@/types';
import {
  ChevronUp,
  ChevronDown,
  User,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const commentSectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
    },
    exit: {
      opacity: 0,
      height: 0,
    },
  };

  return (
    <div className="bg-white p-6 w-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            <User size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-1 text-base">
              <span className="font-bold text-gray-900">lk..1g</span>
              {/*<span className="text-gray-500">{post.handle}</span>*/}
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
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronUp size={20} />
          </button>
          <span className="text-sm font-medium">{post.upvotes}</span>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronDown size={20} />
          </button>
        </div>
        <button
          onClick={toggleComments}
          className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">
            {post.commentsCount}
          </span>
        </button>
      </div>
      <AnimatePresence>
        {showComments && (
          <motion.div
            key="comment-section" // Key is important for AnimatePresence to track
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={commentSectionVariants}
            className="overflow-hidden" // Hide overflow during height animation
          >
            <CommentSection comments={post.comments} />
          </motion.div>
        )}
      </AnimatePresence>
      {showComments && <CommentSection comments={post.comments} />}
    </div>
  );
};
