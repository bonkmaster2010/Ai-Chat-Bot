import React from "react";
import Tilt from "react-parallax-tilt";
import "./styling.css";

function Main() {
  const [res, setRes] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [st, setST] = React.useState(false);

  // Function to simulate typing effect
  const simulateTyping = (text) => {
    if (st) {  
      setAnswer(""); 
      let index = 0;
      const interval = setInterval(() => {
        setAnswer((prev) => prev + text[index]);
        index += 1;
        if (index === text.length) {
          clearInterval(interval); 
        }
      }, 100); 
    } else {
      setAnswer(text); 
    }
  };

  async function ftch() {
    setLoading(true);
    let data = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBsO4BkyqrgSpU9f8k3_RRkR2MdZo3nS-Q`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: res }] }],
        }),
      }
    );

    let json = await data.json();
    
    console.log("API response:", json);

 
    const responseText =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No valid response"; 

    console.log("Response Text:", responseText); 

    simulateTyping(responseText); 
    setLoading(false);
    setRes(""); 
}

  return (
    <div className="main-cont">
      <Tilt
        className="chat-box"
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        perspective={1000}
        scale={1.1}
        transitionSpeed={3000}
      >
        <div className="messages">
          {answer && (
            <p className={`answer ${loading ? "typing" : "fade-in"}`}>{answer}</p>
          )}
        </div>
        <div className="controls">
          <input
            type="text"
            placeholder="Enter a question..."
            value={res}
            onChange={(e) => setRes(e.target.value)}
          />
          <button onClick={ftch} disabled={loading}>
            {loading ? "Typing..." : "Send"}
          </button>
        </div>

        <div className="settings">
          <div className="btns">
            {/* Button to toggle simulateTyping */}
            <button onClick={() => setST(!st)}>
              {st ? "Disable Typing Effect" : "Enable Typing Effect"}
            </button>
          </div>
        </div>
      </Tilt>
    </div>
  );
}

export default Main;
