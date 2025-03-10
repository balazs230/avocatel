// pages/index.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import supabaseClient from "@/lib/supabase";
import { LoginModal } from "@/components/LoginModal";
import { RefillCreditsModal } from "@/components/RefillCreditsModal";

interface Profile {
  id: string;
  credits: number;
  language: string;
  isLawyer: boolean;
  created_at: string;
}

const DEFAULT_CREDITS = 3;

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [userCredits, setUserCredits] = useState(0);
  const [prevCredits, setPrevCredits] = useState(0);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // States for login modal
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { canceled } = router.query;

  useEffect(() => {
    if (canceled) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, [canceled]);

  // Initialize session and profile on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabaseClient.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          return;
        }

        if (session?.user) {
          setCurrentUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Unexpected error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch an existing profile or create a new one if none exists
  const fetchUserProfile = async (userId: string) => {
    const { data: profiles, error: fetchError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId);

    if (fetchError) {
      console.error("Error fetching profile:", fetchError.message);
      return;
    }

    if (profiles && profiles.length > 0) {
      const existingProfile = profiles[0];
      setProfile(existingProfile);
      setUserCredits(existingProfile.credits);
      setPrevCredits(existingProfile.credits);
    } else {
      // No profile found; create a new one
      const { data: newProfile, error: createError } = await supabaseClient
        .from("profiles")
        .insert({
          id: userId,
          credits: DEFAULT_CREDITS,
          language: "ro",
          isLawyer: false,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError.message);
      } else {
        setProfile(newProfile);
        setUserCredits(newProfile.credits);
        setPrevCredits(newProfile.credits);
      }
    }
  };

  // Utility to update the user's credits both locally and in the DB
  const updateUserCredits = async (newCredits: number) => {
    setPrevCredits(userCredits);
    setUserCredits(newCredits);
    if (profile && currentUser) {
      const { error } = await supabaseClient
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", currentUser.id);
      if (error) console.error("Error updating credits:", error.message);
    }
  };

  // Handler for sending a message
  const handleSend = async () => {
    if (!draft.trim() || userCredits <= 0) return;

    setMessages((prev) => [...prev, draft]);
    setDraft("");
    await updateUserCredits(userCredits - 1);
  };

  // Handler for user sign-out
  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setCurrentUser(null);
      setProfile(null);
      setUserCredits(0);
      setPrevCredits(0);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handler for login modal submission
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    try {
      const formData = new FormData(e.currentTarget);
      const inputs = Object.fromEntries(formData.entries());
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (response.ok) {
        setLoginSuccess(true);
        setLoginEmail("");
        // Optionally, refresh the session here so that currentUser gets updated.
        // For example, you could call your initializeUser function again.
      } else {
        const data = await response.json();
        setLoginError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting login form:", err);
      setLoginError("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white p-4">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Avocățel</title>
        <meta
          name="description"
          content="Login or create an account to get info about laws."
        />
      </Head>
      <div className="flex min-h-screen bg-black text-white">
        {/* Left Column (Chat messages and input) */}
        <div className="w-4/5 border-r-2 border-orange-500 flex flex-col h-screen">
          {/* Header */}
          <div className="flex w-max mx-auto bg-white/30 backdrop-blur-3xl justify-center gap-3 mt-5 py-2 px-6 rounded-full items-center">
            <h1 className="text-center text-4xl font-bold">Avocatel</h1>
            <Image
              src="/images/avocatel.webp"
              alt="logo"
              width={50}
              height={50}
            />
          </div>

          {currentUser ? (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-none">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-col gap-2 text-xl"
                  >
                    <div className="py-3 px-6 bg-green-600 text-white rounded-3xl w-max max-w-xs sm:max-w-md">
                      {msg}
                    </div>
                    <div className="w-full text-right flex justify-end">
                      <div className="bg-gray-400 text-black py-3 px-6 rounded-3xl w-max max-w-xs sm:max-w-md">
                        This is a demo response that will be replaced with API
                        response.
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Message input and send button */}
              <div className="py-4 px-8 bg-black/90 flex gap-3 items-center">
                <textarea
                  className="block w-full h-24 p-2 text-black rounded resize-none"
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
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {userCredits > 0 ? "Send" : "Out of Credits"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 justify-center items-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-full text-2xl font-semibold transition-colors"
              >
                Sign in to start chatting
              </button>
            </div>
          )}
        </div>

        {/* Right Column (User info and actions) */}
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

              <div className="flex flex-col gap-3 w-full justify-center mt-10">
                <p className="text-center text-lg font-semibold">
                  Available Credits
                </p>
                <div
                  className={`text-3xl text-center font-bold text-blue-500 transition-all transform ${
                    userCredits !== prevCredits ? "scale-110 duration-300" : ""
                  }`}
                >
                  {userCredits}
                </div>

                <button
                  type="button"
                  onClick={() => setIsRefillModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full text-lg font-semibold transition-colors"
                >
                  Refill
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full text-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Refill Credits Modal */}
        {isRefillModalOpen && (
          <RefillCreditsModal
            userId={currentUser?.id ?? ""}
            setIsRefillModalOpen={setIsRefillModalOpen}
          />
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <LoginModal
            loginEmail={loginEmail}
            loginSuccess={loginSuccess}
            loginError={loginError}
            setLoginEmail={setLoginEmail}
            handleLoginSubmit={handleLoginSubmit}
            setIsLoginModalOpen={setIsLoginModalOpen}
          />
        )}
      </div>
    </>
  );
};

export default Home;
