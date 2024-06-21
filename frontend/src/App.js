import { Chat } from "./Chat";
import { Name } from "./Name";
import { socketAddress } from "./socket";
import io from "socket.io-client";

function App() {
  const socket = io(socketAddress, {
    withCredentials: true,
  });

  return (
    <>
      <Name socket={socket} />
      <Chat socket={socket} channel={1} />
      <Chat socket={socket} channel={2} />
      <Chat socket={socket} channel={3} />
      <Chat socket={socket} channel={4} />
    </>
  );
}

export default App;
