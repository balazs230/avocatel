interface LoginModalProps {
  loginSuccess: boolean;
  loginError: string;
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  handleLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setIsLoginModalOpen: (value: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  loginSuccess,
  loginError,
  loginEmail,
  setLoginEmail,
  handleLoginSubmit,
  setIsLoginModalOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Sign In</h2>
        {loginSuccess ? (
          <div className="p-6 bg-green-600 rounded-lg text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p>Please check your inbox for further instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="loginEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            {loginError && (
              <div className="p-3 bg-red-600 rounded-lg text-white text-center">
                <p>{loginError}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none"
            >
              Get Started
            </button>
          </form>
        )}
        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setIsLoginModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};
