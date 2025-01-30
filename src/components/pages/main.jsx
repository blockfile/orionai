import { useEffect, useState } from "react";
import BG from "../assets/images/bg5.mp4";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

function Home() {
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [generations, setGenerations] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBooting(false);
          displayStartupMessages();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const displayStartupMessages = () => {
    setHistory([]); // ✅ Reset history before displaying new messages

    const startupMessages = [
      "🟢 Neural Core Initialized...",
      "🟢 Memory Synchronization Complete...",
      "🟢 AI Logic Circuits Engaged...",
      "🟢 Security Protocols Verified...",
      "🟢 Quantum Data Streams Connected...",
      "🟢 Environmental Awareness: ONLINE",
      "🟢 Adaptive Learning Modules: ACTIVE",
      "--------------------------------------------",
      "🔹 SYSTEM STATUS: ✅ ALL CORE FUNCTIONS OPERATIONAL.",
      "🔹 CONNECTION SECURE: 🔒 ENCRYPTION LEVEL: MILITARY-GRADE AES-512",
      "🔹 PROCESSING SPEED: ⚡ QUANTUM THREAD OPTIMIZATION ENABLED",
      "--------------------------------------------",
      "💬 Hello, Operator. I am **ORION**, your **Autonomous AI Assistant.**",
      "🔹 I am ready to execute commands.",
      "🔹 Type 'HELP' for a list of available commands.",
      "📡 System uplink stable. Awaiting input...",
    ];

    const spinner = ["|", "/", "-", "\\"];
    let messageIndex = 0;

    const showSpinnerAndMessage = () => {
      if (messageIndex >= startupMessages.length) {
        setTimeout(() => setShowInput(true), 500);
        return;
      }

      let spinIndex = 0;

      // ✅ Ensure "Loading" appears only once
      setHistory((prev) => {
        if (
          !prev.some(
            (msg) => typeof msg === "string" && msg.startsWith("Loading")
          )
        ) {
          return [...prev, `Loading ${spinner[spinIndex % spinner.length]}`];
        }
        return prev;
      });

      const spinInterval = setInterval(() => {
        spinIndex++;
        setHistory((prev) => {
          if (!Array.isArray(prev)) return [];

          return [
            ...prev.slice(0, prev.length - 1),
            `Loading ${spinner[spinIndex % spinner.length]}`,
          ];
        });
      }, 150);

      setTimeout(() => {
        clearInterval(spinInterval);

        setHistory((prev) => {
          if (!Array.isArray(prev)) return [];

          // ✅ Remove "Loading" before adding a new message
          const filteredHistory = prev.filter(
            (line) => !(typeof line === "string" && line.startsWith("Loading"))
          );

          // ✅ Prevent duplicates
          if (
            !filteredHistory.some(
              (msg) => msg === startupMessages[messageIndex]
            )
          ) {
            return [...filteredHistory, startupMessages[messageIndex]];
          }

          return filteredHistory;
        });

        messageIndex++;

        if (messageIndex < startupMessages.length) {
          setTimeout(showSpinnerAndMessage, 500);
        } else {
          setTimeout(() => {
            setShowInput(true);
          }, 500);
        }
      }, 1000);
    };

    showSpinnerAndMessage();
  };

  const handleGenerate = async (prompt) => {
    setHistory((prev) => [...prev, `Generating image for: "${prompt}"...`]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/generateImages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to generate image.");

      const data = await res.json();

      if (data.imageUrl) {
        setGenerations((prev) => [...prev, { prompt, image: data.imageUrl }]);
      } else {
        throw new Error("Invalid image data received.");
      }

      setLoading(false);
      setHistory((prev) => [...prev, `Image generated for: "${prompt}"`]);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setHistory((prev) => [...prev, "Error: Failed to generate image."]);
    }
  };

  const handleCommand = (command) => {
    const cleanCommand = command.trim();
    if (cleanCommand.startsWith("/generate")) {
      const prompt = cleanCommand.replace("/generate", "").trim();
      if (prompt) {
        handleGenerate(prompt);
      } else {
        setHistory((prev) => [...prev, "Error: Missing prompt."]);
      }
    } else if (cleanCommand === "help") {
      setHistory((prev) => [
        ...prev,
        "HELP: SHOWS ALL AVAILABLE COMMANDS",
        "/generate <prompt>: Generates an image based on your description",
        "CLEAR: CLEARS THE SCREEN",
      ]);
    } else if (cleanCommand === "clear") {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, `Command not recognized: '${command}'`]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={BG} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay Layer */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      {/* MacOS Terminal Window */}
      <div
        className={`terminal-container font-mono3  ${glitch ? "glitch" : ""}`}
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "80%",
          height: "70%",
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Black with 70% opacity
          color: "limegreen",
          fontFamily: "monospace",
          fontSize: "1.2rem",
          boxShadow: "0 5px 30px rgba(0, 255, 255, 0.5)",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#222",
            padding: "5px 10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#FF5F57",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#FFBD2E",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#28C840",
                borderRadius: "50%",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              flexGrow: 1,
            }}
          >
            ORION AI
          </div>
          <div className=" flex space-x-3">
            <div>
              <a
                href="https://x.com/ORIONdotAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-teal-400"
              >
                <FaXTwitter />
              </a>
            </div>
            <div>
              <a
                href="https://t.me/OrionAIportal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-teal-400"
              >
                <FaTelegram />
              </a>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="terminal-content ">
          {/* Left Side: Boot/History and Input */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "10px",
              borderRight: "1px solid rgba(0, 255, 0, 0.3)",
            }}
            className="responsive-border "
          >
            <style>{`
      @media (max-width: 768px) {
        .responsive-border {
          border-right: none !important; /* Remove border on mobile */
        }
      }
    `}</style>

            {/* Fixed Text Below ASCII Art */}
            <div
              style={{
                textAlign: "center",
                color: "limegreen",
                fontFamily: "monospace",
                marginBottom: "10px",
                whiteSpace: "pre-wrap", // Allow wrapping of text when necessary
                wordBreak: "break-word", // Ensure text breaks correctly on small screens
              }}
            >
              <p style={{ margin: 0 }}>
                {"=".repeat(60)} {/* Repeat '=' programmatically */}
              </p>
              <p style={{ margin: 0 }}>
                ORION-AI BETA-V.1.0.3 (C) ALL RIGHTS RESERVED.
              </p>
              <p style={{ margin: 0 }}>
                {"=".repeat(60)} {/* Repeat '=' programmatically */}
              </p>
            </div>

            <style>{`
      @media (max-width: 768px) {
        p {
          font-size: 0.8rem; /* Adjust font size for mobile view */
          line-height: 1.2; /* Better spacing for readability */
        }
      }
    `}</style>

            <div
              style={{
                flex: 1,
                overflowX: "auto",
                fontSize: "15px",
                textAlign: "left",
              }}
              className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-black scrollbar-rounded-lg font-Staatliches text-red-600"
            >
              <p>BOOTING SYSTEM...</p>
              <p>
                [
                {Array(Math.floor(progress / 4))
                  .fill("█")
                  .join("")}
                {Array(25 - Math.floor(progress / 4))
                  .fill(" ")
                  .join("")}
                ] {progress >= 100 ? 100 : progress}%
              </p>

              {/* Show boot messages after reaching 100% */}
              {progress >= 100 &&
                history.map((line, index) => (
                  <p
                    key={index}
                    style={{ margin: 0 }}
                    className="font-spacemono"
                  >
                    {line}
                  </p>
                ))}

              {/* ✅ Generated images will now appear here (WITHOUT LOADING) */}
              {generations.length > 0 &&
                generations.map((gen, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    <p style={{ color: "white", marginBottom: "10px" }}>
                      Generated Prompt: {gen.prompt}
                    </p>
                    <img
                      src={gen.image}
                      alt={`Generated-${index}`}
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                ))}
            </div>

            {/* Input fixed at the bottom */}
            {showInput && !booting && (
              <div
                style={{
                  display: "flex",
                  marginTop: "auto", // Pushes input to the bottom
                  paddingTop: "10px",
                  fontSize: "20px",
                }}
              >
                <span style={{ marginRight: "10px" }}>C:@user:root:~$&gt;</span>
                <input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "limegreen",
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: "20px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
  @keyframes glitch {
      0% { 
          transform: translate(2px, -2px); 
          color: #ff0000; /* Red */
           box-shadow: 0 5px 30px rgba(255, 0, 0, 0.7); /* Red shadow */
      }
      25% { 
          transform: translate(-2px, 2px); 
          color: #00ff00; /* Green */
            box-shadow: 0 -5px 30px rgba(0, 255, 0, 0.7); /* Green shadow */
      }
      50% { 
          transform: translate(2px, 0px); 
          color: #0000ff; /* Blue */
            box-shadow: -5px 5px 30px rgba(0, 0, 255, 0.7); /* Blue shadow */
      }
      75% { 
          transform: translate(-2px, -2px); 
          color: #ff00ff; /* Magenta */
           box-shadow: 5px -5px 30px rgba(255, 0, 255, 0.7); /* Magenta shadow */
      }
      100% { 
          transform: translate(0px, 0px); 
          color: limegreen; /* Original Color */
          box-shadow: 0 5px 30px rgba(0, 255, 0, 0.5); /* Original lime shadow */
      }
  }
.terminal-content {
      display: flex; /* Default for large screens */
      flex: 1;
      overflow-y: auto;
  }

  @media (max-width: 768px) {
      .terminal-content {
          display: block; /* Disable flex layout for medium and smaller screens */
      }
  }
  .glitch {
      animation: glitch 0.2s infinite; /* Run the color-changing glitch effect */
      filter: blur(0.8px) brightness(1.2);
      position: relative;
  }

  .glitch::before,
  .glitch::after {
      content: attr(data-text); /* Duplicate content */
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.8;
  }

  .glitch::before {
      color: #ff0000; /* Red overlay */
      transform: translate(-2px, 2px);
  }

  .glitch::after {
      color: #00ffff; /* Cyan overlay */
      transform: translate(2px, -2px);
  }
`}</style>
    </div>
  );
}

export default Home;
