import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--color-dark-bg)] p-4">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Mock Product List */}
        {[1, 2, 3, 4].map((id) => (
          <Link key={id} href={`/products/${id}`} className="block border rounded-lg p-4 hover:shadow-lg">
            <div className="h-32 bg-gray-200 mb-2 rounded"></div>
            <h2 className="font-semibold">Sản phẩm {id}</h2>
            <p className="text-[var(--color-accent-blue)]">100.000 đ</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
