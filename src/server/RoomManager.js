export default class RoomManager {
  constructor(roomSigns, roomCodeLength) {
    this.rooms = {};
    this.roomSigns = roomSigns || ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    this.roomCodeLength = roomCodeLength || 6;
  }

  getRoom(roomCode) {
    if (this.rooms[roomCode] !== undefined) {
      return this.rooms[roomCode]
    }
    return null;
  }


  createRoom(data) {
    let roomCode = this.createRoomCode();

    if (this.rooms[roomCode] !== undefined && this.rooms[roomCode].inGame) {
      this.createRoom(data);
      return null;
    }

    this.rooms[roomCode] = data;
  };

  createRoomCode() {
    let roomCode = "";

    for (let i = 0; i < this.roomCodeLength; i++) {
      roomCode += this.roomSigns[Math.floor(Math.random() * this.roomSigns.length)];
    }

    return roomCode;
  }
}
