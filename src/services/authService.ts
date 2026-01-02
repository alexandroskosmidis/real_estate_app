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

// Signup 

export type SignUpData = {
  username: string;
  password: string;
  email: string;
  phone: string;
//  role: 'renter' | 'seller' | 'both';
};


export const signup = async (userData: SignUpData) => {
  try {
    const response = await fetch( "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/auth/signup.php", { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: "Network error during signup" };
  }
};
