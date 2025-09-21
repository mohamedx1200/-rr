// العناصر الرئيسية
const filterBtn = document.getElementById("filterBtn");
const filterDiv = document.getElementById("filterdiv");
const overlay = document.getElementById("overlay");
const closeFilter = document.getElementById("closeFilter");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");

// عناصر نوع العقار
const selectedText = document.getElementById("selectedText");
const propertyIcons = document.querySelectorAll(".property-icon");
const selectionToggle = document.getElementById("selectionToggle");
const propertyIconsContainer = document.getElementById("propertyIcons");

// عناصر نوع العرض
const offerTypeSelectedText = document.getElementById("offerTypeSelectedText");
const offerTypeIcons = document.querySelectorAll(".offer-type-icon");
const offerTypeSelectionToggle = document.getElementById("offerTypeSelectionToggle");
const offerTypeIconsContainer = document.getElementById("offerTypeIcons");

// متغيرات لتخزين الاختيارات
let selectedProperties = [];
let selectedOfferTypes = [];
let iconsVisible = false;
let offerIconsVisible = false;

// --- فتح نافذة الفلترة ---
filterBtn.addEventListener("click", () => {
    filterDiv.style.display = "block";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
    hidePropertyIcons();
    hideOfferTypeIcons();
});

// --- إغلاق نافذة الفلترة ---
function closeFilterDiv() {
    filterDiv.style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
    hidePropertyIcons();
    hideOfferTypeIcons();
}

closeFilter.addEventListener("click", closeFilterDiv);
overlay.addEventListener("click", closeFilterDiv);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilterDiv();
});

// --- تبديل ظهور وإخفاء أيقونات نوع العقار ---
selectionToggle.addEventListener("click", () => {
    iconsVisible ? hidePropertyIcons() : showPropertyIcons();
});

function showPropertyIcons() {
    propertyIconsContainer.classList.add("active");
    selectionToggle.classList.add("active");
    iconsVisible = true;
}

function hidePropertyIcons() {
    propertyIconsContainer.classList.remove("active");
    selectionToggle.classList.remove("active");
    iconsVisible = false;
}

// --- تبديل ظهور وإخفاء أيقونات نوع العرض ---
offerTypeSelectionToggle.addEventListener("click", () => {
    offerIconsVisible ? hideOfferTypeIcons() : showOfferTypeIcons();
});

function showOfferTypeIcons() {
    offerTypeIconsContainer.classList.add("active");
    offerTypeSelectionToggle.classList.add("active");
    offerIconsVisible = true;
}

function hideOfferTypeIcons() {
    offerTypeIconsContainer.classList.remove("active");
    offerTypeSelectionToggle.classList.remove("active");
    offerIconsVisible = false;
}

// --- تحديد نوع العقار ---
propertyIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = icon.getAttribute("data-type");
        if (selectedProperties.includes(type)) {
            selectedProperties = selectedProperties.filter(item => item !== type);
            icon.classList.remove("selected");
        } else {
            selectedProperties.push(type);
            icon.classList.add("selected");
        }
        selectedText.textContent = selectedProperties.length > 0 ? "نوع العقار: " + selectedProperties.join("، ") : "اختر نوع العقار";
    });
});

// --- تحديد نوع العرض ---
offerTypeIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = icon.getAttribute("data-type");
        if (selectedOfferTypes.includes(type)) {
            selectedOfferTypes = selectedOfferTypes.filter(item => item !== type);
            icon.classList.remove("selected");
        } else {
            selectedOfferTypes.push(type);
            icon.classList.add("selected");
        }
        offerTypeSelectedText.textContent = selectedOfferTypes.length > 0 ? "نوع العرض: " + selectedOfferTypes.join("، ") : "اختر نوع العرض";
    });
});

// --- تطبيق الفلترة ---
applyBtn.addEventListener("click", () => {
    let msg = [];
    if (selectedProperties.length > 0) msg.push("العقارات: " + selectedProperties.join("، "));
    if (selectedOfferTypes.length > 0) msg.push("العروض: " + selectedOfferTypes.join("، "));
    if (msg.length === 0) alert("لم تقم باختيار أي فلترة");
    else alert("تم تطبيق الفلترة على: " + msg.join(" | "));
    closeFilterDiv();
});

// --- إعادة التعيين ---
resetBtn.addEventListener("click", () => {
    selectedProperties = [];
    propertyIcons.forEach(icon => icon.classList.remove("selected"));
    selectedText.textContent = "اختر نوع العقار";

    selectedOfferTypes = [];
    offerTypeIcons.forEach(icon => icon.classList.remove("selected"));
    offerTypeSelectedText.textContent = "اختر نوع العرض";

    alert("تم إعادة تعيين الفلترة");
});


// عناصر نطاق السعر
const priceSelectedText = document.getElementById("priceSelectedText");
const priceSelectionToggle = document.getElementById("priceSelectionToggle");
const priceRangeContainer = document.getElementById("priceRangeContainer");
const currencySelect = document.getElementById("currency");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

// حالة قسم السعر
let priceRangeVisible = false;

// تبديل ظهور وإخفاء نطاق السعر
priceSelectionToggle.addEventListener("click", () => {
    if (priceRangeVisible) {
        hidePriceRange();
    } else {
        showPriceRange();
        // إخفاء الأقسام الأخرى إذا كانت ظاهرة
        if (typeof propertyIconsVisible !== 'undefined' && propertyIconsVisible) hidePropertyIcons();
        if (typeof offerTypeIconsVisible !== 'undefined' && offerTypeIconsVisible) hideOfferTypeIcons();
    }
});

// إظهار وإخفاء نطاق السعر
function showPriceRange() {
    priceRangeContainer.classList.add("active");
    priceSelectionToggle.classList.add("active");
    priceRangeVisible = true;
}

function hidePriceRange() {
    priceRangeContainer.classList.remove("active");
    priceSelectionToggle.classList.remove("active");
    priceRangeVisible = false;
}

// تحديث نص نطاق السعر عند التغيير - الإصدار المعدل
function updatePriceSelectionDisplay() {
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;
    
    // الحل الآمن للوصول إلى قيمة العملة
    let currencyText = "ريال"; // قيمة افتراضية
    if (currencySelect && currencySelect.options && currencySelect.selectedIndex !== undefined) {
        const selectedOption = currencySelect.options[currencySelect.selectedIndex];
        if (selectedOption) {
            currencyText = selectedOption.text;
        }
    }
    
    if (minPrice || maxPrice) {
        let text = "السعر: ";
        if (minPrice) text += `من ${minPrice} ${currencyText}`;
        if (minPrice && maxPrice) text += " إلى ";
        if (maxPrice) text += `إلى ${maxPrice} ${currencyText}`;
        priceSelectedText.textContent = text;
    } else {
        priceSelectedText.textContent = "اختر نطاق السعر";
    }
}

// إضافة مستمعي الأحداث لحقول السعر
if (minPriceInput) minPriceInput.addEventListener("input", updatePriceSelectionDisplay);
if (maxPriceInput) maxPriceInput.addEventListener("input", updatePriceSelectionDisplay);
if (currencySelect) currencySelect.addEventListener("change", updatePriceSelectionDisplay);

// في دالة فتح نافذة الفلترة، أضف:
if (typeof hidePriceRange !== 'undefined') hidePriceRange();

// في دالة إغلاق نافذة الفلترة، أضف:
if (typeof hidePriceRange !== 'undefined') hidePriceRange();

// في دالة تطبيق الفلترة، أضف:
const minPrice = minPriceInput ? minPriceInput.value : "";
const maxPrice = maxPriceInput ? maxPriceInput.value : "";

// الحل الآمن للوصول إلى قيمة العملة
let currencyText = "ريال";
if (currencySelect && currencySelect.options && currencySelect.selectedIndex !== undefined) {
    const selectedOption = currencySelect.options[currencySelect.selectedIndex];
    if (selectedOption) {
        currencyText = selectedOption.text;
    }
}

if (minPrice || maxPrice) {
    if (message) message += "\n";
    message += `نطاق السعر: `;
    if (minPrice) message += `من ${minPrice} ${currencyText}`;
    if (minPrice && maxPrice) message += " إلى ";
    if (maxPrice) message += `إلى ${maxPrice} ${currencyText}`;
}

// في دالة إعادة التعيين، أضف:
if (minPriceInput) minPriceInput.value = "";
if (maxPriceInput) maxPriceInput.value = "";
if (currencySelect) currencySelect.value = "ريال";
if (typeof updatePriceSelectionDisplay !== 'undefined') updatePriceSelectionDisplay();

// عناصر مساحة العقار
const areaSelectedText = document.getElementById("areaSelectedText");
const areaSelectionToggle = document.getElementById("areaSelectionToggle");
const areaRangeContainer = document.getElementById("areaRangeContainer");
const areaUnitSelect = document.getElementById("areaUnit");
const minAreaInput = document.getElementById("minArea");
const maxAreaInput = document.getElementById("maxArea");

// حالة قسم المساحة
let areaRangeVisible = false;

// تبديل ظهور وإخفاء نطاق المساحة
if (areaSelectionToggle) {
    areaSelectionToggle.addEventListener("click", () => {
        if (areaRangeVisible) {
            hideAreaRange();
        } else {
            showAreaRange();
            // إخفاء الأقسام الأخرى إذا كانت ظاهرة
            if (typeof propertyIconsVisible !== 'undefined' && propertyIconsVisible) hidePropertyIcons();
            if (typeof offerTypeIconsVisible !== 'undefined' && offerTypeIconsVisible) hideOfferTypeIcons();
            if (typeof priceRangeVisible !== 'undefined' && priceRangeVisible) hidePriceRange();
        }
    });
}

// إظهار وإخفاء نطاق المساحة
function showAreaRange() {
    if (areaRangeContainer) areaRangeContainer.classList.add("active");
    if (areaSelectionToggle) areaSelectionToggle.classList.add("active");
    areaRangeVisible = true;
}

function hideAreaRange() {
    if (areaRangeContainer) areaRangeContainer.classList.remove("active");
    if (areaSelectionToggle) areaSelectionToggle.classList.remove("active");
    areaRangeVisible = false;
}

// تحديث نص نطاق المساحة عند التغيير
function updateAreaSelectionDisplay() {
    const minArea = minAreaInput ? minAreaInput.value : "";
    const maxArea = maxAreaInput ? maxAreaInput.value : "";
    
    // الحل الآمن للوصول إلى قيمة وحدة القياس
    let unitText = "متر مربع"; // قيمة افتراضية
    if (areaUnitSelect && areaUnitSelect.options && areaUnitSelect.selectedIndex !== undefined) {
        const selectedOption = areaUnitSelect.options[areaUnitSelect.selectedIndex];
        if (selectedOption) {
            unitText = selectedOption.text;
        }
    }
    
    if (minArea || maxArea) {
        let text = "المساحة: ";
        if (minArea) text += `من ${minArea} ${unitText}`;
        if (minArea && maxArea) text += " إلى ";
        if (maxArea) text += `إلى ${maxArea} ${unitText}`;
        if (areaSelectedText) areaSelectedText.textContent = text;
    } else {
        if (areaSelectedText) areaSelectedText.textContent = "اختر نطاق المساحة";
    }
}

// إضافة مستمعي الأحداث لحقول المساحة
if (minAreaInput) minAreaInput.addEventListener("input", updateAreaSelectionDisplay);
if (maxAreaInput) maxAreaInput.addEventListener("input", updateAreaSelectionDisplay);
if (areaUnitSelect) areaUnitSelect.addEventListener("change", updateAreaSelectionDisplay);

// في دالة فتح نافذة الفلترة، أضف:
if (typeof hideAreaRange !== 'undefined') hideAreaRange();

// في دالة إغلاق نافذة الفلترة، أضف:
if (typeof hideAreaRange !== 'undefined') hideAreaRange();

// في دالة تطبيق الفلترة، أضف:
const minArea = minAreaInput ? minAreaInput.value : "";
const maxArea = maxAreaInput ? maxAreaInput.value : "";

// الحل الآمن للوصول إلى قيمة وحدة القياس
let areaUnitText = "متر مربع";
if (areaUnitSelect && areaUnitSelect.options && areaUnitSelect.selectedIndex !== undefined) {
    const selectedOption = areaUnitSelect.options[areaUnitSelect.selectedIndex];
    if (selectedOption) {
        areaUnitText = selectedOption.text;
    }
}

if (minArea || maxArea) {
    if (message) message += "\n";
    message += `نطاق المساحة: `;
    if (minArea) message += `من ${minArea} ${areaUnitText}`;
    if (minArea && maxArea) message += " إلى ";
    if (maxArea) message += `إلى ${maxArea} ${areaUnitText}`;
}

// في دالة إعادة التعيين، أضف:
if (minAreaInput) minAreaInput.value = "";
if (maxAreaInput) maxAreaInput.value = "";
if (areaUnitSelect) areaUnitSelect.value = "متر";
if (typeof updateAreaSelectionDisplay !== 'undefined') updateAreaSelectionDisplay();

// عناصر عدد الغرف
const roomsSelectedText = document.getElementById("roomsSelectedText");
const roomsSelectionToggle = document.getElementById("roomsSelectionToggle");
const roomsRangeContainer = document.getElementById("roomsRangeContainer");
const minRoomsInput = document.getElementById("minRooms");
const maxRoomsInput = document.getElementById("maxRooms");

// حالة قسم عدد الغرف
let roomsRangeVisible = false;

// تبديل ظهور وإخفاء نطاق عدد الغرف
if (roomsSelectionToggle) {
    roomsSelectionToggle.addEventListener("click", () => {
        if (roomsRangeVisible) {
            hideRoomsRange();
        } else {
            showRoomsRange();
            // إخفاء الأقسام الأخرى إذا كانت ظاهرة
            if (typeof propertyIconsVisible !== 'undefined' && propertyIconsVisible) hidePropertyIcons();
            if (typeof offerTypeIconsVisible !== 'undefined' && offerTypeIconsVisible) hideOfferTypeIcons();
            if (typeof areaRangeVisible !== 'undefined' && areaRangeVisible) hideAreaRange();
            if (typeof priceRangeVisible !== 'undefined' && priceRangeVisible) hidePriceRange();
        }
    });
}

// إظهار وإخفاء نطاق عدد الغرف
function showRoomsRange() {
    if (roomsRangeContainer) roomsRangeContainer.classList.add("active");
    if (roomsSelectionToggle) roomsSelectionToggle.classList.add("active");
    roomsRangeVisible = true;
}

function hideRoomsRange() {
    if (roomsRangeContainer) roomsRangeContainer.classList.remove("active");
    if (roomsSelectionToggle) roomsSelectionToggle.classList.remove("active");
    roomsRangeVisible = false;
}

// تحديث نص نطاق عدد الغرف عند التغيير
function updateRoomsSelectionDisplay() {
    const minRooms = minRoomsInput ? minRoomsInput.value : "";
    const maxRooms = maxRoomsInput ? maxRoomsInput.value : "";
    
    if (minRooms || maxRooms) {
        let text = "عدد الغرف: ";
        if (minRooms) text += `من ${minRooms}`;
        if (minRooms && maxRooms) text += " إلى ";
        if (maxRooms) text += `إلى ${maxRooms}`;
        if (roomsSelectedText) roomsSelectedText.textContent = text;
    } else {
        if (roomsSelectedText) roomsSelectedText.textContent = "اختر عدد الغرف";
    }
}

// إضافة مستمعي الأحداث لحقول عدد الغرف
if (minRoomsInput) minRoomsInput.addEventListener("input", updateRoomsSelectionDisplay);
if (maxRoomsInput) maxRoomsInput.addEventListener("input", updateRoomsSelectionDisplay);

// في دالة فتح نافذة الفلترة، أضف:
if (typeof hideRoomsRange !== 'undefined') hideRoomsRange();

// في دالة إغلاق نافذة الفلترة، أضف:
if (typeof hideRoomsRange !== 'undefined') hideRoomsRange();

// في دالة تطبيق الفلترة، أضف:
const minRooms = minRoomsInput ? minRoomsInput.value : "";
const maxRooms = maxRoomsInput ? maxRoomsInput.value : "";

if (minRooms || maxRooms) {
    if (message) message += "\n";
    message += `عدد الغرف: `;
    if (minRooms) message += `من ${minRooms}`;
    if (minRooms && maxRooms) message += " إلى ";
    if (maxRooms) message += `إلى ${maxRooms}`;
}

// في دالة إعادة التعيين، أضف:
if (minRoomsInput) minRoomsInput.value = "";
if (maxRoomsInput) maxRoomsInput.value = "";
if (typeof updateRoomsSelectionDisplay !== 'undefined') updateRoomsSelectionDisplay();

// دالة عامة لإعداد قسم الفلترة
function setupRangeSection(sectionName, toggleId, containerId, minId, maxId, textId) {
    const toggle = document.getElementById(toggleId);
    const container = document.getElementById(containerId);
    const minInput = document.getElementById(minId);
    const maxInput = document.getElementById(maxId);
    const selectedText = document.getElementById(textId);

    let visible = false;

    function show() {
        container.classList.add("active");
        toggle.classList.add("active");
        visible = true;
    }

    function hide() {
        container.classList.remove("active");
        toggle.classList.remove("active");
        visible = false;
    }

    function updateDisplay() {
        const minVal = minInput.value;
        const maxVal = maxInput.value;

        if (minVal || maxVal) {
            let text = `${sectionName}: `;
            if (minVal) text += `من ${minVal}`;
            if (minVal && maxVal) text += " إلى ";
            if (maxVal) text += `${maxVal}`;
            selectedText.textContent = text;
        } else {
            selectedText.textContent = `اختر عدد ${sectionName}`;
        }
    }

    toggle.addEventListener("click", () => {
        if (visible) {
            hide();
        } else {
            hideAllSections();
            show();
        }
    });

    minInput.addEventListener("input", updateDisplay);
    maxInput.addEventListener("input", updateDisplay);

    return { hide, updateDisplay, minInput, maxInput };
}

// دالة إخفاء جميع الأقسام
let allSections = [];
function hideAllSections() {
    allSections.forEach(sec => sec.hide());
}

// إنشاء الأقسام
const livingRoomsSection = setupRangeSection("غرف المعيشة", "livingRoomsSelectionToggle", "livingRoomsRangeContainer", "minLivingRooms", "maxLivingRooms", "livingRoomsSelectedText");
const kitchensSection    = setupRangeSection("المطابخ", "kitchensSelectionToggle", "kitchensRangeContainer", "minKitchens", "maxKitchens", "kitchensSelectedText");
const bathroomsSection   = setupRangeSection("الحمامات", "bathroomsSelectionToggle", "bathroomsRangeContainer", "minBathrooms", "maxBathrooms", "bathroomsSelectedText");
const toiletsSection     = setupRangeSection("بيوت الخلاء", "toiletsSelectionToggle", "toiletsRangeContainer", "minToilets", "maxToilets", "toiletsSelectedText");

// نخزنهم بمصفوفة عشان نقدر نخفي الكل بسهولة
allSections = [livingRoomsSection, kitchensSection, bathroomsSection, toiletsSection];

// دالة لإعادة التعيين
function resetFilters() {
    allSections.forEach(sec => {
        sec.minInput.value = "";
        sec.maxInput.value = "";
        sec.updateDisplay();
    });
}

// مثال: استخدام resetFilters عند الضغط على زر إعادة تعيين
// document.getElementById("resetBtn").addEventListener("click", resetFilters);
