import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function App() {
  const [newUser, setNewUser] = useState({});
  const [login, setLogin] = useState({});
  const [loginStatus, setLoginStatus] = useState();

  useEffect(() => {
    axios.get("http://localhost:5000/login").then((res) => {
      if (res.data.loggedIn == true) {
        console.log(res.data);
        setLoginStatus(res.data.user[0]);
      }
    });
  }, []);

  //preciso passar essa configuração para que a comunicação com o back em relação a sessão e o cors seja realizada
  axios.defaults.withCredentials = true;

  function handleRegisterUser(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", { ...newUser })
      .then((res) => toast.success(res.data));
  }

  function handleLoginUser(e) {
    e.preventDefault();

    toast.promise(axios.post("http://localhost:5000/login", { ...login }), {
      loading: "Aguarde um momento...",
      success: (res) => res.data,
      error: (err) => err.response.data,
    });
  }
  return (
    <>
      <div className="Register">
        <h1>Register</h1>
        <form onSubmit={handleRegisterUser}>
          <input
            type="text"
            name=""
            id=""
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <input
            type="password"
            name=""
            id=""
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={handleLoginUser}>
          <input
            type="text"
            name=""
            id=""
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          <input
            type="password"
            name=""
            id=""
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <Toaster />
    </>
  );
}
