import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const lobbys: Record<string, ILobby> = {};

interface ILobby {
  lobbyId: string;
  players: IPlayer[];
}

interface IPlayer {
  playerId: string;
  playerName: string;
}

interface IGameState {
  // Game State will be created when GameMaster starts game in lobby
  lobbyId: string;
  players: IPlayer[]; // Player and Points share same index?
  round: number;
  turn: number;
  points: number[];

  //Map
}

export const lobbyHandler = (socket: Socket) => {
  const createLobby = (playerName: string) => {
    console.log("Server Creating Lobby for:", playerName);
    const lobbyId = uuidV4();
    lobbys[lobbyId] = {
      lobbyId,
      players: [],
    };
    socket.emit("lobby-created", lobbyId, playerName);
  };

  const joinLobby = (lobbyId: string, playerId: string, playerName: string) => {
    var lobby = lobbys[lobbyId];
    if (lobby) {
      // Add Player to Lobby
      lobby.players.push({ playerId, playerName });
      lobbys[lobbyId] = lobby;
      socket.join(lobbyId);

      socket.emit("entered-lobby", lobbys[lobbyId].players);
      updateLobbyPlayers(lobbyId);
    }

    socket.on("disconnect", () => {
      leaveLobby({ playerId, playerName }, lobbyId);
    });
  };

  const leaveLobby = (player: IPlayer, lobbyId: string) => {
    var lobby = lobbys[lobbyId];
    if (!lobby) return;
    var playerLenght = lobby.players.length;

    // remove lobby from active lobbys - free up space
    if (playerLenght <= 0) {
      delete lobbys[lobbyId];
      return;
    }

    lobby.players = lobby.players.filter(
      (id) => id.playerId !== player.playerId
    );
    lobbys[lobbyId] = lobby;

    updateLobbyPlayers(lobbyId);
  };

  const updateLobbyPlayers = (lobbyId: string) => {
    console.log(lobbys[lobbyId].players);
    socket.to(lobbyId).emit("update-lobby-users", lobbys[lobbyId].players);
  };

  socket.on("create-lobby", createLobby);
  socket.on("join-lobby", joinLobby);
};
