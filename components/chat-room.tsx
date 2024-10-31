"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

interface ChatRoomProps {
  roomId: string;
  username: string;
}

export default function ChatRoom({ roomId, username }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      query: { roomId, username },
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId, username]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const message = {
        id: Date.now().toString(),
        username,
        content: newMessage,
        timestamp: Date.now(),
      };
      socket.emit('message', message);
      setNewMessage('');
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 text-white hover:text-gray-300"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <Card className="bg-gray-900 border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">
              Chat Room: {roomId.charAt(0).toUpperCase() + roomId.slice(1)}
            </h2>
          </div>
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[calc(100vh-300px)] p-4"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.username === username
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {message.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      message.username === username ? 'items-end' : ''
                    }`}
                  >
                    <span className="text-sm text-gray-400">
                      {message.username}
                    </span>
                    <div
                      className={`mt-1 rounded-lg p-3 ${
                        message.username === username
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 border-gray-700 text-white"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}