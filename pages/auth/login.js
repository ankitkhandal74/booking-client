import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession, signOut, getSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
  
    if (result?.error) {
      console.error("Login error:", result.error);
      setError("Invalid username or password");
    } else {
      setError("");
      const session = await getSession(); // Get the session data with custom token fields
      console.log("Session:", session.user);
      if (session?.user) {
        // Store custom token in localStorage
        localStorage.setItem("Token", JSON.stringify(session.user));
      }
      router.push("/"); // Redirect after successful login
    }
  };

  
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header className="flex justify-between items-center pr-6 pl-4 py-8 w-full h-12 bg-[#8a1fe2] " />

      <div>
        <h1 className="text-3xl font-bold text-center mt-8">Login</h1>
        <form
          className="flex flex-col items-center mt-8"
          onSubmit={handleSubmit}
        > 
            <input className="border border-gray-300 p-2 rounded-md w-80" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="border border-gray-300 p-2 rounded-md w-80 mt-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-purple-600 text-white p-2 rounded-md w-80 mt-4" type="submit">Login</button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>


    {/* <div className="min-h-screen  bg-gray-50 md:mt-8 ">
      <div className="flex justify-around w-full   max-md:flex-col ">
        <div className="  w-screen-half bg-login flex items-center justify-center max-md:w-full hig ">
          <div className=" flex items-center flex-col loginbox max-md:w-80 max-md:h-96 ">
            <div >
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Log in to your account
              </h2>
            </div>
            <form className="mt-8 mb-5 flex justify-around w-full max-md:flex-col gap-y-4" onSubmit={handleSubmit}>


              <button
                class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95"
                onClick={() => signIn("google")}
              >
                <span
                  class="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc]  justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" class="w-5 h-5">
                    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                  </svg>Sign in with Google</span>
              </button>

              <button
                onClick={() => signOut()}
                class="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[rgb(228,83,83)] to-[#ff9595] active:scale-95"
              ><span
              class="w-full h-full flex items-center gap-2 px-4 py-3 bg-[#ff0101] text-white rounded-[14px] bg-gradient-to-t from-[#d41a02] to-[#fc4343]  justify-center"
            >
                Sign out</span>
              </button>
            </form>
            <Link href="/auth/signup" className="underline">
              New user? Sign Up
            </Link>

            <div>
              <Link href="/member/dashboard" className="underline">
                Back To Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="logind  w-screen-half flex items-center justify-center max-md:w-full hig ">
        <div className=" flex items-center flex-col loginshow  md:text-[20px] max-md:h-96  ">
          {session && (
            <div className="flex flex-col mt-4 h-full p-2">
              <h1 className="welText text-6xl ">Welcome,</h1>
              <div className="infotext">
                <strong>User:</strong> {name}
                
              </div>
              <div className="infotext">
                <strong>Email:</strong> {email}
                
              </div>
              <div className="infotext">
                <strong>API Key:</strong> {apiKey}
                
              </div>
            </div>
          )}
          {!session && <div>Not logged in</div>}
        </div>
        </div>

      </div>
    </div> */}
    </div>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}