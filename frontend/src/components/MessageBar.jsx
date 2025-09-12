// frontend/src/components/MessageBar.jsx
import { useMessage } from "../contexts/MessageContext";
import "./MessageBar.css"; // we’ll add styles here

const MessageBar = () => {
  const { message, visible, clearMessage } = useMessage();

  if (!visible || !message) return null;

  return (
    <div className={`message-bar ${message.type}`} onClick={clearMessage}>
      {message.text}
    </div>
  );
};

export default MessageBar;
