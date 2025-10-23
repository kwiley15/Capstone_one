import { useState } from "react";

function sendEmailBtn() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`Emails sent to: ${data.emailsSent.join(", ")}`);
      } else {
        setMessage("No users found.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error sending emails.");
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send Email"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default sendEmailBtn;
