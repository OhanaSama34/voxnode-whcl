import React, { useState } from 'react';
import MainLayout from '../../layouts/main-layout';
import { PostCard } from '@/components/post-card';
import { ChevronUp, ChevronDown, User, CornerDownRight } from 'lucide-react';
import { CreateOpinion } from '@/components/create-opinion';
import { Post, Comment } from '@/types';

export const Feed = () => {
  return (
    <>
      <CreateOpinion />
      <div className="pb-2 bt-2 divide-y divide-gray-200">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

const posts: Post[] = [
  {
    id: '1',
    userId: 'noufalraditya',
    username: 'NoufalRaditya',
    handle: '@NoufalRaditya',
    time: '9h',
    content:
      "Jimmy Butler worked out on the practice court pregame, per source. Medical team held him out to give body two more days to heal, but there's a belief he will be back for Game 4 on Monday night with the Warriors searching for 3-1 series lead over the Rockets.",
    upvotes: 236,
    commentsCount: 2100,
    comments: [
      {
        id: '1-1',
        userId: 'commenter1',
        username: 'Commenter One',
        handle: '@CommenterOne',
        time: '1h',
        content: 'Great news for the Warriors! Hope he recovers soon.',
        replies: [
          {
            id: '1-1-1',
            userId: 'replyer1',
            username: 'Reply User A',
            handle: '@ReplyUserA',
            time: '45m',
            content: "Agreed! He's a crucial player for them.",
            replies: [
              {
                id: '1-1-1-1',
                userId: 'replyer2',
                username: 'Reply User B',
                handle: '@ReplyUserB',
                time: '20m',
                content:
                  'Definitely, the series will be more exciting with him.',
              },
            ],
          },
          {
            id: '1-1-2',
            userId: 'replyer3',
            username: 'Reply User C',
            handle: '@ReplyUserC',
            time: '30m',
            content: "Let's hope for a quick return!",
          },
        ],
      },
      {
        id: '1-2',
        userId: 'commenter2',
        username: 'Commenter Two',
        handle: '@CommenterTwo',
        time: '30m',
        content: 'This will definitely shake things up for the next game.',
      },
    ],
  },
  {
    id: '2',
    userId: 'kinghamza',
    username: 'KingHamza',
    handle: '@Kinghamza',
    time: '10h',
    content:
      "Jimmy Butler worked out on the practice court pregame, per source. Medical team held him out to give body two more days to heal, but there's a belief he will be back for Game 4 on Monday night with the Warriors searching for 3-1 series lead over the Rockets.",
    upvotes: 236,
    commentsCount: 2100,
    comments: [
      {
        id: '2-1',
        userId: 'commenter3',
        username: 'Commenter Three',
        handle: '@CommenterThree',
        time: '2h',
        content: 'Fingers crossed for a speedy recovery!',
        replies: [
          {
            id: '2-1-1',
            userId: 'replyer4',
            username: 'Reply User D',
            handle: '@ReplyUserD',
            time: '1h',
            content: 'Me too! The Warriors need him.',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    userId: 'nurlman',
    username: 'Nurlman',
    handle: '@Nurlman',
    time: '7h',
    content:
      "Jimmy Butler worked out on the practice court pregame, per source. Medical team held him out to give body two more days to heal, but there's a belief he will be back for Game 4 on Monday night with the Warriors searching for 3-1 series lead over the Rockets.",
    upvotes: 236,
    commentsCount: 2100,
    comments: [], // No comments for this post
  },
  {
    id: '4',
    userId: 'farrelathp',
    username: 'Farrelathp',
    handle: '@Farrelathp',
    time: '2h',
    content:
      "Jimmy Butler worked out on the practice court pregame, per source. Medical team held him out to give body two more days to heal, but there's a belief he will be back for Game 4 on Monday night with the Warriors searching for 3-1 series lead over the Rockets.",
    upvotes: 236,
    commentsCount: 2100,
    comments: [
      {
        id: '4-1',
        userId: 'commenter4',
        username: 'Commenter Four',
        handle: '@CommenterFour',
        time: '5m',
        content: 'Excited to see him back on the court!',
      },
      {
        id: '4-2',
        userId: 'commenter5',
        username: 'Commenter Five',
        handle: '@CommenterFive',
        time: '10m',
        content: 'This is huge for the team.',
      },
      {
        id: '4-3',
        userId: 'commenter6',
        username: 'Commenter Six',
        handle: '@CommenterSix',
        time: '15m',
        content: 'Hope he performs well.',
      },
    ],
  },
];
