import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment/moment'
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';

import { FiCopy } from "react-icons/fi";

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [message?.content]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (

    <div>
      {message?.role === "user" ? (
        <div className='flex items-center justify-end my-4 gap-2'>

          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#14367a]/30 border border-[#2D4F9E]/30 rounded-md max-w-2xl'>

            <p className='text-sm dark:text-[#D8E4FF]'>
              {message?.content}
            </p>

            <div className='flex items-center justify-between gap-4'>

              <span className='text-xs text-gray-400 dark:text-[#9FB3DE]'>
                {moment(message?.timestamp).fromNow()}
              </span>

              <button
                onClick={() => handleCopy(message?.content)}
                className='flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition'
              >
                <FiCopy size={14} />
                Copy
              </button>

            </div>

          </div>

          <img
            src={assets.user_icon}
            alt="User Icon"
            className="w-8 rounded-full"
          />
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-2 max-w-2xl bg-primary/20 dark:bg-[#14367a]/30 border border-[#2D4F9E]/30 rounded-md my-4'>

          <div className='text-sm dark:text-[#D8E4FF] reset-tw'>
            <Markdown>{message?.content}</Markdown>
          </div>

          <div className='flex items-center justify-between px-1 mt-1'>

            <span className='text-xs text-gray-400 dark:text-[#9FB3DE]'>
              {moment(message?.timestamp).fromNow()}
            </span>

            <button
              onClick={() => handleCopy(message?.content)}
              className='flex items-center gap-1 text-xs text-gray-500 hover:text-purple-500 transition'
            >
              <FiCopy size={14} />
              Copy
            </button>

          </div>

        </div>
      )}
    </div>

  )
}

export default Message;
