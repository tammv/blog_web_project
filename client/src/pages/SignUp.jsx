import { Alert, Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setErrorMessages(null);

    const validPassword = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$");
    const validEmail = new RegExp("^[a-zA-Z0-9._:$!%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    if(e.target.id === 'username' && !formData.username){
      return setErrorMessages('Please fill out username fields.');
    }

    if(e.target.id === 'email' && !validEmail.test(formData.email)){
      return setErrorMessages('Invalid email');
    }

    if(e.target.id === 'password' && !validPassword.test(formData.password)){
      return setErrorMessages('Password must minimum six characters, at least one letter, one number');
    }

    if(e.target.id === 'verify' && !/^[0-9]{0,6}$/.test(formData.verify)){
      return setErrorMessages('OTP just enter number');
    }
  };

  const handleVerifyEmail = async(e) => {
    e.preventDefault();
    setErrorMessages(null);

    if (!formData.username || !formData.email || !formData.password || formData.username === "" || formData.email === "" || formData.password === "") {
      return setErrorMessages("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrorMessages(null);

      const res = await fetch("/api/auth/verifyemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return setErrorMessages(data.message);
      }

      setLoading(false);

      if (res.ok) {
        setLoading(false);
        setOpenModal(true);
      }
      
    } catch (error) {
      setErrorMessages(error.message);
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || formData.username === "" || formData.email === "" || formData.password === "") {
      return setErrorMessages("Please fill out all fields.");
    }
    if (!formData.verify || formData.verify === ""){
      return setErrorMessages("Please enter OTP.");
    }
    try {
      setLoading(true);
      setErrorMessages(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessages(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessages(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
      <div className="flex p-3 max-w-3xl flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              DevB
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5 dark:text-gray-300">You can sign up with your email and password or with Google</p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your username" className="dark:text-gray-200" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="">
              <Label value="Your email" className="dark:text-gray-200" />
              <TextInput
                type="email"
                placeholder="email@company.com"
                id="email"
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="">
              <Label value="Your password" className="dark:text-gray-200" />
              <TextInput
                type="password"
                placeholder="Must minimum 6 characters, least 1 letter, 1 number"
                id="password"
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <Button gradientDuoTone="purpleToPink" type="button" disabled={loading} onClick={handleVerifyEmail}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Your email verification code is 6 digits
                  </h3>
                  <div className="flex justify-center gap-4">
                    <input className="dark:bg-gray-800 dark:text-gray-200 text-center justify-between tracking-[1em] sm:p-2 sm:text-xs md:p-2.5 md:text-sm lg:p-4 lg:text-lg border-solid border-2 border-sky-500 hover:border-red-600" 
                    id="verify"
                    onChange={handleChange}
                    type="text" 
                    maxLength={6}></input>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-center">
              <Button gradientDuoTone="pinkToOrange" type="submit" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              </Modal.Footer>
            </Modal>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5 dark:text-gray-300">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500 dark:text-blue-400">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
