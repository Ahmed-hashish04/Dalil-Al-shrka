// ============================================
// 1. حالة البرنامج (المتغيرات الأساسية)
// ============================================

// مصفوفة بتشيل كل عمليات المبيعات
let sales = [];
// مصفوفة بتشيل كل عمليات المشتريات
let purchases = [];
// مصفوفة بتشيل العملاء والموردين (الرصيد الافتتاحي)
let accounts = [];

// متغير بيحدد إحنا واقفين في أنهي تاب دلوقتي (مبيعات أو مشتريات أو عملاء)
let currentTab = "sales";

// متغيرات بنستخدمها لما نيجي نعدل عملية (بنشيل فيها رقم العملية)
let editingId = null;
let editingType = null;

// مصفوفة عشان نخزن فيها كل المصروفات
let expenses = [];


// ============================================
// 2. عناصر الصفحة (عشان نقدر نتحكم فيها من الجافاسكريبت)
// ============================================

// شاشات
const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const loadingScreen = document.getElementById("loading-screen");

// أزرار الدخول والخروج
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginError = document.getElementById("login-error");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// التبويبات (المبيعات والمشتريات والعملاء)
const tabs = document.querySelectorAll(".tab");

// الإحصائيات (اللي فوق)
const statLabel = document.getElementById("stat-label");
const todayTotal = document.getElementById("today-total");
const todayCount = document.getElementById("today-count");
const debtLabel = document.getElementById("debt-label");
const todayDebt = document.getElementById("today-debt");

// شريط الأدوات (إضافة، بحث، فلتر، تصدير)
const addBtn = document.getElementById("add-btn");
const searchInput = document.getElementById("search");
const filterDate = document.getElementById("filter-date");
const clearFilterBtn = document.getElementById("clear-filter");
const exportBtn = document.getElementById("export-btn");

// الجداول (أجسام الجداول والحاويات)
const salesBody = document.getElementById("sales-body");
const purchasesBody = document.getElementById("purchases-body");
const salesTableContainer = document.getElementById("sales-table-container");
const purchasesTableContainer = document.getElementById("purchases-table-container");

// نافذة إضافة/تعديل العمليات (المبيعات والمشتريات)
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const inputDate = document.getElementById("input-date");
const fridgeRow = document.getElementById("fridge-row");
const inputFridge = document.getElementById("input-fridge");
const personRow = document.getElementById("person-row");
const personLabel = document.getElementById("person-label");
const inputPerson = document.getElementById("input-person");
const inputItem = document.getElementById("input-item");
const inputWeight = document.getElementById("input-weight");
const inputUnit = document.getElementById("input-unit");
const inputPrice = document.getElementById("input-price");
const previewTotal = document.getElementById("preview-total");
const inputStatus = document.getElementById("input-status");
const paidRow = document.getElementById("paid-row");
const inputPaid = document.getElementById("input-paid");
const previewRemaining = document.getElementById("preview-remaining");
const inputInvoice = document.getElementById("input-invoice");
const inputNotes = document.getElementById("input-notes");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

// عناصر شاشة العملاء والموردين
const accountsBody = document.getElementById("accounts-body");
const accountsTableContainer = document.getElementById("accounts-table-container");
const addAccountBtn = document.getElementById("add-account-btn");
const accountModal = document.getElementById("account-modal");
const saveAccBtn = document.getElementById("save-acc-btn");
const cancelAccBtn = document.getElementById("cancel-acc-btn");
const accName = document.getElementById("acc-name");
const accType = document.getElementById("acc-type");
const accBalance = document.getElementById("acc-balance");
const accNotes = document.getElementById("acc-notes");

// بنجيب عناصر شاشة المصروفات من الـ HTML
const expensesBody = document.getElementById("expenses-body"); // جسم الجدول
const expensesTableContainer = document.getElementById("expenses-table-container"); // الشاشة كلها
const addExpenseBtn = document.getElementById("add-expense-btn"); // زرار الإضافة
const expenseModal = document.getElementById("expense-modal"); // النافذة المنبثقة
const saveExpBtn = document.getElementById("save-exp-btn"); // زرار الحفظ
const cancelExpBtn = document.getElementById("cancel-exp-btn"); // زرار الإلغاء
const expType = document.getElementById("exp-type"); // خانة نوع المصروف
const expAmount = document.getElementById("exp-amount"); // خانة المبلغ
const expNotes = document.getElementById("exp-notes"); // خانة الملاحظات
// ============================================
// 3. دوال مساعدة (بنستخدمها في أكتر من مكان)
// ============================================

// ترجع تاريخ النهاردة بصيغة YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// بتحسب الإجمالي (الكمية × قيمة الوحدة × السعر)
function calcTotal(weight, unitValue, price) {
  return (parseFloat(weight) || 0) * (parseFloat(unitValue) || 1) * (parseFloat(price) || 0);
}

// بترجع المصفوفة اللي إحنا شغالين عليها حسب التاب الحالي
function currentArray() {
  return currentTab === "sales" ? sales : purchases;
}


// ============================================
// 4. دالة تحميل البيانات من Firebase
// ============================================
function loadFromFirebase() {
  
  // 1. تحميل المبيعات (Real-time)
  db.collection("sales").onSnapshot((snapshot) => {
    // بنجيب البيانات، وبنستبعد أي عملية متعلم عليها إنها محذوفة
    sales = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.isDeleted !== true); 
      
    // لو إحنا واقفين في تاب المبيعات، بنحدث الجدول
    if (currentTab === "sales") renderTable();
    // بنحدث الأرقام فوق
    updateStats();
    
    // أول ما البيانات توصل، بنخفي شاشة التحميل
    loadingScreen.classList.add("hidden"); 
  });

  // 2. تحميل المشتريات (Real-time)
  db.collection("purchases").onSnapshot((snapshot) => {
    purchases = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.isDeleted !== true);
      
    // لو إحنا واقفين في تاب المشتريات، بنحدث الجدول
    if (currentTab === "purchases") renderTable();
    // بنحدث الأرقام فوق
    updateStats();
  });

  // 3. تحميل العملاء والموردين (Real-time)
  db.collection("accounts").onSnapshot((snapshot) => {
    accounts = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.isDeleted !== true);
      
    // لو إحنا واقفين في تاب العملاء، بنحدث الجدول
    if (currentTab === "accounts") renderAccounts();
  });
  // تحميل المصروفات لحظياً
db.collection("expenses").onSnapshot((snapshot) => {
  // بناخد البيانات ونشيل أي مصروف متعلم عليه إنه محذوف
  expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((item) => item.isDeleted !== true);
  
  // لو إحنا واقفين في تاب المصروفات، بنحدث الجدول
  if (currentTab === "expenses") renderExpenses();
});
}