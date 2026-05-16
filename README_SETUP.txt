==============================================
      SMART PHARMACY - Setup Instructions
==============================================

⚠️  IMPORTANT: قبل التشغيل عدّل ملف backend/.env
    غيّر MONGO_URI بكلمة سر MongoDB الصحيحة

----------------------------------------------
تشغيل عادي:
----------------------------------------------
1- Backend:
   cd backend
   npm install
   npm start
   ← يعمل على http://localhost:5001

2- Frontend:
   cd frontend
   npm install
   npm start
   ← يعمل على http://localhost:3000

----------------------------------------------
تشغيل بـ Docker:
----------------------------------------------
docker-compose up --build

----------------------------------------------
إنشاء Admin في MongoDB:
----------------------------------------------
أدخل هذا المستند في collection "users":
{
  "username": "Admin",
  "email": "admin@pharmacy.com",
  "phone": "99999999",
  "age": 30,
  "password": "$2b$10$...",   ← hash كلمة السر
  "role": "admin"
}
أو استخدم endpoint /register مع إضافة role:"admin" يدوياً

----------------------------------------------
الصفحات:
----------------------------------------------
/ → Landing Page
/login → User Login
/admin/login → Admin Login
/register → Register
/home → Products (بعد تسجيل الدخول)
/admin/products → Admin Panel
/cart → Cart
/checkout → Checkout
/payment → Payment
/my-orders → My Orders
/profile → Profile
/my-list → Saved Products

==============================================
