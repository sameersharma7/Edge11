// lib/api.ts
export async function placePick(
  userId: string,
  matchName: string,
  pick: "MI" | "DC",
  amount: number = 100
) {
  try {
    const response = await fetch("/api/picks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        matchName,
        pick,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place pick");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error placing pick:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
