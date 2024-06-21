import { Chat } from "./Chat";
import { socketAddress } from "./socket";
import io from "socket.io-client";

export const Container = ({ channel }) => {
  const socket = io(socketAddress);

  return <Chat socket={socket} channel={channel} />;
};
