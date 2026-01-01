"use client";

import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
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
        {/* Overlay Background - Reusing login background for consistency */}
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
        <div className="bg-white/40 backdrop-blur-xl rounded-t-[50px] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[50vh] flex flex-col relative">
          
          {/* Profile Icon - Floating on top border */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl bg-white flex items-center justify-center">
               <Image 
                src="/icons/profile-icon.png" 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Header */}
          <div className="mt-16 mb-8 text-center">
            <h1 className="text-3xl font-black text-[#1A4BBE] mb-2">Quên mật khẩu?</h1>
            <p className="text-[#1A4BBE]/80 text-sm font-medium px-8">
              Đừng lo lắng! Hãy nhập email hoặc số điện thoại của bạn để lấy lại mật khẩu.
            </p>
          </div>

          <form className="space-y-6">
            {/* Inputs Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Email/Phone Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Email hoặc số điện thoại"
                  className="w-full px-6 py-5 bg-transparent text-[#8B5CF6] placeholder-[#B4B4F1] font-bold focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col gap-4 pt-2">
              <button className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-2xl shadow-md hover:opacity-90 transition-opacity text-lg">
                Gửi yêu cầu
              </button>
              
              <div className="text-center">
                <Link href="/login" className="text-[#1A4BBE] text-base font-bold hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </form>

          {/* Spacer */}
          <div className="flex-grow"></div>
        </div>
      </div>
    </div>
  );
}
