import React from "react";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      access: username,
      secret: password
    };

    fetch("https://openlibrary.org/account/login.json", {
      method: "POST",
      body: JSON.stringify(data)
    }).then((response) => {
        if (response.ok) {
            onLoggedIn(username);
        } else {
            alert("Login failed");
        }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input 
        type="text"
        minlength="3"
        maxlength="20"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
            required
         />
      </label>
      <label>
        Password:
        <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
            required
         />
      </label>
      <button type="submit">
        Submit
      </button>
    </form>
  );
};