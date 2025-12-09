'use client';

import React from 'react';
import { IComment, IUser } from '@/app/types';

interface CommentListProps {
    comments: IComment[];
    currentUserId?: string;
}

export default function CommentList({ comments, currentUserId }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No hay comentarios aún.</p>
                <p className="text-sm">Sé el primero en comentar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => {
                const author = comment.author as IUser;
                const isOwn = author._id === currentUserId;
                const isAgent = author.role === 'agent';

                const formattedDate = new Date(comment.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return (
                    <div
                        key={comment._id}
                        className={`p-4 rounded-lg ${isAgent
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'bg-gray-50 border-l-4 border-gray-300'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isAgent ? 'bg-blue-500' : 'bg-gray-500'
                                    }`}>
                                    {author.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {author.name}
                                        {isAgent && (
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                Agente
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">{formattedDate}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                    </div>
                );
            })}
        </div>
    );
}