import React, { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "English", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [showChatNotification, setShowChatNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // fwiw env variables all have to be prefixed with VITE_
  let APIKEY = 'ERR'
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    console.log('Checking OPENAI_API_KEY : OK')
    APIKEY = "OK"
  } else {
    console.log('Checking OPENAI_API_KEY : ERR')
  }

  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
    ,
  });

  const openai = new OpenAIApi(configuration);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const translate = async () => {
    const { language, message } = formData;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Translate this into ${language}: ${message}`,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const translatedText = response.data.choices[0].text.trim();
    setIsLoading(false);
    setTranslation(translatedText);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    displayChatNotification()
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };  

  const displayChatNotification = () => {
    setShowChatNotification(true);
    setTimeout(() => {
      setShowChatNotification(false);
    }, 5000);
  };


  return (
    
    <>
    <head>

    </head>

    <div className="container">
      <h1>ChatGPT Translation - ApiKey {APIKEY}</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          <input
            type="radio"
            id="english"
            name="language"
            value="English"
            defaultChecked={formData.language}
            onChange={handleInputChange}
          />
          <label htmlFor="english">English</label>

          <input
            type="radio"
            id="arabic"
            name="language"
            value="Arabic"
            onChange={handleInputChange}
          />
          <label htmlFor="arabic">Arabic</label>

        </div>

        <textarea
          name="message"
          placeholder="Type your message here.."
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
        </div>
        {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
      </div>

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>

      <div className={`notification ${showChatNotification ? "active" : ""}`}>
        Talking to ChatGPT
      </div>

    </div>
    </>
  );
};

export default App;
