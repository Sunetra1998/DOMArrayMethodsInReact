import { useState, useEffect, Profiler, memo } from "react";
import "./styles.css";

export default function App() {
  const api = `https://randomuser.me/api`;
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filterAppState = user.filter(
    (user) =>
      user.name.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const effectFunc = () => {
    console.log("effect fired");
  };

  // useEffect(effectFunc); // fires the callback when mounting or re-render happens
  // useEffect(effectFunc, []); // fires the callback when mounting happens
  useEffect(effectFunc, [searchTerm]); // fires callback when mounting happens,
  // or value in dependency array changes

  const addUserHandler = async () => {
    const userData = await fetch(api, {
      method: "GET"
    });
    const userJson = await userData.json();
    const newUser = [...user, userJson.results[0]];
    setUser(newUser);
  };

  return (
    <div className="app">
      <Button clickHandler={addUserHandler} name={"Add User"} />
      <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Profiler
        id="userlist"
        onRender={(id, phase, actualDuration) => {
          console.log({
            id,
            phase,
            actualDuration
          });
        }}
      >
        <UserList user={filterAppState} />
      </Profiler>
    </div>
  );
}

const Button = memo(({ clickHandler, name }) => {
  return <button onClick={clickHandler}>{name}</button>;
});

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      name="search"
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

const UserList = (props) => {
  const { user } = props;
  return (
    <>
      <div className="user-list">
        {user.map((userObj, idx) => {
          return <UserObject key={idx} userObj={userObj} />;
        })}
      </div>
    </>
  );
};

const UserObject = memo(({ userObj }) => {
  return (
    <div className="user-object">
      {`${
        userObj.name.title + " " + userObj.name.first + " " + userObj.name.last
      }`}
      <ol>
        <li>{userObj.gender.toUpperCase()}</li>
        <li>{userObj.email}</li>
      </ol>
    </div>
  );
});
