'use client';
import { useUser } from "@auth0/nextjs-auth0"

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {user && (
        <div style={{ textAlign: "center" }}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  );
}