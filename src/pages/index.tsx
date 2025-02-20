import { withSession } from "@/lib/withSession";

interface HomeProps {
  user: { user_id: string } | null;
}

export default function Home(props: HomeProps) {
  const { user } = props;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-3xl bg-opacity-70 bg-black/80 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Welcome to Avocatel!{" "}
          {user ? (
            <span className="text-green-500">You are logged in as {user.user_id}</span>
          ) : (
            <span className="text-red-500">You are not authenticated</span>
          )}
        </h2>
        
        {/* Add a call to action button for users who aren't authenticated */}
        {!user && (
          <div className="flex justify-center mt-6">
            <a
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full text-lg font-semibold transition-colors"
            >
              Log In
            </a>
          </div>
        )}

        {/* Add a sign-up button */}
        {!user && (
          <div className="flex justify-center mt-4">
            <a
              href="/signup"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-full text-lg font-semibold transition-colors"
            >
              Sign Up
            </a>
          </div>
        )}

      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getServerSidePropsHandler = async (context: any) => {
  const { req } = context;
  const user = req.session.get('user') ?? null;
  const props = { user };
  return { props };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);
