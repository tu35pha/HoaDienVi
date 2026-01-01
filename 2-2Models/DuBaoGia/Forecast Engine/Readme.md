## 📂 Cấu trúc Dự án (Project Structure)

Sơ đồ tổ chức file của hệ thống **Forecast Engine**:

```text
Forecast Engine/
│
├── 📂 Data/                        
│   │
│   ├── 📂 Raw data/                   # [Input] Dữ liệu thô: dữ liệu Sentio được mô phỏng lại từ bộ dữ liệu của BTC
│   │   ├── 📄 dim_product.csv : Chi tiết sản phẩm
│   │   ├── 📄 fact_price_history_full.csv: Lịch sử giá bán
│   │   ├── 📄 fact_user_interactions.csv: Lịch sử hành vi người dùng
│   │   └── 📄 sales.csv: Lịch sử bán hàng
│   │
│   ├── 📂 Generation Code/            # Tạo sinh dữ liệu
│   │   ├── 📓 Combine_data_forecast.ipynb: code kết hợp dữ liệu và tạo time series
│   │   └── 📓 raw_data.ipynb:code tạo sinh dữ liệu từ BTC
│   │
│   ├── 📂 Data Quality/               # [QA] Kiểm tra chất lượng dữ liệu
│   │   └── 📓 Data_Quality.ipynb
│   │
│   └── 📂 Combine data/               # [Output] Dữ liệu để train model
│       └── 📊 weekly_data_final.csv
│
├── 📂 EDA_Experiment/                 # Phân tích thuộc tính & Thử nghiệm mô hình
│   └── 📓 eda_experiment.ipynb        # 
│
└── 📂 LightGBM Model/                 # Lưu trữ mô hình
    ├── 📦 category_encoder_v1.pkl     # Object mã hóa (Encoder)
    └── 🚀 lgb_price_forecast_v1.pkl   # Model LightGBM đã huấn luyện