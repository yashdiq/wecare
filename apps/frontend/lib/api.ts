import { useAuth } from "./auth";
import { LoginResponse } from "./types";

// Default to API gateway URL if environment variable is not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://8.219.89.94:4200";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function getShiftDetails() {
  try {
    const token = localStorage.getItem("accessToken") || "";

    const response = await fetch(`${API_URL}/shifts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shift details");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch shift error:", error);
    throw error;
  }
}

export async function logVisit(data: any) {
  try {
    const token = localStorage.getItem("accessToken") || "";

    const response = await fetch(`${API_URL}/visits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Visit logging failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Log visit error:", error);
    throw error;
  }
}
