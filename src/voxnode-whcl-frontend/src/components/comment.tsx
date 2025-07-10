import React from 'react';
import { ChevronUp, ChevronDown, User, CornerDownRight } from 'lucide-react';
import { Comment } from '@/types';

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  // Calculate left padding for indentation based on nesting level

  return (
    <div
      // style={{ paddingLeft: `${paddingLeft}px` }}
      className="relative mb-4  group"
    >
      <div className="absolute  inset-y-0 left-0 w-3 rounded-bl transition-all border-l-4 border-b-2 border-black/10  group-hover:border-black/100 transition-colors"></div>
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            <User size={18} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-1 text-sm">
            <span className="font-semibold text-gray-800">
              {comment.username}
            </span>
            <span className="text-gray-500">{comment.handle}</span>
            <span className="text-gray-500">• {comment.time}</span>
          </div>
          <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
          <div className="flex items-center space-x-4 mt-2 text-gray-500 text-xs">
            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
              <ChevronUp size={14} />
              <span>Vote</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
              <ChevronDown size={14} />
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
              <CornerDownRight size={14} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
      {/* Recursively render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

// CommentSection Component
export const CommentSection: React.FC<{ comments: Comment[] }> = ({
  comments,
}) => {
  return (
    <div className="mt-4 border-t border-gray-200 pt-4 px-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 ">Comments</h3>
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} /> // Start top-level comments at level 0
        ))
      )}
    </div>
  );
};
