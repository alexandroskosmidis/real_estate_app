export interface LoginResponse {
  success: boolean;
  user?: {
    user_id: number;
    name: string;
    role: "buyer" | "owner";
  };
  message?: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch(
    "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/auth/login.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  return res.json();
};
