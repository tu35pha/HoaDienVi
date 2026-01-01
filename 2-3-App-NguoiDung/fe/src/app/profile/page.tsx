export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-dark-bg)] p-4">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Người dùng mẫu</h1>
          <p className="text-gray-500">user@example.com</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50">Lịch sử đơn hàng</button>
        <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50">Cài đặt tài khoản</button>
        <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 text-red-500">Đăng xuất</button>
      </div>
    </div>
  );
}
