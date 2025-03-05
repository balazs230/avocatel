import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const inputs = Object.fromEntries(form.entries());
    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
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
            <button
              type="submit"
              className="w-full py-3 px-6 bg-red-600 text-white rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
