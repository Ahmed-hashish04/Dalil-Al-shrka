// ============================================
// 1. الدخول والخروج
// ============================================

// بنختار زرار الدخول ونستنى لما المستخدم يدوس عليه
loginBtn.addEventListener("click", () => {
  // بناخد الإيميل اللي المستخدم كتبه ونشيل المسافات الزيادة
  const email = emailInput.value.trim();
  // بناخد الباسورد اللي المستخدم كتبه ونشيل المسافات
  const password = passwordInput.value.trim();

  // لو الإيميل أو الباسورد فاضيين
  if (!email || !password) {
    // بنظهر رسالة للمستخدم إنه لازم يكمل البيانات
    loginError.textContent = "من فضلك اكتب الإيميل والباسورد";
    // بنوقف تنفيذ الكود هنا
    return;
  }

  // بنروح لـ Firebase نسأله هل الإيميل والباسورد دول صح؟
  auth.signInWithEmailAndPassword(email, password)
    // لو Firebase قال إن البيانات صح
    .then(() => {
      // بنمسح أي رسالة خطأ قديمة
      loginError.textContent = "";
      // بننقل المستخدم للشاشة الرئيسية
      showMainScreen();
    })
    // لو Firebase قال إن البيانات غلط
    .catch(() => {
      // بنظهر رسالة إن البيانات غلط
      loginError.textContent = "الإيميل أو الباسورد غلط";
    });
});

// بنختار زرار الخروج ونستنى لما المستخدم يدوس عليه
logoutBtn.addEventListener("click", () => {
  // بنسجل خروج من Firebase
  auth.signOut().then(() => {
    // بننقل المستخدم لشاشة الدخول
    showLoginScreen();
  });
});

// دالة بتظهر شاشة الدخول وتخفي الشاشة الرئيسية
function showLoginScreen() {
  // بنشيل كلاس "hidden" من شاشة الدخول عشان تظهر
  loginScreen.classList.remove("hidden");
  // بنضيف كلاس "hidden" للشاشة الرئيسية عشان تختفي
  mainScreen.classList.add("hidden");
  // بنفضي خانة الإيميل
  emailInput.value = "";
  // بنفضي خانة الباسورد
  passwordInput.value = "";
  // بنمسح أي رسالة خطأ
  loginError.textContent = "";
}

// دالة بتظهر الشاشة الرئيسية وتخفي شاشة الدخول
function showMainScreen() {
  // بنخفي شاشة الدخول
  loginScreen.classList.add("hidden");
  // بنظهر الشاشة الرئيسية
  mainScreen.classList.remove("hidden");
  // بننادي دالة switchTab عشان نفتح تاب المبيعات أول ما ندخل
  switchTab("sales");
}

// ============================================
// 2. التبويبات
// ============================================

// بنختار كل التبويبات اللي في الصفحة (الزرار اللي فوق)
tabs.forEach((tab) => {
  // بنستنى لما المستخدم يدوس على أي تبويب منهم
  tab.addEventListener("click", () => {
    // بننادي دالة switchTab ونبعتلها اسم التاب اللي إتداس عليه
    switchTab(tab.dataset.tab);
  });
});

// ============================================
// 3. نافذة إضافة/تعديل العمليات
// ============================================

// بنختار زرار "إضافة عملية" ونستنى لما يدوس عليه
addBtn.addEventListener("click", () => {
  // بنصفّر رقم العملية اللي بنعدلها (عشان دي إضافة جديدة)
  editingId = null;
  // بنصفّر نوع العملية
  editingType = null;
  // بنغير عنوان النافذة حسب إحنا في مبيعات ولا مشتريات
  modalTitle.textContent = currentTab === "sales" ? "إضافة عملية بيع" : "إضافة عملية شراء";
  // بنظبط شكل النافذة (نخفي التلاجة في المشتريات، ونظهرها في المبيعات)
  setupModalForTab(currentTab);
  // بنفضي كل الخانات عشان يكتب بيانات جديدة
  clearModalFields();
  // بنجيب رقم الفاتورة الجديد من قاعدة البيانات
  getNextInvoiceNumber().then(num => {
    // بنحط رقم الفاتورة في الخانة
    inputInvoice.value = num;
  });
  // بنظهر النافذة
  modal.classList.remove("hidden");
});

// دالة بتظبط شكل النافذة حسب نوع التاب
function setupModalForTab(tab) {
  // لو إحنا في المبيعات
  if (tab === "sales") {
    // بنظهر خانة اسم التلاجة
    fridgeRow.classList.remove("hidden");
    // بنظهر خانة اسم الزبون
    personRow.classList.remove("hidden");
    // بنغير اسم الخانة لـ "اسم الزبون"
    personLabel.textContent = "اسم الزبون";
    // بنغير النص اللي جوه الخانة
    inputPerson.placeholder = "اسم الزبون";
  } else {
    // لو إحنا في المشتريات، بنخفي خانة التلاجة
    fridgeRow.classList.add("hidden");
    // بنظهر خانة المورد
    personRow.classList.remove("hidden");
    // بنغير اسم الخانة لـ "اشترينا من"
    personLabel.textContent = "اشترينا من";
    // بنغير النص اللي جوه الخانة
    inputPerson.placeholder = "اسم المورد";
  }
}

// دالة بتفضي كل خانات النافذة
function clearModalFields() {
  // بنحط تاريخ النهاردة
  inputDate.value = todayStr();
  // بنفضي خانة التلاجة
  inputFridge.value = "";
  // بنفضي خانة الزبون
  inputPerson.value = "";
  // بنفضي خانة الصنف
  inputItem.value = "";
  // بنفضي خانة الوزن
  inputWeight.value = "";
  // بنرجع الوحدة لـ "طن"
  inputUnit.value = "1";
  // بنفضي خانة السعر
  inputPrice.value = "";
  // بنرجع الحالة لـ "نقدي"
  inputStatus.value = "cash";
  // بنفضي خانة المدفوع
  inputPaid.value = "";
  // بنفضي خانة رقم الفاتورة
  inputInvoice.value = "";
  // بنفضي خانة الملاحظات
  inputNotes.value = "";
  // بنرجع الإجمالي لـ "0"
  previewTotal.textContent = "0";
  // بنرجع الباقي لـ "0"
  previewRemaining.textContent = "0";
  // بنخفي خانة المدفوع (عشان الحالة نقدي)
  updatePaidRow();
}

// بنختار زرار الإلغاء ونستنى لما يدوس عليه
cancelBtn.addEventListener("click", () => {
  // بنخفي النافذة
  modal.classList.add("hidden");
});

// ============================================
// 4. الحسابات التلقائية
// ============================================

// دالة بتحسب الإجمالي والباقي وتظهرهم في النافذة
function updatePreview() {
  // بنحسب الإجمالي (الوزن × قيمة الوحدة × السعر)
  const total = calcTotal(inputWeight.value, inputUnit.value, inputPrice.value);
  // بنعرض الإجمالي في الشاشة
  previewTotal.textContent = total.toFixed(2);

  // بنجهز متغير للباقي ونخليه صفر
  let remaining = 0;
  // لو الحالة "آجل"
  if (inputStatus.value === "credit") {
    // بناخد المبلغ اللي المستخدم كتبه في خانة المدفوع
    const paid = parseFloat(inputPaid.value) || 0;
    // بنحسب الباقي = الإجمالي - المدفوع
    remaining = total - paid;
    // لو الباقي طلع رقم سالب (يعني دفع زيادة) بنخليه صفر
    if (remaining < 0) remaining = 0;
  }
  // بنعرض الباقي في الشاشة
  previewRemaining.textContent = remaining.toFixed(2);
}

// بنربط دالة الحساب بخانة الوزن (كل ما يتغير الوزن يحسب)
inputWeight.addEventListener("input", updatePreview);
// بنربطها بخانة الوحدة
inputUnit.addEventListener("change", updatePreview);
// بنربطها بخانة السعر
inputPrice.addEventListener("input", updatePreview);
// بنربطها بخانة المدفوع
inputPaid.addEventListener("input", updatePreview);

// لو المستخدم غير الحالة من نقدي لآجل أو العكس
inputStatus.addEventListener("change", () => {
  // بنحدث شكل خانة المدفوع
  updatePaidRow();
  // بنعيد الحساب
  updatePreview();
});

// دالة بتخفي أو بتظهر خانة "المدفوع" حسب الحالة
function updatePaidRow() {
  // لو الحالة "نقدي"
  if (inputStatus.value === "cash") {
    // بنخفي خانة المدفوع
    paidRow.classList.add("hidden");
    // بنفضي قيمتها
    inputPaid.value = "";
  } else {
    // لو الحالة "آجل" بنظهر خانة المدفوع
    paidRow.classList.remove("hidden");
  }
}

// ============================================
// 5. الحفظ
// ============================================

// زرار الحفظ (المسؤول عن إضافة أو تعديل الفاتورة)
saveBtn.addEventListener("click", () => {
  // بنعطل زرار الحفظ عشان نمنع تكرار الضغط
  saveBtn.disabled = true;
  // بنغير النص اللي عليه لـ "جاري الحفظ..."
  saveBtn.textContent = "جاري الحفظ...";

  // بنسحب القيمة اللي في خانة التاريخ
  const date = inputDate.value;
  // بنسحب اسم التلاجة
  const fridge = inputFridge.value.trim();
  // بنسحب اسم الشخص (زبون أو مورد)
  const person = inputPerson.value.trim();
  // بنسحب الصنف
  const item = inputItem.value.trim();
  // بنحول الوزن لرقم (لو فاضي يبقى 0)
  const weight = parseFloat(inputWeight.value) || 0;
  // بناخد قيمة الوحدة (طن / نص طن)
  const unitValue = parseFloat(inputUnit.value) || 1;
  // بناخد اسم الوحدة كنص (عشان يظهر في الفاتورة)
  const unitText = inputUnit.options[inputUnit.selectedIndex].text;
  // بنحول السعر لرقم
  const price = parseFloat(inputPrice.value) || 0;
  // بناخد حالة الدفع (نقدي/آجل)
  const status = inputStatus.value;
  // بنسحب رقم الفاتورة
  const invoice = inputInvoice.value.trim();
  // بنسحب الملاحظات
  const notes = inputNotes.value.trim();

  // لو أي خانة من الأساسيات فاضية
  if (!date || !person || !item || weight <= 0 || price <= 0) {
    // بنظهر تنبيه
    alert("من فضلك اكمل كل الخانات المطلوبة");
    // بنرجع الزرار شغال تاني
    saveBtn.disabled = false;
    // بنرجع النص بتاعه
    saveBtn.textContent = "حفظ";
    // بنوقف عملية الحفظ
    return;
  }

  // لو إحنا في المبيعات ومفيش اسم تلاجة
  if (currentTab === "sales" && !fridge) {
    // بنظهر تنبيه
    alert("من فضلك اكتب اسم التلاجة");
    // بنرجع الزرار شغال
    saveBtn.disabled = false;
    // بنرجع النص بتاعه
    saveBtn.textContent = "حفظ";
    // بنوقف الحفظ
    return;
  }

  // بنحسب الإجمالي
  const total = calcTotal(weight, unitValue, price);

  // بنجهز قيمة "المدفوع" وتكون مساوية للإجمالي (يعني نقدي)
  let paid = total;
  // بنجهز قيمة "الباقي" وتكون 0
  let remaining = 0;

  // لو الحالة "آجل"
  if (status === "credit") {
    // بناخد المبلغ اللي المستخدم كتبه في خانة المدفوع
    paid = parseFloat(inputPaid.value) || 0;
    // لو المدفوع أكبر من الإجمالي
    if (paid > total) {
      // بنظهر تنبيه
      alert("خطأ: المبلغ المدفوع لا يمكن أن يكون أكبر من إجمالي الفاتورة!");
      // بنرجع الزرار شغال
      saveBtn.disabled = false;
      // بنرجع النص بتاعه
      saveBtn.textContent = "حفظ";
      // بنوقف الحفظ
      return;
    }
    // بنحسب الباقي
    remaining = total - paid;
    // لو الباقي سالب نرجعه صفر
    if (remaining < 0) remaining = 0;
  }

  // بنجهز البيانات اللي هتتحفظ في Firebase
  const record = {
    date: date,          // التاريخ
    item: item,          // الصنف
    weight: weight,      // الوزن
    unit: unitText,      // اسم الوحدة
    unitValue: unitValue,// قيمة الوحدة
    price: price,        // السعر
    total: total,        // الإجمالي
    status: status,      // الحالة
    paid: paid,          // المدفوع
    remaining: remaining,// الباقي
    invoice: invoice,    // رقم الفاتورة
    notes: notes,        // الملاحظات
    createdBy: auth.currentUser ? auth.currentUser.email : "unknown", // مين عمل العملية
  };

  // لو إحنا في المبيعات
  if (currentTab === "sales") {
    // بنضيف اسم التلاجة
    record.fridge = fridge;
    // بنضيف اسم الزبون
    record.buyer = person;
  } else {
    // لو في المشتريات، بنضيف اسم المورد
    record.supplier = person;
  }

  // بنحدد اسم الجدول اللي هنحفظ فيه (مبيعات ولا مشتريات)
  const collectionName = currentTab === "sales" ? "sales" : "purchases";

  // لو إحنا بنعدل عملية موجودة (مش بنضيف جديدة)
  if (editingId) {
    // بنروح لـ Firebase، وبنختار السجل اللي بالـ ID بتاعه، وبنحدثه بالبيانات الجديدة
    db.collection(collectionName).doc(editingId).update(record)
      // لو التحديث نجح
      .then(() => {
        // بنرجع الزرار شغال
        saveBtn.disabled = false;
        // بنرجع النص
        saveBtn.textContent = "حفظ";
        // بنخفي النافذة
        modal.classList.add("hidden");
        // بنحدث الجدول
        renderTable();
        // بنحدث الإحصائيات
        updateStats();
      })
      // لو حصل خطأ
      .catch((error) => {
        // بنرجع الزرار
        saveBtn.disabled = false;
        // بنرجع النص
        saveBtn.textContent = "حفظ";
        // بنظهر رسالة الخطأ
        alert("خطأ في التعديل: " + error.message);
      });
  } else {
    // لو إحنا بنضيف عملية جديدة
    db.collection(collectionName).add(record)
      // لو الإضافة نجحت
      .then(() => {
        // بنرجع الزرار شغال
        saveBtn.disabled = false;
        // بنرجع النص
        saveBtn.textContent = "حفظ";
        // بنخفي النافذة
        modal.classList.add("hidden");
        // بنحدث الجدول
        renderTable();
        // بنحدث الإحصائيات
        updateStats();
        // بنظهر رسالة نجاح فيها رقم الفاتورة
        alert(`تم حفظ الفاتورة رقم ${invoice} بنجاح`);
      })
      // لو حصل خطأ في الإضافة
      .catch((error) => {
        // بنرجع الزرار
        saveBtn.disabled = false;
        // بنرجع النص
        saveBtn.textContent = "حفظ";
        // بنظهر رسالة الخطأ
        alert("خطأ في الإضافة: " + error.message);
      });
  }
});

// ============================================
// 6. التعديل والحذف
// ============================================

// دالة التعديل (بتتنادى لما تدوس على زرار تعديل في الجدول)
window.editItem = function (type, id) {
  // بنختار المصفوفة (مبيعات ولا مشتريات) حسب النوع
  const arr = type === "sale" ? sales : purchases;
  // بندور على العملية اللي بالـ ID ده
  const record = arr.find((x) => x.id === id);
  // لو مش لاقيها بنوقف
  if (!record) return;

  // بنحفظ الـ ID عشان نعرف إننا بنعدل
  editingId = id;
  // بنحفظ النوع
  editingType = type;
  // بنغير التاب الحالي للنوع ده
  currentTab = type === "sale" ? "sales" : "purchases";
  // بننادي دالة switchTab
  switchTab(currentTab);

  // بنغير عنوان النافذة
  modalTitle.textContent = type === "sale" ? "تعديل عملية بيع" : "تعديل عملية شراء";
  // بنظبط شكل النافذة
  setupModalForTab(currentTab);

  // بنملى الخانات ببيانات العملية
  inputDate.value = record.date;
  inputFridge.value = record.fridge || "";
  inputPerson.value = record.buyer || record.supplier || "";
  inputItem.value = record.item || "";
  inputWeight.value = record.weight;
  inputUnit.value = record.unitValue || "1";
  inputPrice.value = record.price;
  inputStatus.value = record.status || "cash";
  inputPaid.value = record.paid || "";
  inputInvoice.value = record.invoice || "";
  inputNotes.value = record.notes || "";

  // بنظبط شكل خانة المدفوع
  updatePaidRow();
  // بنعيد الحسابات
  updatePreview();
  // بنظهر النافذة
  modal.classList.remove("hidden");
};

// دالة الحذف الآمن (بتتنادى لما تدوس على زرار حذف)
window.deleteItem = function (type, id) {
  // بنسأل المستخدم للتأكيد
  if (!confirm("متأكد إنك عايز تحذف العملية دي؟")) return;
  // بنحدد اسم الجدول
  const collectionName = type === "sale" ? "sales" : "purchases";
  // بنجيب إيميل اللي بيمسح
  const userEmail = auth.currentUser ? auth.currentUser.email : "unknown";
  // بنروح للسجل في Firebase ونحط عليه علامة إنه محذوف
  db.collection(collectionName).doc(id).update({
    isDeleted: true, // علامة إنه محذوف
    deletedBy: userEmail, // مين مسحه
    deletedAt: new Date().toLocaleString("ar-EG") // وقت المسح
  }).catch((error) => {
    // لو حصل خطأ، بنظهر رسالة
    alert("حصل خطأ أثناء الحذف: " + error.message);
  });
};

// ============================================
// 7. البحث والفلتر
// ============================================

// بنربط البحث بخانة البحث
searchInput.addEventListener("input", renderTable);
// بنربط الفلتر بخانة التاريخ
filterDate.addEventListener("change", renderTable);

// زرار مسح الفلتر
clearFilterBtn.addEventListener("click", () => {
  // بنفضي خانة البحث
  searchInput.value = "";
  // بنفضي خانة التاريخ
  filterDate.value = "";
  // بنحدث الجدول
  renderTable();
});

// ============================================
// 8. تصدير Excel
// ============================================

// زرار تصدير الإكسيل
exportBtn.addEventListener("click", () => {
  // بنجيب البيانات من المصفوفة الحالية
  const arr = currentArray();
  // لو مفيش بيانات، بنظهر تنبيه
  if (arr.length === 0) { alert("مفيش بيانات للتصدير"); return; }
  // بنجهز البيانات بشكل مناسب للإكسيل
  const data = arr.map((x) => ({
    "التاريخ": x.date,
    "التلاجة": x.fridge || "",
    "الزبون/المورد": x.buyer || x.supplier || "",
    "الصنف": x.item || "",
    "الكمية": x.weight + " " + x.unit,
    "السعر": x.price,
    "الإجمالي": x.total,
    "الحالة": x.status === "cash" ? "نقدي" : "آجل",
    "المدفوع": x.paid || 0,
    "الباقي": x.remaining || 0,
    "فاتورة": x.invoice || "",
    "ملاحظات": x.notes || "",
  }));
  // بنعمل ملف الإكسيل
  const ws = XLSX.utils.json_to_sheet(data);
  // بنعمل الكتاب
  const wb = XLSX.utils.book_new();
  // بنضيف الورقة للكتاب
  XLSX.utils.book_append_sheet(wb, ws, currentTab === "sales" ? "المبيعات" : "المشتريات");
  // بنجهز اسم الملف
  const fileName = (currentTab === "sales" ? "المبيعات" : "المشتريات") + "_" + todayStr() + ".xlsx";
  // بننزل الملف
  XLSX.writeFile(wb, fileName);
});

// ============================================
// 9. معاينة الفاتورة
// ============================================

// دالة معاينة الفاتورة
window.previewInvoice = function (type, id) {
  // بنجيب المصفوفة حسب النوع
  const arr = type === "sale" ? sales : purchases;
  // بندور على العملية بالـ ID
  const rec = arr.find((x) => x.id === id);
  // لو مش لاقيها بنوقف
  if (!rec) return;

  // بنحدد اسم الشخص (زبون ولا مورد)
  const personLabel = type === "sale" ? "الزبون" : "المورد";
  // بنجيب اسم الشخص
  const personName = rec.buyer || rec.supplier || "";

  // بنجهز HTML بتاع الفاتورة
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة - ${rec.invoice || rec.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; direction: rtl; color: #1f2937; }
        h1 { color: #0f766e; text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0f766e; padding-bottom: 15px; }
        .info { margin: 10px 0; font-size: 15px; }
        .info strong { display: inline-block; min-width: 120px; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: right; }
        th { background: #0f766e; color: white; }
        .totals { margin-top: 30px; background: #ecfdf5; padding: 20px; border-radius: 8px; border: 1px solid #a7f3d0; }
        .totals .info { font-size: 16px; margin: 8px 0; }
        .totals strong { color: #065f46; }
        .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 13px; }
      </style>
    </head>
    <body>
      <button onclick="window.close()" style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-family:Arial;font-size:14px;position:fixed;top:20px;left:20px;">✕ إغلاق</button>
      <h1>فاتورة</h1>
      <div class="info"><strong>التاريخ:</strong> ${rec.date}</div>
      <div class="info"><strong>${personLabel}:</strong> ${personName}</div>
      ${rec.fridge ? `<div class="info"><strong>التلاجة:</strong> ${rec.fridge}</div>` : ""}
      <div class="info"><strong>رقم الفاتورة:</strong> ${rec.invoice || "-"}</div>
      <table>
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${rec.item}</td>
            <td>${rec.weight} ${rec.unit}</td>
            <td>${rec.price}</td>
            <td>${rec.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="totals">
        <div class="info"><strong>الإجمالي:</strong> ${rec.total.toFixed(2)} جنيه</div>
        <div class="info"><strong>المدفوع:</strong> ${(rec.paid || 0).toFixed(2)} جنيه</div>
        <div class="info"><strong>الباقي:</strong> ${(rec.remaining || 0).toFixed(2)} جنيه</div>
      </div>
      ${rec.notes ? `<div class="info" style="margin-top:20px;"><strong>ملاحظات:</strong> ${rec.notes}</div>` : ""}
      <div class="footer">شكراً لتعاملكم معنا</div>
    </body>
    </html>
  `;

  // بنفتح صفحة جديدة ونعرض فيها الفاتورة
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
};

// ============================================
// 10. التشغيل الأولي (Init)
// ============================================

// دالة التشغيل الأولى
function init() {
  // بنظهر شاشة التحميل
  loadingScreen.classList.remove("hidden");
  // بنراقب حالة الدخول
  auth.onAuthStateChanged((user) => {
    // لو فيه مستخدم مسجل
    if (user) {
      // بنظهر الشاشة الرئيسية
      showMainScreen();
      // بنجيب البيانات من Firebase
      loadFromFirebase(); 
    } else {
      // لو مفيش مستخدم، بنخفي التحميل ونظهر شاشة الدخول
      loadingScreen.classList.add("hidden");
      showLoginScreen();
    }
  });
}

// ============================================
// 11. كشف حساب عميل أو مورد
// ============================================

// دالة كشف الحساب
window.showStatement = function (type, name) {
  // لو مفيش اسم متعملش حاجة
  if (!name || name === "-") return;
  // بنجيب المصفوفة حسب النوع
  const arr = type === "sale" ? sales : purchases;
  // بنجيب عمليات الشخص ده بس
  const personItems = arr.filter(x => (type === "sale" ? x.buyer : x.supplier) === name);
  // بندور على رصيده الافتتاحي في جدول العملاء
  const accountRecord = accounts.find(a => a.name === name && (type === "sale" ? a.type === "customer" : a.type === "supplier"));
  // بنجيب قيمة الرصيد الافتتاحي
  const openingBalance = accountRecord ? accountRecord.balance : 0;
  // لو مفيش فواتير ولا رصيد افتتاحي، بنوقف
  if (personItems.length === 0 && openingBalance === 0) return;

  // بنبدأ الإجماليات بالرصيد الافتتاحي
  let totalAmount = openingBalance;
  let totalPaid = 0;
  let totalRemaining = openingBalance;

  // بنجهز سطر الرصيد الافتتاحي
  let openingRowHtml = "";
  if (openingBalance > 0) {
    openingRowHtml = `
      <tr style="background-color: #fef3c7;">
        <td>رصيد افتتاحي</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
        <td><strong>${openingBalance.toFixed(2)}</strong></td>
      </tr>
    `;
  }

  // بنجهز سطور الفواتير
  let rowsHtml = personItems.map(item => {
    totalAmount += (item.total || 0);
    totalPaid += (item.paid || 0);
    totalRemaining += (item.remaining || 0);
    return `
      <tr>
        <td>${item.date}</td><td>${item.item}</td><td>${item.weight} ${item.unit}</td>
        <td>${item.total.toFixed(2)}</td><td>${(item.paid || 0).toFixed(2)}</td><td>${(item.remaining || 0).toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  // بنجهز HTML بتاع كشف الحساب
  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>كشف حساب - ${name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; direction: rtl; color: #1f2937; }
        h1 { color: #0f766e; text-align: center; margin-bottom: 20px; }
        .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 18px; background: #f0f4f3; padding: 15px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center; }
        th, td { border: 1px solid #d1d5db; padding: 12px; }
        th { background: #0f766e; color: white; }
        .totals { margin-top: 30px; background: #ecfdf5; padding: 20px; border-radius: 8px; font-size: 18px; border: 1px solid #a7f3d0; }
        .totals div { margin: 10px 0; font-weight: bold; }
        .totals span { color: #065f46; }
      </style>
    </head>
    <body>
      <button onclick="window.close()" style="background:#ef4444;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;font-family:Arial;font-size:14px;position:fixed;top:20px;left:20px;">✕ إغلاق</button>
      <h1>كشف حساب</h1>
      <div class="header-info">
        <div><strong>الاسم:</strong> ${name}</div>
        <div><strong>النوع:</strong> ${type === "sale" ? "عميل (مبيعات)" : "مورد (مشتريات)"}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>الإجمالي</th>
            <th>المدفوع</th>
            <th>الباقي</th>
          </tr>
        </thead>
        <tbody>
          ${openingRowHtml}
          ${rowsHtml}
        </tbody>
      </table>
      <div class="totals">
        <div>إجمالي الحساب: <span>${totalAmount.toFixed(2)} جنيه</span></div>
        <div>إجمالي المدفوع: <span>${totalPaid.toFixed(2)} جنيه</span></div>
        <div style="color: #dc2626;">إجمالي المتبقي (الآجل): <span style="color: #dc2626;">${totalRemaining.toFixed(2)} جنيه</span></div>
      </div>
    </body>
    </html>
  `;

  // بنفتح صفحة جديدة ونعرض كشف الحساب
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
};

// ============================================
// 12. توليد رقم الفاتورة التلقائي
// ============================================

// دالة توليد رقم الفاتورة التلقائي
async function getNextInvoiceNumber() {
  // بنحدد مكان العداد في Firebase
  const counterRef = db.collection("counters").doc(currentTab === "sales" ? "sales_counter" : "purchases_counter");
  try {
    // بنعمل Transaction (قفل) عشان نمنع التكرار
    const newNumber = await db.runTransaction(async (transaction) => {
      // بنجيب العداد
      const doc = await transaction.get(counterRef);
      // لو مش موجود (أول مرة)
      if (!doc.exists) {
        transaction.set(counterRef, { lastNumber: 1 });
        return "1";
      }
      // لو موجود، بنجيب آخر رقم
      const currentNumber = doc.data().lastNumber || 0;
      // بنزوده واحد
      const nextNumber = currentNumber + 1;
      // بنحفظ الرقم الجديد
      transaction.update(counterRef, { lastNumber: nextNumber });
      return nextNumber.toString();
    });
    return newNumber;
  } catch (error) {
    console.error("خطأ في توليد رقم الفاتورة:", error);
    return Date.now().toString().slice(-5); 
  }
}

// ============================================
// 13. الشات بوت الذكي (Groq AI)
// ============================================

// المفتاح الجديد الخاص بـ Groq (اللي إنت جبته)
const GROQ_API_KEY = "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";

// بنختار عناصر الشات
const chatToggleBtn = document.getElementById("chat-toggle-btn");
const chatContainer = document.getElementById("chat-container");
const chatCloseBtn = document.getElementById("chat-close-btn");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");
const chatMessages = document.getElementById("chat-messages");

// فتح وقفل الشات
chatToggleBtn.addEventListener("click", () => chatContainer.classList.toggle("hidden"));
chatCloseBtn.addEventListener("click", () => chatContainer.classList.add("hidden"));
// إرسال الرسالة
chatSendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// دالة إرسال الرسالة للذكاء الاصطناعي
async function sendMessage() {
  // بناخد النص من الخانة
  const text = chatInput.value.trim();
  if (!text) return;
  // بنضيف رسالة المستخدم
  addMessageToChat(text, "user");
  chatInput.value = "";
  // بنضيف رسالة تحميل
  const loadingMsg = addMessageToChat("جاري التفكير...", "bot");
  
  // بنجهز البيانات اللي هنبعتها للذكاء الاصطناعي (شخصية البوت)
  const dataContext = `
    أنت مساعد ذكي ومحترف لشركة تجارة خضار وفاكهة.
    
    إليك بيانات الشركة الحالية:
    - بيانات المبيعات: ${JSON.stringify(sales)}
    - بيانات المشتريات: ${JSON.stringify(purchases)}
    - إجمالي الآجل المتبقي: ${document.getElementById("today-debt").innerText} جنيه.
    
    القواعد:
    1. إذا سألك المستخدم سؤالاً عاماً (مثل: مرحباً، من أنت، كيف حالك)، رد عليه بترحيب واحترافية وبدون ذكر الأرقام.
    2. إذا سألك سؤالاً يخص الشركة أو الحسابات (مثل: مبيعات النهاردة، مين عليه فلوس)، أجب بناءً على الأرقام الموجودة في البيانات فقط.
    3. لا تخترع أرقاماً من رأسك. إذا لم تجد إجابة لسؤال يخص الحسابات في البيانات، قل بوضوح "لا أملك هذه المعلومة في السجلات الحالية".
    
    سؤال المستخدم: ${text}
  `;
  
  try {
    // 1. رابط الطلب الخاص بـ Groq
    const url = "https://api.groq.com/openai/v1/chat/completions";

    // 2. إرسال الطلب
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}` // هنا بنبعت المفتاح
      }, 
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // موديل قوي ومجاني وسريع جداً
        messages: [
          // رسالة النظام (بتحدد شخصية البوت والبيانات اللي هيقراها)
          { role: "system", content: dataContext },
          // رسالة المستخدم (السؤال)
          { role: "user", content: text }
        ]
      })
    });

    // 3. استلام الرد
    const data = await response.json();
    
    let botReply = "عذراً، حدث خطأ في الاتصال.";

    // 4. التأكد من وجود إجابة
    if (data.choices && data.choices[0].message.content) {
      botReply = data.choices[0].message.content;
    } else if (data.error) {
      console.error("خطأ من Groq:", data.error);
      botReply = "خطا: + data error .message";
    }

    // عرض الرد
    loadingMsg.textContent = botReply;

  } catch (error) {
    loadingMsg.textContent = "عذراً، حدث خطأ في الاتصال. تأكد من الإنترنت.";
    console.error(error);
  }
}

// دالة إضافة رسالة في الشات
function addMessageToChat(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

// ============================================
// 14. إدارة العملاء والموردين
// ============================================

// زرار فتح شاشة إضافة عميل/مورد
addAccountBtn.addEventListener("click", () => {
  accName.value = "";
  accType.value = "customer";
  accBalance.value = "";
  accNotes.value = "";
  accountModal.classList.remove("hidden");
});

// إلغاء شاشة العميل
cancelAccBtn.addEventListener("click", () => accountModal.classList.add("hidden"));

// حفظ بيانات العميل
saveAccBtn.addEventListener("click", () => {
  saveAccBtn.disabled = true;
  saveAccBtn.textContent = "جاري الحفظ...";
  const name = accName.value.trim();
  const type = accType.value;
  const balance = parseFloat(accBalance.value) || 0;
  const notes = accNotes.value.trim();
  if (!name) {
    alert("من فضلك اكتب اسم العميل أو المورد");
    saveAccBtn.disabled = false;
    saveAccBtn.textContent = "حفظ";
    return;
  }
  db.collection("accounts").add({
    name: name,
    type: type,
    balance: balance,
    notes: notes,
    createdAt: new Date().toISOString(),
    createdBy: auth.currentUser ? auth.currentUser.email : "unknown"
  }).then(() => {
    saveAccBtn.disabled = false;
    saveAccBtn.textContent = "حفظ";
    accountModal.classList.add("hidden");
    alert("تم حفظ الرصيد الافتتاحي بنجاح");
  }).catch((error) => {
    saveAccBtn.disabled = false;
    saveAccBtn.textContent = "حفظ";
    alert("خطأ في الحفظ: " + error.message);
  });
});

// حذف عميل
window.deleteAccount = function (id) {
  if (!confirm("متأكد إنك عايز تحذف الحساب ده؟")) return;
  db.collection("accounts").doc(id).update({
    isDeleted: true,
    deletedBy: auth.currentUser ? auth.currentUser.email : "unknown",
    deletedAt: new Date().toLocaleString("ar-EG")
  }).catch((error) => alert("خطأ في الحذف: " + error.message));
};

// ============================================
// 15. إدارة المصروفات اليومية
// ============================================

// زرار فتح شاشة إضافة مصروف
addExpenseBtn.addEventListener("click", () => {
  expType.value = "";
  expAmount.value = "";
  expNotes.value = "";
  expenseModal.classList.remove("hidden");
});

// إلغاء شاشة المصروف
cancelExpBtn.addEventListener("click", () => expenseModal.classList.add("hidden"));

// حفظ المصروف
saveExpBtn.addEventListener("click", () => {
  saveExpBtn.disabled = true;
  saveExpBtn.textContent = "جاري الحفظ...";
  const type = expType.value.trim();
  const amount = parseFloat(expAmount.value) || 0;
  const notes = expNotes.value.trim();
  if (!type || amount <= 0) {
    alert("من فضلك اكتب نوع المصروف والمبلغ");
    saveExpBtn.disabled = false;
    saveExpBtn.textContent = "حفظ";
    return;
  }
  db.collection("expenses").add({
    date: todayStr(),
    type: type,
    amount: amount,
    notes: notes,
    createdBy: auth.currentUser ? auth.currentUser.email : "unknown"
  }).then(() => {
    saveExpBtn.disabled = false;
    saveExpBtn.textContent = "حفظ";
    expenseModal.classList.add("hidden");
    alert("تم حفظ المصروف بنجاح");
  }).catch((error) => {
    saveExpBtn.disabled = false;
    saveExpBtn.textContent = "حفظ";
    alert("خطأ في الحفظ: " + error.message);
  });
});

// حذف مصروف
window.deleteExpense = function (id) {
  if (!confirm("متأكد إنك عايز تحذف المصروف ده؟")) return;
  db.collection("expenses").doc(id).update({
    isDeleted: true,
    deletedBy: auth.currentUser ? auth.currentUser.email : "unknown",
    deletedAt: new Date().toLocaleString("ar-EG")
  }).catch((error) => alert("خطأ في الحذف: " + error.message));
};

// ============================================
// تشغيل البرنامج
// ============================================
init();