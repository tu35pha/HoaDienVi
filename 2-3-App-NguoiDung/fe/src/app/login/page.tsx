"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-[var(--color-dark-bg)]">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        {/* Base Background */}
        <Image
          src="/khung-hinh/bg-chinh.png"
          alt="Background Main"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay Background */}
        <Image
          src="/khung-hinh/bg-dangnhap.png"
          alt="Background Login"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content Frame - Bottom Sheet Style */}
      <div className="absolute bottom-0 w-full z-10">
        <div className="bg-white/40 backdrop-blur-xl rounded-t-[50px] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[60vh] flex flex-col relative">
          
          {/* Profile Icon - Floating on top border */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl">
               <Image 
                src="/icons/profile-icon.png" 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Greeting */}
          <h1 className="text-4xl font-black text-[#1A4BBE] text-center mt-16 mb-12">Chào,</h1>

          <form className="space-y-6">
            {/* Inputs Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Username Input */}
              <div className="relative border-b border-pink-100">
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between pt-4">
              <Link href="/forgot-password" className="text-[#8B5CF6] text-base font-medium hover:underline pl-2">
                Quên mật khẩu?
              </Link>
              <button className="px-10 py-3 bg-[#8B5CF6] text-white font-bold rounded-2xl shadow-md hover:opacity-90 transition-opacity text-base">
                Đăng nhập
              </button>
            </div>
          </form>

          {/* Spacer to push content down */}
          <div className="flex-grow"></div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6 px-4">
            <div className="h-px bg-[#B4B4F1] flex-1 opacity-50"></div>
            <span className="text-[#8B5CF6] text-sm font-medium">Đăng nhập bằng</span>
            <div className="h-px bg-[#B4B4F1] flex-1 opacity-50"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-10 mb-8">
            <button className="hover:scale-110 transition-transform">
              <Image src="/icons/facebook-icon.png" alt="Facebook" width={40} height={40} />
            </button>
            <button className="hover:scale-110 transition-transform">
              <Image src="/icons/google-icon.png" alt="Google" width={40} height={40} />
            </button>
            <button className="hover:scale-110 transition-transform">
              <Image src="/icons/apple-icon.png" alt="Apple" width={40} height={40} />
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center pb-4">
            <p className="text-[#8B5CF6] text-base">
              Bạn chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-[#1A4BBE] hover:underline">
                Đăng ký.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
