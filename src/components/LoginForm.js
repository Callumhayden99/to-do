import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginStatus, setLoginStatus] = useState({
    success: false,
    message: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset login status on form change
    setLoginStatus({ success: false, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from redirecting internally
      email: formData.email,
      password: formData.password,
    });

    if (result.ok) {
      // Update login status to success and display success message
      setLoginStatus({ success: true, message: "Login successful" });
      // Redirect to /protected or another page as needed
      router.push("/");
    } else {
      // Update login status to failure and display error message
      setLoginStatus({ success: false, message: "Login details incorrect" });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h1 className="text-3xl flex justify-center text-black pb-5 font-bold font-quicksand">
          Login
        </h1>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <p
            className={`mt-4 ${
              loginStatus.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {loginStatus.message}
          </p>
        </div>
      </form>
    </>
  );
}
