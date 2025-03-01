import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';

import supabaseClient from '@/lib/client';

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const [userCredits, setUserCredits] = useState(10);
  const [prevCredits, setPrevCredits] = useState(10);
  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }
        if (data?.session) {
          setCurrentUser(data.session.user ?? null);
        }
      } catch (err) {
        console.error('Unexpected error while fetching session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSend = () => {
    if (!draft.trim() || userCredits <= 0) return;
    
    setMessages((prev) => [...prev, draft]);
    setDraft('');
    setPrevCredits(userCredits);
    setUserCredits((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* LEFT COLUMN (messages + input) */}
      <div className="w-4/5 border-r-2 border-orange-500 flex flex-col h-screen">
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="text-xl">
              {msg}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Textarea & Send button pinned at bottom */}
        <div className="pb-8 px-8 bg-black/90 flex gap-3 items-center">
          <textarea
            className="block w-full h-24 p-2 mb-4 text-black rounded resize-none"
            placeholder="Write something..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={userCredits <= 0}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={userCredits <= 0}
            className={`h-max py-2 px-6 rounded-full text-lg font-semibold transition-colors ${
              userCredits > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {userCredits > 0 ? 'Send' : 'Out of Credits'}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-1/5 p-4 bg-black/80 flex flex-col items-center">
        {currentUser ? (
          <div className="flex flex-col items-center">
            <span className="text-green-500 mb-4 text-xl font-bold">
              {currentUser.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full text-lg font-semibold transition-colors"
            >
              Sign out
            </button>

            {/* Progress Bar */}
            <div className="flex flex-col gap-3 w-full justify-center mt-10">
             
              <p className="text-center text-lg font-semibold">Available Credits</p>
              <div className={`text-3xl text-center font-bold text-blue-500 transition-all transform ${userCredits !== prevCredits ? 'scale-110 duration-300' : ''}`}>
                {userCredits}
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-lg font-semibold transition-colors"
              >
                Refill
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full text-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Refill Credits</h2>
            <p className="mb-4">Choose a refill package:</p>
            <div className="flex flex-col gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setPrevCredits(userCredits);
                  setUserCredits(userCredits + 10);
                  setIsModalOpen(false);
                }}
              >
                10 Credits - 10 RON
              </button>
              <button
                className="bg-blue-800 text-white px-4 py-2 rounded"
                onClick={() => {
                  setPrevCredits(userCredits);
                  setUserCredits(userCredits + 50);
                  setIsModalOpen(false);
                }}
              >
                50 Credits - 40 RON
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
