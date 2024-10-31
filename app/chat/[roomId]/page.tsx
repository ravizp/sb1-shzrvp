"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatRoom from '@/components/chat-room';

export default function ChatPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const newUsername = prompt('Enter your username:') || `User${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('username', newUsername);
      setUsername(newUsername);
    }
  }, []);

  if (!username) return null;

  return <ChatRoom roomId={roomId} username={username} />;
}