import React, { useEffect, useState } from "react";

// Define the type for messages
interface Message {
  id: number; // Unique ID for the message
  content: string; // Message content
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket instance
  const [messages, setMessages] = useState<Message[]>([]); // Messages from the server
  const [input, setInput] = useState<string>(""); // Input for sending data

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:3000"); // Connect to the backend
    setSocket(ws);

    // Event: Connection established
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send("Hello from React frontend!"); // Test message
    };

    // Event: Message received from server
    ws.onmessage = (event: MessageEvent) => {
      console.log("Message from server:", event.data);

      // Add received message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, content: event.data },
      ]);
    };

    // Event: WebSocket error
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Event: Connection closed
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  // Function to send a message to the backend
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(input); // Send the input value
      console.log("Sent:", input);
      setInput(""); // Clear input field
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebSocket React Client</h1>

      {/* Input for sending messages */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>

      {/* Display messages received from the server */}
      <h2>Messages from Server:</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
