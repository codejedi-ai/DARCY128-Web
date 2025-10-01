interface RoomSelectorProps {
    rooms: string[]
    currentRoom: string
    onRoomChange: (room: string) => void
  }
  
  export default function RoomSelector({ rooms, currentRoom, onRoomChange }: RoomSelectorProps) {
    return (
      <div className="flex space-x-2 mb-4">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => onRoomChange(room)}
            className={`px-4 py-2 rounded-full text-sm ${
              currentRoom === room
                ? 'bg-white text-gray-900'
                : 'bg-gray-700 bg-opacity-50 hover:bg-opacity-75'
            }`}
          >
            {room}
          </button>
        ))}
      </div>
    )
  }
  
  