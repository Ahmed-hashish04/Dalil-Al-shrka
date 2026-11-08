// ============================================
// 1. دالة عرض جدول المبيعات
// ============================================
function renderSales() {
  // بنجيب كلمة البحث والتاريخ المختار من شريط الأدوات
  const term = searchInput.value.trim().toLowerCase();
  const dateFilter = filterDate.value;

  // بنفلتر المبيعات حسب البحث والتاريخ
  let filtered = sales.filter((s) => {
    const matchSearch =
      !term ||
      (s.fridge || "").toLowerCase().includes(term) ||
      (s.buyer || "").toLowerCase().includes(term) ||
      (s.item || "").toLowerCase().includes(term);
    const matchDate = !dateFilter || s.date === dateFilter;
    return matchSearch && matchDate;
  });

  // بنرتب من الأحدث للأقدم
  filtered.sort((a, b) => (a.date < b.date ? 1 : -1));

  // لو مفيش نتايج بعد الفلترة
  if (filtered.length === 0) {
    salesBody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding: 30px; color:#9ca3af;">لا توجد عمليات</td></tr>`;
    return;
  }

  // بنبني السطور ونعرضها
  salesBody.innerHTML = filtered.map((s) => `
    <tr>
      <td>${s.date || ""}</td>
      <td>${s.fridge || "-"}</td>
      <td><a href="#" onclick="showStatement('sale', '${s.buyer}'); return false;" style="color: #0f766e; text-decoration: underline; font-weight: bold;">${s.buyer || "-"}</a></td>
      <td>${s.item || "-"}</td>
      <td>${s.weight || 0} ${s.unit || ""}</td>
      <td>${s.price || 0}</td>
      <td><strong>${(s.total || 0).toFixed(2)}</strong></td>
      <td>${statusBadge(s.status)}</td>
      <td>${(s.paid || 0).toFixed(2)}</td>
      <td>${(s.remaining || 0).toFixed(2)}</td>
      <td>${s.invoice || "-"}</td>
      <td>
        <button class="btn-print" onclick="previewInvoice('sale','${s.id}')">فاتورة</button>
        <button class="btn-edit" onclick="editItem('sale','${s.id}')">تعديل</button>
        <button class="btn-delete" onclick="deleteItem('sale','${s.id}')">حذف</button>
      </td>
    </tr>
  `).join("");
}

// ============================================
// 2. دالة عرض جدول المشتريات
// ============================================
function renderPurchases() {
  // بنجيب كلمة البحث والتاريخ المختار من شريط الأدوات
  const term = searchInput.value.trim().toLowerCase();
  const dateFilter = filterDate.value;

  // بنفلتر المشتريات حسب البحث والتاريخ
  let filtered = purchases.filter((p) => {
    const matchSearch =
      !term ||
      (p.supplier || "").toLowerCase().includes(term) ||
      (p.item || "").toLowerCase().includes(term);
    const matchDate = !dateFilter || p.date === dateFilter;
    return matchSearch && matchDate;
  });

  // بنرتب من الأحدث للأقدم
  filtered.sort((a, b) => (a.date < b.date ? 1 : -1));

  // لو مفيش نتايج بعد الفلترة
  if (filtered.length === 0) {
    purchasesBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 30px; color:#9ca3af;">لا توجد عمليات</td></tr>`;
    return;
  }

  // بنبني السطور ونعرضها
  purchasesBody.innerHTML = filtered.map((p) => `
    <tr>
      <td>${p.date || ""}</td>
      <td><a href="#" onclick="showStatement('purchase', '${p.supplier}'); return false;" style="color: #0f766e; text-decoration: underline; font-weight: bold;">${p.supplier || "-"}</a></td>
      <td>${p.item || "-"}</td>
      <td>${p.weight || 0} ${p.unit || ""}</td>
      <td>${p.price || 0}</td>
      <td><strong>${(p.total || 0).toFixed(2)}</strong></td>
      <td>${statusBadge(p.status)}</td>
      <td>${(p.paid || 0).toFixed(2)}</td>
      <td>${(p.remaining || 0).toFixed(2)}</td>
      <td>${p.invoice || "-"}</td>
      <td>
        <button class="btn-print" onclick="previewInvoice('purchase','${p.id}')">فاتورة</button>
        <button class="btn-edit" onclick="editItem('purchase','${p.id}')">تعديل</button>
        <button class="btn-delete" onclick="deleteItem('purchase','${p.id}')">حذف</button>
      </td>
    </tr>
  `).join("");
}

// ============================================
// 3. دالة عرض جدول العملاء والموردين (الرصيد الافتتاحي)
// ============================================
function renderAccounts() {
  // لو مفيش عملاء أو موردين مسجلين
  if (accounts.length === 0) {
    accountsBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color:#9ca3af;">لا يوجد عملاء أو موردين مسجلين</td></tr>`;
    return;
  }

  // بنبني سطور الجدول
  accountsBody.innerHTML = accounts.map((acc) => `
    <tr>
      <td>${acc.name}</td>
      <td>${acc.type === "customer" ? "عميل" : "مورد"}</td>
      <td><strong>${(acc.balance || 0).toFixed(2)}</strong> جنيه</td>
      <td>${acc.notes || "-"}</td>
      <td>
        <button class="btn-delete" onclick="deleteAccount('${acc.id}')">حذف</button>
      </td>
    </tr>
  `).join("");
}

// ============================================
// 4. دالة عرض جدول المصروفات
// ============================================
function renderExpenses() {
  // لو مفيش مصروفات متسجلة
  if (expenses.length === 0) {
    expensesBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color:#9ca3af;">لا توجد مصروفات</td></tr>`;
    return;
  }

  // بنبني سطور الجدول
  expensesBody.innerHTML = expenses.map((exp) => `
    <tr>
      <td>${exp.date || ""}</td>
      <td>${exp.type || "-"}</td>
      <td><strong>${(exp.amount || 0).toFixed(2)}</strong> جنيه</td>
      <td>${exp.notes || "-"}</td>
      <td>
        <button class="btn-delete" onclick="deleteExpense('${exp.id}')">حذف</button>
      </td>
    </tr>
  `).join("");
}

// ============================================
// 5. دالة بتحدد شكل "شارة" الحالة (نقدي/آجل)
// ============================================
function statusBadge(status) {
  if (status === "cash") {
    return `<span class="badge badge-cash">نقدي</span>`;
  }
  return `<span class="badge badge-credit">آجل</span>`;
}

// ============================================
// 6. دالة بتعرض الجدول المناسب حسب التاب الحالي
// ============================================
function renderTable() {
  if (currentTab === "sales") {
    renderSales();
  } else if (currentTab === "purchases") {
    renderPurchases();
  } else if (currentTab === "accounts") {
    renderAccounts();
  } else if (currentTab === "expenses") {
    renderExpenses();
  }
}

// ============================================
// 7. دالة تحديث الإحصائيات (اللي فوق)
// ============================================
function updateStats() {
  const today = todayStr(); // تاريخ النهاردة
  const arr = currentArray(); // المصفوفة اللي إحنا واقفين عليها
  const todayItems = arr.filter((x) => x.date === today); // عمليات النهاردة

  // 1. مجموع إجمالي النهاردة
  const total = todayItems.reduce((sum, x) => sum + (x.total || 0), 0);
  
  // 2. الآجل الكلي (المنفصل)
  // بنجمع آجل المبيعات لوحده، وآجل المشتريات لوحده
  const salesDebt = sales.reduce((sum, x) => sum + (x.remaining || 0), 0);
  const purchasesDebt = purchases.reduce((sum, x) => sum + (x.remaining || 0), 0);
  
  // 3. تغيير النصوص حسب التاب
  statLabel.textContent = currentTab === "sales" ? "مبيعات النهاردة" : "مشتريات النهاردة";
  debtLabel.textContent = currentTab === "sales" ? "آجل المبيعات الكلي" : "آجل المشتريات الكلي";

  // 4. عرض الأرقام
  todayTotal.textContent = total.toFixed(2);
  todayCount.textContent = todayItems.length;
  
  // عرض الآجل المناسب حسب التاب
  if (currentTab === "sales") {
    todayDebt.textContent = salesDebt.toFixed(2);
  } else {
    todayDebt.textContent = purchasesDebt.toFixed(2);
  }
}

// ============================================
// 8. دالة التبديل بين التبويبات (المبيعات / المشتريات / العملاء / المصروفات)
// ============================================
function switchTab(tabName) {
  // بنغير المتغير اللي بيعرفنا إحنا فين
  currentTab = tabName;

  // بنغير لون التاب النشط
  tabs.forEach((t) => {
    t.classList.toggle("active", t.dataset.tab === tabName);
  });

  // 1. نخفي كل الجداول وشريط الأدوات والإحصائيات الأول
  salesTableContainer.classList.add("hidden");
  purchasesTableContainer.classList.add("hidden");
  accountsTableContainer.classList.add("hidden");
  expensesTableContainer.classList.add("hidden");
  document.querySelector(".toolbar").classList.add("hidden");
  document.querySelector(".stats").classList.add("hidden");
  
  // 2. نظهر الشاشة المطلوبة حسب التاب
  if (tabName === "sales") {
    salesTableContainer.classList.remove("hidden");
    document.querySelector(".toolbar").classList.remove("hidden"); // نظهر الأدوات
    document.querySelector(".stats").classList.remove("hidden");  // نظهر الإحصائيات
    renderSales();
    updateStats();
  } else if (tabName === "purchases") {
    purchasesTableContainer.classList.remove("hidden");
    document.querySelector(".toolbar").classList.remove("hidden"); // نظهر الأدوات
    document.querySelector(".stats").classList.remove("hidden");  // نظهر الإحصائيات
    renderPurchases();
    updateStats();
  } else if (tabName === "accounts") {
    // في تاب العملاء، بنظهر جدول العملاء بس، ونخفي الأدوات والإحصائيات
    accountsTableContainer.classList.remove("hidden"); 
    renderAccounts(); 
  } else if (tabName === "expenses") {
    // في تاب المصروفات، بنظهر جدول المصروفات بس، ونخفي الأدوات والإحصائيات
    expensesTableContainer.classList.remove("hidden");
    renderExpenses();
  }
  
  // بنفضي خانات البحث والفلتر
  searchInput.value = "";
  filterDate.value = "";
}