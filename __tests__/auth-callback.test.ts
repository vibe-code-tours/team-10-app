/**
 * @jest-environment node
 */
import { GET } from "@/app/[locale]/auth/callback/route";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("Auth Callback Route Handler", () => {
  const mockExchangeCode = jest.fn();
  const mockVerifyOtp = jest.fn();
  const mockGetUser = jest.fn();
  const mockUpsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCode,
        verifyOtp: mockVerifyOtp,
        getUser: mockGetUser,
      },
      from: () => ({
        upsert: mockUpsert,
      }),
    });
  });

  it("should redirect to login with error if explicit error_code is present in URL", async () => {
    const req = new Request(
      "http://localhost:3000/auth/callback?error_code=otp_expired&error_description=Expired",
    );
    const res = await GET(req);

    expect(res.status).toBe(307); // NextResponse.redirect status
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=otp_expired",
    );
  });

  it("should handle token_hash & type for OTP verification successfully", async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          email: "user@example.com",
          user_metadata: { full_name: "Test User" },
        },
      },
    });
    mockUpsert.mockResolvedValue({ error: null });

    const req = new Request(
      "http://localhost:3000/auth/callback?token_hash=valid_hash&type=signup",
    );
    const res = await GET(req);

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      token_hash: "valid_hash",
      type: "signup",
    });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("should redirect to /login?error=otp_expired if verifyOtp returns an error", async () => {
    mockVerifyOtp.mockResolvedValue({
      error: { message: "Token has expired" },
    });

    const req = new Request(
      "http://localhost:3000/auth/callback?token_hash=expired_hash&type=signup",
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/login?error=otp_expired",
    );
  });

  it("should handle code exchange for OAuth successfully", async () => {
    mockExchangeCode.mockResolvedValue({ error: null });
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-456",
          email: "oauth@example.com",
          user_metadata: { name: "OAuth User" },
        },
      },
    });
    mockUpsert.mockResolvedValue({ error: null });

    const req = new Request(
      "http://localhost:3000/auth/callback?code=valid_oauth_code",
    );
    const res = await GET(req);

    expect(mockExchangeCode).toHaveBeenCalledWith("valid_oauth_code");
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });
});
