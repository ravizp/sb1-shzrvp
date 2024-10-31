"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';

const ROOMS = [
  { id: 'general', name: 'General Chat', description: 'Open discussions about anything', users: 42 },
  { id: 'tech', name: 'Tech Talk', description: 'Discuss the latest in technology', users: 28 },
  { id: 'gaming', name: 'Gaming Zone', description: 'Gaming discussions and team-ups', users: 35 },
  { id: 'music', name: 'Music Lounge', description: 'Share and discuss music', users: 21 },
];

export default function RoomList() {
  const router = useRouter();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleJoinRoom = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ROOMS.map((room) => (
        <Card
          key={room.id}
          className={`relative overflow-hidden transition-all duration-300 ${
            hoveredRoom === room.id
              ? 'transform scale-105 shadow-xl bg-gray-800'
              : 'bg-gray-900'
          }`}
          onMouseEnter={() => setHoveredRoom(room.id)}
          onMouseLeave={() => setHoveredRoom(null)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{room.name}</h3>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users size={16} />
                <span>{room.users}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6">{room.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <MessageSquare size={16} className="mr-2" />
                <span>Active chat room</span>
              </div>
              <Button
                onClick={() => handleJoinRoom(room.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Join Room
              </Button>
            </div>
          </div>
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-opacity duration-300 ${
              hoveredRoom === room.id ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </Card>
      ))}
    </div>
  );
}