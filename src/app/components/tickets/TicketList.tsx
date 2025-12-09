'use client';

import React from 'react';
import { ITicket } from '@/app/types';
import TicketCard from './TicketCard';

interface TicketListProps {
  tickets: ITicket[];
  basePath: string;
  loading?: boolean;
  emptyMessage?: string;
}

export default function TicketList({
  tickets,
  basePath,
  loading = false,
  emptyMessage = 'No hay tickets para mostrar',
}: TicketListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎫</div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          basePath={basePath}
        />
      ))}
    </div>
  );
}