// العناصر الرئيسية في DOM
const elements = {
  categoryItems: document.querySelectorAll('.category-item'),
  titleElement: document.getElementById('selectedTitle'),
  listElement: document.querySelector('.main-category-list'),
  villaFields: document.getElementById('villaFields'),
  dealType: document.getElementById('dealType'),
  priceFieldGroup: document.getElementById('priceFieldGroup'),
  currencyFieldGroup: document.getElementById('currencyFieldGroup'),
  rentalDurationField: document.getElementById('rentalDurationField'),
  mortgageDurationField: document.getElementById('mortgageDurationField'),
  paymentMethodGroup: document.getElementById('paymentMethodGroup'),
  featureDropdown: document.getElementById('featureDropdown'),
  selectBoxText: document.getElementById('selectBoxText'),
  imageInput: document.getElementById('propertyImages'),
  previewContainer: document.getElementById('imagePreviewContainer'),
  counterElement: document.getElementById('selectedCount')
};

// ✅ ربط زر "فيلا"
const villaButton = document.getElementById("villaButton");

villaButton.addEventListener("click", () => {
document.querySelectorAll('.form-group').forEach(element => {
  element.style.display = 'none';
});
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
  document.querySelectorAll('.villa-group').forEach(el => {
  el.style.display = 'block';
});


const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});

// ✅ زر الشقة
document.getElementById("apartmentButton").addEventListener("click", () => {
    document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
document.querySelectorAll('.form-group').forEach(element => {
  element.style.display = 'none';
});
document.querySelectorAll('.apartment-group').forEach(el => {
  el.style.display = 'block';
});

const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});

//زر الأستوديو
document.getElementById("studioButton").addEventListener("click", () => {
    document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.studio-group').forEach(el => {
    el.style.display = 'block';
  });

const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});



  
//زر الدوبلكس
  const duplexButton = document.getElementById("duplexButton");

duplexButton.addEventListener("click", () => {
    document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.duplex-group').forEach(el => {
    el.style.display = 'block';
  });


const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});


  //
// الحصول على الزر
const arabicHouseBtn = document.getElementById("arabicHouseButton");

arabicHouseBtn.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
    document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
  document.querySelectorAll('.arabic-house').forEach(el => {
    el.style.display = 'block';
  });



const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});
//
const chaletBtn = document.getElementById("chaletButton");
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
chaletBtn.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });

  document.querySelectorAll('.chalet-group').forEach(el => {
    el.style.display = 'block';
  });



const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});
//
const studentHousingBtn = document.getElementById("studentHousingButton");

studentHousingBtn.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.student-housing-group').forEach(el => {
    el.style.display = 'block';
  });

const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});
//
const workerHousingBtn = document.getElementById("workerHousingButton");

workerHousingBtn.addEventListener("click", () => {
  // إخفاء كل الحقول
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'none';
  });

  // إظهار حقول سكن العمال
  document.querySelectorAll('.student-housing-group').forEach(el => {
    el.style.display = 'block';
  });

const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});
//
const officeButton = document.getElementById("officeButton");

officeButton.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
    document.querySelectorAll('.office-group').forEach(element => {
    element.style.display = 'block';
  });


const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});

//
const warehouseButton = document.getElementById("warehouseButton");

warehouseButton.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
    document.querySelectorAll('.warehouse-group').forEach(element => {
    element.style.display = 'block';
  });



const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});
});

//
const residentialBuildingButton = document.getElementById("residentialBuildingButton");

residentialBuildingButton.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
    document.querySelectorAll('.residentialBuilding-group').forEach(element => {
    element.style.display = 'block';
  });
 


const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});

});
//
const landButton = document.getElementById("landButton");

landButton.addEventListener("click", () => {
  document.querySelectorAll('.form-group').forEach(element => {
    element.style.display = 'none';
  });
  document.querySelectorAll('.socialist').forEach(element => {
    element.style.display = 'block';
  });
    document.querySelectorAll('.land-group').forEach(element => {
    element.style.display = 'block';
  });
// البحث عن الحقول التي تحتوي على الكلمة red
// تحديد جميع الحقول المطلوبة باستخدام السمة المخصصة
const villaRequiredInputs = document.querySelectorAll('[data-required="true"]');

// دالة التحقق من الحقل أو الديف
function validateField(element) {
  let isValid = true;

  if (element.tagName === 'DIV') {
    // لو ديف، نبحث عن أي مدخلات داخله
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.value || input.value.trim() === '') {
        input.style.borderColor = 'red';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
  } else {
    // لو عنصر إدخال مباشر
    if (!element.value || element.value.trim() === '') {
      element.style.borderColor = 'red';
      isValid = false;
    } else {
      element.style.borderColor = '';
    }
  }

  return isValid;
}

// تطبيق التحقق على كل عنصر
villaRequiredInputs.forEach(el => {
  validateField(el);
  el.addEventListener('input', () => validateField(el));
  el.addEventListener('change', () => validateField(el));
  el.addEventListener('blur', () => validateField(el));
});



});
// ✅ تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initCategorySelection();
  initDealTypeHandlers();
  initImageUploader();
  initValidation();
  initModal();
});

// ✅ اختيار نوع العقار
function initCategorySelection() {
  elements.categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const text = item.textContent.trim();
      elements.listElement.style.display = 'none';
      elements.titleElement.textContent = text;
      elements.titleElement.style.display = 'block';
    });
  });
}

// 2. معالجة نوع الصفقة (بيع/إيجار/رهن)
function initDealTypeHandlers() {
  const fieldConfig = {
    'sale': {
      price: true,
      currency: true,
      rentalDuration: false,
      mortgageDuration: false,
      paymentMethod: true
    },
    'rent': {
      price: true,
      currency: true,
      rentalDuration: true,
      mortgageDuration: false,
      paymentMethod: true
    },
    'رهن': {
      price: true,
      currency: true,
      rentalDuration: false,
      mortgageDuration: true,
      paymentMethod: true
    },
    'exchange': {
      price: false,
      currency: false,
      rentalDuration: false,
      mortgageDuration: false,
      paymentMethod: false
    }
  };

  elements.dealType.addEventListener('change', () => {
    const selectedValue = elements.dealType.value;
    const config = fieldConfig[selectedValue] || {};

    // تحديث عرض الحقول
    elements.priceFieldGroup.style.display = config.price ? 'block' : 'none';
    elements.currencyFieldGroup.style.display = config.currency ? 'block' : 'none';
    elements.rentalDurationField.style.display = config.rentalDuration ? 'block' : 'none';
    elements.mortgageDurationField.style.display = config.mortgageDuration ? 'block' : 'none';
    elements.paymentMethodGroup.style.display = config.paymentMethod ? 'block' : 'none';

    // تحديث الحقول المطلوبة
    updateRequiredFields(config);
  });
}

function updateRequiredFields(config) {
  const fields = {
    price: document.getElementById('price'),
    currency: document.getElementById('currency'),
    rentalDuration: document.getElementById('rentalDuration'),
    mortgageDuration: document.getElementById('mortgageDuration'),
    paymentMethod: document.getElementById('paymentMethod')
  };

  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      if (config[key]) {
        fields[key].setAttribute('data-required', 'true');
      } else {
        fields[key].removeAttribute('data-required');
      }
      const label = document.querySelector(`label[for="${fields[key].id}"]`);
      if (label) {
        label.classList.toggle('required-label', config[key]);
      }
    }
  });
}


// 3. معاينة الصور
function initImageUploader() {
  const displayedImages = new Set();
  const maxImages = 10;

  // تحديث العداد
  function updateImageCounter() {
    const count = displayedImages.size;
    elements.counterElement.textContent = count;
    elements.counterElement.style.color = count >= maxImages ? '#ff4757' : '';
  }

  // إنشاء بطاقة صورة
  function createImageCard(file, fileId, src) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-preview';
    wrapper.dataset.fileId = fileId;
    
    wrapper.innerHTML = `
      <img src="${src}" alt="${file.name}" loading="lazy">
      <button class="delete-image" aria-label="حذف الصورة">×</button>
      <div class="file-info">
        <span class="file-name">${file.name.substring(0, 15)}${file.name.length > 15 ? '...' : ''}</span>
        <span class="file-size">${(file.size / (1024*1024)).toFixed(1)}MB</span>
      </div>
    `;
    
    // تكبير الصورة
    wrapper.querySelector('img').addEventListener('click', () => openModal(src));
    
    // حذف الصورة
    wrapper.querySelector('.delete-image').addEventListener('click', (e) => {
      e.stopPropagation();
      wrapper.remove();
      displayedImages.delete(fileId);
      updateImageCounter();
    });
    
    elements.previewContainer.appendChild(wrapper);
    displayedImages.add(fileId);
    updateImageCounter();
  }

  // معالجة الملفات المختارة
  elements.imageInput?.addEventListener('change', function() {
    if (!this.files) return;
    
    const newFiles = Array.from(this.files)
      .filter(file => {
        if (!file.type.startsWith('image/')) {
          alert('⚠️ يُسمح فقط بتحميل ملفات الصور');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('⚠️ الحد الأقصى لحجم الصورة 5MB');
          return false;
        }
        return true;
      })
      .slice(0, maxImages - displayedImages.size);

    newFiles.forEach(file => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;
      if (!displayedImages.has(fileId)) {
        const reader = new FileReader();
        reader.onload = (e) => createImageCard(file, fileId, e.target.result);
        reader.readAsDataURL(file);
      } else {
        alert('⚠️ هذه الصورة مضافه مسبقاً');
      }
    });
    
    this.value = '';
  });

  // سحب وإفلات الصور
  const uploadArea = document.querySelector('.image-uploader');
  if (uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    uploadArea.classList.add('highlight');
  }

  function unhighlight() {
    uploadArea.classList.remove('highlight');
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = Array.from(dt.files).filter(file => file.type.startsWith('image/'));
    
    if (files.length === 0) {
      alert('❗ يُسمح فقط بإسقاط ملفات الصور');
      return;
    }
    
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    elements.imageInput.files = dataTransfer.files;
    
    const event = new Event('change');
    elements.imageInput.dispatchEvent(event);
  }
}

// 4. التحقق من الصحة
function initValidation() {
  const requiredInputs = document.querySelectorAll('[required]');

  // التحقق عند الإرسال
  document.querySelector('form')?.addEventListener('submit', function(e) {
    let isFormValid = true;
    
    requiredInputs.forEach(input => {
      validateField(input);
      if (!input.value || input.value === "") {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      e.preventDefault();
      // يمكن إضافة تنبيه للمستخدم هنا
    }
  });
}

function validateField(input) {
  const label = document.querySelector(`label[for="${input.id}"]`);
  let isInvalid = false;

  // تحقق إذا كان الحقل مطلوبًا وفارغًا
  if (input.hasAttribute('required')) {
    if (input.tagName === "SELECT") {
      isInvalid = !input.value || input.value === "";
    } else {
      isInvalid = !input.value || input.value.trim() === "";
    }
  }

  // تطبيق الأنماط
  input.classList.toggle('invalid-field', isInvalid);
  if (label) label.classList.toggle('invalid-label', isInvalid);
  
  return !isInvalid; // إرجاع حالة الصحة
}


// 5. نافذة العرض الكبير للصورة
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  
  modalImg.src = src;
  modal.style.display = "flex";
  document.body.style.overflow = 'hidden';
}

function initModal() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeModalBtn = document.getElementById("closeModal");

  if (!modal || !modalImg) return;

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  closeModalBtn?.addEventListener("click", closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });
}

// 6. متعددة الاختيارات

// 7. توليد الحقول الديناميكية
function generateFields(type) {
  const count = parseInt(document.getElementById(type).value) || 0;
  const container = document.getElementById(`${type}Container`);
  container.innerHTML = "";
  
  const labels = {
    'rooms': 'الغرفة',
    'livingRooms': 'غرفة المعيشة',
    'kitchens': 'المطبخ',
    'bathrooms': 'الحمام',
    'toilets': 'بيت الخلاء'
  };

  for (let i = 1; i <= count; i++) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `
      <label>حجم ${labels[type]} ${i} (بالمتر المربع):</label>
      <input type="number" name="${type}_size_${i}" placeholder="أدخل حجم ${labels[type]} ${i}" min="0" step="0.1">`;

    container.appendChild(div);
  }
} 