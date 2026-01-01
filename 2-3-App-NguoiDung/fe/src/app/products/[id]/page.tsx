export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-dark-bg)] p-4">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
      <h1 className="text-2xl font-bold mb-2 text-[var(--color-foreground)]">Chi tiết sản phẩm</h1>
      <p className="text-gray-600 mb-4">Mô tả chi tiết về sản phẩm sẽ hiển thị ở đây.</p>
      <button className="w-full bg-gradient-to-r from-[var(--color-primary-start)] to-[var(--color-primary-end)] text-white py-3 rounded-lg font-bold shadow-md">
        Thêm vào giỏ hàng
      </button>
    </div>
  );
}
