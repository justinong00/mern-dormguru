import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function Home() {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-600">Welcome, {user?.name}</h1>
      <div className="flex justify-end">
        <Button onClick={() => {
          navigate('/admin')
        }}>Go To Admin</Button>
      </div>
    </div>
  );
}

export default Home;
