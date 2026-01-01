"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          src="/khung-hinh/bg-dangky.png"
          alt="Background Register"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-8 max-w-md h-full flex flex-col justify-center">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-white mb-2">Chào bạn,</h1>
          <p className="text-white/90 text-lg">Hãy tạo tài khoản để trải nghiệm ngay!</p>
        </div>

        {/* Profile Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden shadow-lg flex items-center justify-center">
              <Image 
                src="/icons/profile-icon.png" 
                alt="Profile" 
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            {/* Add Picture Button */}
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform">
              <Image 
                src="/icons/add-pic-icon.png" 
                alt="Add Picture" 
                width={24} 
                height={24} 
              />
            </button>
          </div>
        </div>

        <form className="space-y-6">
          {/* Inputs Container */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* Username Input */}
            <div className="relative border-b border-pink-100">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
              />
            </div>

            {/* Password Input */}
            <div className="relative border-b border-pink-100">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
              />
            </div>
          </div>

          {/* Register Button */}
          <button className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity text-lg mt-4">
            Đăng ký
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-[#8B5CF6] text-base font-medium">
            Bạn đã có tài khoản?{" "}
            <Link href="/login" className="font-bold text-[#1A4BBE] hover:underline">
              Đăng nhập.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
