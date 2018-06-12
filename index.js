class Room {
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.text = '';
    this.users = [];
  }

  getText() {
    return this.text;
  }

  join(user) {
    this.users.push(user);
    return this;
  }

  leave(user) {
    this.users = this.users.filter(el => el !== user);
    return this;
  }

  editText(user, text) {
    this.text = text;
    return this.text;
  }

  hasUser(userId) {
    return this.users.find(el => el === userId);
  }
}

class TeamText {
  constructor() {
    this.rooms = {};
    this.userNames = {};
  }

  getTextFromRoomCode(roomCode) {
    return this.getRoom(roomCode) && this.getRoom(roomCode).getText();    
  }

  getRoom(roomCode) {
    return this.rooms[roomCode];
  }

  createRoom(roomCode) {
    this.rooms[roomCode] = this.rooms[roomCode] || new Room(roomCode);
  }

  deleteRoom(roomCode) {
    delete this.rooms[roomCode];
  }

  getRoomCodes() {
    return Object.keys(this.rooms).map(el => this.rooms[el].roomCode);
  }

  joinRoom(user, roomCode) {
    this.userNames[user] = this.userNames[user] || 'Anonymous';
    this.rooms[roomCode] = this.rooms[roomCode] ? this.rooms[roomCode].join(user) : new Room(roomCode).join(user);
    return this.rooms[roomCode];
  }

  leaveRoom(user, roomCode) {
    return this.rooms[roomCode] && this.rooms[roomCode].leave(user);
  }

  inputText(user, text, roomCode) {
    return this.rooms[roomCode] && this.rooms[roomCode].editText(user, text);
  }

  disconnectUser(userId) {
    for (let room in this.rooms) {
      if (this.rooms.hasOwnProperty(room)) {
        let currentRoom = this.rooms[room];
        if (currentRoom.hasUser(userId)) {
          currentRoom.leave(userId);
          return {
            roomCode: currentRoom.roomCode,
            users: currentRoom.users
          };
        }
      }
    }
    return {};
  }

  setName(user, name) {
    this.userNames[user] = name;
    for (let room in this.rooms) {
      if (this.rooms.hasOwnProperty(room)) {        
        if (this.rooms[room].users.find(el => el === user)) {
          return this.rooms[room];
        }
      }
    }
    return {};
  }

  castUserNames(room) {
    if (!room || !room.users) return {};
    return {
      roomCode: room.roomCode,
      text: room.text,
      users: room.users.map(el => this.userNames[el])
    };
  }
}

module.exports = { TeamText };