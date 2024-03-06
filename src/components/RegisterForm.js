import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    number: false,
    specialChar: false,
  });

  // New state to track registration success
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = (email) => {
    // Simple regex for basic email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidFullName = (name) => {
    // Check if full name contains at least two words
    return name.trim().split(" ").length >= 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const minLength = value.length >= 7;
      const number = /\d/.test(value);
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      setPasswordRequirements({ minLength, number, specialChar });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!isValidFullName(formData.name)) {
      setErrorMessage("Full name must contain at least two words.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setRegistrationSuccess(true);
      setErrorMessage(""); // Clear any previous error messages
      // Sign in the user automatically with NextAuth
      signIn("credentials", {
        redirect: false, // Prevent NextAuth from redirecting internally
        email: formData.email,
        password: formData.password,
        callbackUrl: `${window.location.origin}/`,
      })
        .then((res) => {
          if (res.url) window.location.href = res.url; // Redirect to the callbackUrl or /protected
        })
        .catch((error) => {
          console.error("Automatic sign-in failed:", error);
          setErrorMessage(
            "Automatic sign-in failed. Please try logging in manually."
          ); // Handle or log error during automatic sign-in
        });
    } else {
      const errorData = await response.json();
      setRegistrationSuccess(false);
      setErrorMessage(
        errorData.message || "Registration failed. Please try again."
      ); // Update error message based on API response
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h1 className="text-black flex justify-center pb-5 text-3xl font-bold font-quicksand">
          Register
        </h1>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Full name"
          />
        </div>
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
        <div className="mb-4">
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
          />
          <div className="mt-2 mb-7">
            <p
              className={`${
                passwordRequirements.minLength
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {passwordRequirements.minLength ? "✓" : "✗"} At least 7 characters
            </p>
            <p
              className={`${
                passwordRequirements.number ? "text-green-500" : "text-red-500"
              }`}
            >
              {passwordRequirements.number ? "✓" : "✗"} Contains a number
            </p>
            <p
              className={`${
                passwordRequirements.specialChar
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {passwordRequirements.specialChar ? "✓" : "✗"} Contains a special
              character
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105"
          >
            Register
          </button>
          {registrationSuccess && (
            <p className="text-green-500 ml-4">Registration successful</p>
          )}
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 max-w-32 flex justify-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}