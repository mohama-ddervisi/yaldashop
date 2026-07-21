const app = document.getElementById("app");

app.innerHTML = `
<div class="admin-container">

    <div class="admin-header">
      <h1>داشبورد مدیریت</h1>

<p>خوش آمدید. وضعیت کلی فروشگاه را از اینجا مشاهده کنید.</p>

<div class="dashboard-grid">

    <div class="stat-card">
        <h2>520</h2>
        <p>محصول</p>
    </div>

    <div class="stat-card">
        <h2>18</h2>
        <p>سفارش امروز</p>
    </div>

    <div class="stat-card">
        <h2>146</h2>
        <p>کاربر</p>
    </div>

    <div class="stat-card">
        <h2>12M</h2>
        <p>فروش امروز</p>
    </div>

</div>
    </div>

    <div class="cards">

        <a href="dashboard.html" class="card">
            📊
            <span>داشبورد</span>
        </a>

        <a href="products.html" class="card">
            📦
            <span>مدیریت محصولات</span>
        </a>

        <a href="orders.html" class="card">
            🛒
            <span>مدیریت سفارشات</span>
        </a>

        <a href="users.html" class="card">
            👤
            <span>مدیریت کاربران</span>
        </a>

        <a href="discounts.html" class="card">
            🎁
            <span>کدهای تخفیف</span>
        </a>

    </div>

</div>
`;