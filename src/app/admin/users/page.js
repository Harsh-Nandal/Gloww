"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const toggleBlock = async (id, current) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isBlocked: !current }),
    });

    location.reload();
  };

  return (
    <div>
      <h1>Users</h1>

      {users.map(u => (
        <div key={u._id}>
          {u.name} ({u.email})
          <button onClick={() => toggleBlock(u._id, u.isBlocked)}>
            {u.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ))}
    </div>
  );
}