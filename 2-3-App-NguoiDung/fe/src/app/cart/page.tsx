export default function CartPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-dark-bg)] p-4">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">Giỏ hàng</h1>
      <div className="space-y-4">
        <div className="border p-4 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Sản phẩm mẫu</h3>
            <p className="text-sm text-gray-500">Số lượng: 1</p>
          </div>
          <p className="font-bold">100.000 đ</p>
        </div>
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Tổng cộng:</span>
          <span>100.000 đ</span>
        </div>
        <button className="w-full bg-[var(--color-accent-blue)] text-white py-3 rounded-lg font-bold shadow-md">
          Thanh toán
        </button>
      </div>
    </div>
  );
}
