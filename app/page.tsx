import RoomList from '@/components/room-list';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to ChatRooms</h1>
          <p className="text-gray-400">Join a room to start chatting with others</p>
        </div>
        <RoomList />
      </div>
    </div>
  );
}