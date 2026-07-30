import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import Message from './Message';

const UI_TEXT = {
  en: {
    heading: "Hi! I'm DBI Bot.",
    subheading: "Ask me anything about Digital Book of India.",
    placeholder: "Ask anything about DBI...",
    suggestions: [
      "What is Digital Book of India?",
      "How do I register my business on DBI?",
      "What are DBI's pricing plans?",
      "What is AI-Mapping on DBI?",
    ],
  },
  hi: {
    heading: "नमस्ते! मैं DBI Bot हूं।",
    subheading: "Digital Book of India के बारे में कुछ भी पूछिए।",
    placeholder: "यहाँ अपना सवाल लिखें...",
    suggestions: [
      "Digital Book of India क्या है?",
      "अपना बिज़नेस DBI पर कैसे रजिस्टर करें?",
      "DBI के pricing plans क्या हैं?",
      "DBI पर AI-Mapping क्या है?",
    ],
  },
  auto: {
    heading: "Hi! I'm DBI Bot.",
    subheading: "Ask me anything about Digital Book of India — in English or Hindi.",
    placeholder: "Ask anything about DBI... (English ya Hindi mein)",
    suggestions: [
      "Digital Book of India kya hai?",
      "How do I register my business on DBI?",
      "DBI ke pricing plans kya hain?",
      "What is AI-Mapping on DBI?",
    ],
  },
};

const ChatBox = () => {

  const { messages, setMessages, loading, setLoading, lang, toast, axios } = useAppContext();
  const [prompt, setPrompt] = useState("");
  const containerRef = useRef(null);

  const t = UI_TEXT[lang] || UI_TEXT.auto;

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setPrompt("");
    setLoading(true);

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages(prev => [...prev, { role: "user", content: trimmed, timestamp: Date.now() }]);

    try {
      const { data } = await axios.post("/chat/message", { message: trimmed, history, lang });

      if (data.success) {
        setMessages(prev => [...prev, data.reply]);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reach DBI Bot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(prompt);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  return (

    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 '>

      <div className='flex-1 mb-5 overflow-y-scroll' ref={containerRef}>

        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-4 text-primary text-center'>
            <img src={assets.logo} alt="DBI Bot" className="w-16 h-16 sm:w-20 sm:h-20" />
            <div>
              <p className='text-3xl sm:text-5xl text-gray-700 dark:text-white font-medium'>{t.heading}</p>
              <p className='mt-2 text-base sm:text-lg text-gray-400 dark:text-gray-300'>{t.subheading}</p>
            </div>

            <div className='flex flex-wrap justify-center gap-2 mt-2 max-w-2xl'>
              {t.suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className='text-sm px-4 py-2 rounded-full border border-primary dark:border-[#80609F]/40 bg-primary/10 dark:bg-[#57317C]/20 hover:bg-primary/20 dark:hover:bg-[#57317C]/40 transition-all cursor-pointer'
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message} />)}

        {loading && <div className='loader flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
          <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce '></div>
        </div>}

      </div>

      <form
        className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-5 mx-auto flex gap-4 items-center'
        onSubmit={onSubmit}
      >

        <input
          type="text"
          placeholder={t.placeholder}
          className='flex-1 w-full text-sm outline-none bg-transparent text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300'
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          type='submit'
          disabled={loading}
          className='text-white px-3 py-1 rounded-md text-sm disabled:opacity-50'
        >
          <img
            src={assets.send_icon}
            alt="Send"
            className="w-8 cursor-pointer"
          />
        </button>

      </form>

    </div>

  )
}

export default ChatBox
