import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const form = new FormData(e.target as HTMLFormElement);
      const inputs = Object.fromEntries(form.entries());
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Avocatel - Login</title>
        <meta
          name="description"
          content="Login or create an account to get info about laws."
        />
      </Head>

      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-full max-w-md bg-opacity-70 bg-black/80 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Ready to watch? Enter your email.
          </h1>
          {success ? (
            <div className="p-6 bg-green-600 rounded-lg text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p>Please check your inbox for further instructions.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 p-3 w-full border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-black text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-600 rounded-lg text-white text-center">
                  <p>{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Get Started
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
