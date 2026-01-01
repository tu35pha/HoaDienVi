export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-dark-bg)] p-4">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">Thanh toán</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ và tên</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Số nhà, đường..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input type="tel" className="w-full border p-2 rounded" placeholder="090..." />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white py-3 rounded-lg font-bold shadow-md mt-4">
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
