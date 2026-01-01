"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [showButtons, setShowButtons] = useState(false);

  const handleScreenClick = () => {
    if (!showButtons) {
      setShowButtons(true);
    }
  };

  return (
    <div 
      onClick={handleScreenClick}
      className="h-full bg-white dark:bg-[var(--color-dark-bg)] relative overflow-hidden cursor-pointer flex flex-col items-center"
    >
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
          src="/khung-hinh/bg-trangchu.png"
          alt="Background Overlay"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Main Content */}
      <div className="h-full w-full relative z-10">
        
        {/* Unified Container */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out w-full px-8 flex flex-col ${
            showButtons ? "top-1/2 h-[60%]" : "top-1/2 h-auto"
          }`}
        >
          {/* Logo Section - Occupies 3/5 when active */}
          <div className={`flex items-center justify-center transition-all duration-700 ${
            showButtons ? "h-[60%]" : "h-64"
          }`}>
            <div className={`relative transition-all duration-700 ease-in-out ${
              showButtons ? "w-48 h-48" : "w-64 h-64"
            }`}>
              <Image 
                src="/icons/logo-sentio-icon.png" 
                alt="Sentio Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-[var(--color-foreground)] text-center hidden">HoaDienVi</h1>
          </div>

          {/* Buttons Section - Occupies 2/5 when active */}
          <div className={`flex flex-col justify-center space-y-4 transition-all duration-700 ${
            showButtons ? "h-[40%] opacity-100 visible" : "h-0 opacity-0 invisible overflow-hidden"
          }`}>
            <Link href="/login" className="block w-full">
              <button className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-opacity text-lg">
                Đăng nhập
              </button>
            </Link>
            
            <Link href="/register" className="block w-full">
              <button className="w-full py-4 bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] font-bold rounded-full shadow-sm hover:bg-gray-50 transition-colors text-lg">
                Đăng ký
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

