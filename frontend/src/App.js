import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const socket = io.connect("ws://localhost:8080");

  const [receive, setReceive] = useState("");
  const [send, setSend] = useState("");

  useEffect(() => {
    const connect = () => {
      console.log("Connected!");
    };

    const disconnect = () => {
      console.log("Disconnected!");
    };

    const download = (data) => {
      console.log("Downloaded:", data);
      setReceive(data);
    };

    socket.on("connect", connect);
    socket.on("disconnect", disconnect);
    socket.on("download_msg", download);

    return () => {
      socket.off("connect", connect);
      socket.off("disconnect", disconnect);
      socket.off("download_msg", download);
      socket.disconnect();
    };
  }, [socket]);

  const onSend = () => {
    socket.emit("upload_msg", send);
  };

  return (
    <>
      <h1>Hello, World!</h1>
      <p>{receive}</p>
      <input value={send} onChange={(e) => setSend(e.target.value)} />
      <button onClick={onSend}>Send</button>
    </>
  );
}

export default App;
