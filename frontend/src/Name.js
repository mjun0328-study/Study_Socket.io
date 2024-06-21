import { useCallback, useState } from "react";

export const Name = ({ socket }) => {
  const [name, setName] = useState("Unknown");

  const onClick = useCallback(() => {
    socket.emit("setName", { name });
  }, [socket, name]);

  return (
    <div>
      <strong>Name</strong>
      <br />
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={onClick}>Submit</button>
      <br />
      <br />
      <br />
    </div>
  );
};
