; (function () {
    var inputName = document.getElementById("addName"), // Элемент input имени товара.
        inputCount = document.getElementById("addCount"), // Элемент input количества товара.
        inputPrice = document.getElementById("addPrice"), // Элемент input цены товара.
        flagName = false, // Флаг корректности имени товара.
        flagCount = false, // Флаг корректности количества товара.
        flagPrice = false, // Флаг корректности цены товара.
        keepName = document.getElementById("storeName"), // Элемент input type="hidden" имени товара для помещения в хранилище.
        keepCount = document.getElementById("storeCount"), // Элемент input type="hidden" количества товара для помещения в хранилище.
        keepPrice = document.getElementById("storePrice"), // Элемент input type="hidden" цены для помещения в хранилище.
        inputPropriety = document.getElementById("storePropriety"), // Элемент input type="hidden" корректности ввода.
        addBtnInModal = document.getElementById("addInModal"); // Клавиша добавления в модальном окне.

    inputName.value = inputCount.value = inputPrice.value = ""; // Начальные значения имени, количества и цены товара.
    keepName.value = keepCount.value = keepPrice.value = "";  // Начальное значение имени, количества и цены товара для помещения в хранилище.
    inputPropriety.value = 0; // Начальное значение корректности ввода.

    function showError(container, errorMessage) { // Отобразить ошибку.
        var msgElem = document.createElement("span");
        msgElem.id = "errorMsg";
        msgElem.innerHTML = errorMessage;
        container.appendChild(msgElem);
    }

    function resetError(container) { // Сбросить ошибку.
        if (container.lastChild.id === "errorMsg") {
            container.removeChild(container.lastChild);
        }
    }

    function resetInput() { // Очистка полей input при открытии модального окна.
        inputName.value = inputCount.value = inputPrice.value = ""; // Сброс значений имени, количества и цены товара.
        flagName = flagCount = flagPrice = false; // Сброс флагов корректности ввода.
        keepName.value = keepCount.value = keepPrice.value = ""; // Сброс значения имени, количества и цены для помещения в хранилище.
        inputPropriety.value = 0; // Сброс значения корректности ввода.
        resetError(inputName.parentElement); // Сбросить ошибку ввода имени.
        resetError(inputCount.parentElement); // Сбросить ошибку ввода количества.
        resetError(inputPrice.parentElement); // Сбросить ошибку ввода цены.
        resetError(addBtnInModal.parentElement); // Сбросить ошибку добавления товара в модальном окне.
    }

    function nameFormat(evt) { // Проверка символов по одному.
        var nameMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
            elems = inputName.parentElement.children;

        resetError(elems.addName.parentElement);

        // Получить объект события.
        var e = evt || window.evt; // Модель стандартная или IE.
        var nameSymbol; // Введённый неизвестный символ.

        // Получить введённый символ.
        // Введённый печатаемый символ в Firefox сохраняется в свойстве charCode.
        var code = e.charCode || e.keyCode;

        // Если была нажата какая-либо функциональная клавиша, не фильтровать её.
        if (code < 32 || // Управляющий символ ASCII.
			e.charCode === 0 || // Функциональная клавиша (в Firefox).
			e.ctrlKey || e.altKey) { // Удерживаемая клавиша-модификатор.
            return;	// Не фильтровать это событие.
        }

        // Преобразовать код символа в строку.
        nameSymbol = String.fromCharCode(code);

        console.log("nameSymbol: " + nameSymbol);
        if (!nameMask.test(nameSymbol)) {
            showError(elems.addName.parentElement, "* Введите буквы, цифры или спецсимволы");
            e.preventDefault(); // Предотвратить вставку символа.
        } else if (inputName.value.length >= 15) {
            showError(elems.addName.parentElement, "* Имя должно быть от 1 до 15 символов");
            e.preventDefault(); // Предотвратить вставку символа.
        }
    }

    function nameCheck() { // Проверка по завершении редактирования.
        var elems = inputName.parentElement.children;
        console.log("elems: " + elems);

        resetError(elems.addName.parentElement);
        var nameText = elems.addName.value.trim(); // Удалить хвостовые пробелы.

        var emptyName = false; // Поле ввода имени не является пустой строкой "".
        if (nameText === "") { // Поле ввода имени - пустая строка "".
            emptyName = true;
        }

        console.log("nameCheck: nameText: " + nameText);

        function nameFilter (name) { // Равенство начальных символов шаблону поиска.
            var inputFilter = document.getElementById("storeFilter"); // Элемент input фильтра имени товара.
            var inputFilterUpperCase = inputFilter.value.toUpperCase(); // Регистронезависимая фильтрация.
            return name.slice(0, inputFilter.value.length).toUpperCase() === inputFilterUpperCase;
        }

        if (emptyName) {
            showError(elems.addName.parentElement, "* Поле не может быть пустым или из одних пробелов");
        } else if (!nameFilter(nameText)) {
            showError(elems.addName.parentElement, "* Имя не удовлетворяет заданному текущему фильтру");
        } else {
            keepName.value = nameText; // Значение имени для хранилища.
            inputName.value = nameText; // Представление имени.
            flagName = true; // Имя товара корректно.
            proprietyControl(); // Проверка корректности ввода.
        }
    }

    function nameDeny(e) { // Запрещение копирования из буфера обмена.
        var elems = inputName.parentElement.children;
        console.log("nameDeny() e.type: " + e.type);
        console.log("nameDeny() inputName.value: " + inputName.value);
        resetError(elems.addName.parentElement);
        showError(elems.addName.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault(); // Предотвратить вставку текста.
    }

    function countFormat(evt) { // Проверка символов на цифры по одному.
        var countMask = /\d+/,
            elems = inputCount.parentElement.children;

        resetError(elems.addCount.parentElement);

        // Получить объект события.
        var e = evt || window.evt; // Модель стандартная или IE.
        var countSymbol; // Введённый неизвестный символ.

        // Получить введённый символ.
        // Введённый печатаемый символ в Firefox сохраняется в свойстве charCode.
        var code = e.charCode || e.keyCode;

        // Если была нажата какая-либо функциональная клавиша, не фильтровать её.
        if (code < 32 || // Управляющий символ ASCII.
			e.charCode === 0 || // Функциональная клавиша (в Firefox).
			e.ctrlKey || e.altKey) { // Удерживаемая клавиша-модификатор.
            return;	// Не фильтровать это событие.
        }

        // Преобразовать код символа в строку.
        countSymbol = String.fromCharCode(code);

        console.log("countSymbol: " + countSymbol);
        if (!countMask.test(countSymbol)) {
            showError(elems.addCount.parentElement, "* Нужно вводить цифры");
            e.preventDefault(); // Предотвратить вставку символа.
        }
    }

    function countCheck() { // Проверка по завершении редактирования.
        var elems = inputCount.parentElement.children;
        console.log("elems: " + elems);

        resetError(elems.addCount.parentElement);
        var countNumber = elems.addCount.value;

        var emptyCount = false; // Поле ввода количества не является пустой строкой "".
        if (countNumber === "") { // Поле ввода количества - пустая строка "".
            emptyCount = true;
        }

        countNumber = +countNumber; // Преобразование к числовому значению.
        console.log("countCheck: countNumber: " + countNumber);

        if (emptyCount) {
            showError(elems.addCount.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(countNumber)) {
            showError(elems.addCount.parentElement, "* Введено не число. Повторите ввод");
        } else if (!countNumber) {
            inputCount.value = 0; // Стандартное отображение нулевого значения количества.
            showError(elems.addCount.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            keepCount.value = countNumber; // Значение количества для хранилища.
            inputCount.value = countNumber; // Представление количества.
            flagCount = true; // Количество товара корректно.
            proprietyControl(); // Проверка корректности ввода.
        }
    }

    function countDeny(e) { // Запрещение копирования из буфера обмена.
        var elems = inputCount.parentElement.children;
        console.log("countDeny() e.type: " + e.type);
        console.log("countDeny() inputCount.value: " + inputCount.value);
        resetError(elems.addCount.parentElement);
        showError(elems.addCount.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault(); // Предотвратить вставку текста.
    }

    function priceFormat(evt) { // Проверка символов по одному.
        var priceMask = /[\d\.]/,
            elems = inputPrice.parentElement.children;

        resetError(elems.addPrice.parentElement);

        // Получить объект события.
        var e = evt || window.evt; // Модель стандартная или IE.
        var priceSymbol; // Введённый неизвестный символ.

        // Получить введённый символ.
        // Введённый печатаемый символ в Firefox сохраняется в свойстве charCode.
        var code = e.charCode || e.keyCode;

        // Если была нажата какая-либо функциональная клавиша, не фильтровать её.
        if (code < 32 || // Управляющий символ ASCII.
			e.charCode === 0 || // Функциональная клавиша (в Firefox).
			e.ctrlKey || e.altKey) { // Удерживаемая клавиша-модификатор.
            return;	// Не фильтровать это событие.
        }

        // Преобразовать код символа в строку.
        priceSymbol = String.fromCharCode(code);

        console.log("priceSymbol: " + priceSymbol);
        if (!priceMask.test(priceSymbol)) { // Введён неверный символ.
            showError(elems.addPrice.parentElement, "* Введите цифры или десятичную точку");
            e.preventDefault(); // Предотвратить вставку символа.
        }
    }

    function toMoneySum(number) { // Преобразование денежной суммы в строковое представление.
        var numStr = Math.round(number * 100) / 100 + ""; // Округлить до 2 десятичных знаков.
        var countPoint = numStr.length; // Позиция для отсчёта целой и дробной частей.
        var commaPos = numStr.indexOf("."); // -1, если нет точки
        if (~commaPos) {
            countPoint = commaPos; // Расположение десятичной точки.
        }
        var fractionPart = ""; // Дробная часть.
        for (var m = countPoint + 1; m < countPoint + 3; m++) {
            if (numStr[m]) { // Если десятичный знак есть, то прибавляем его к строке.
                fractionPart += numStr[m];
            } else { // Если десятичного знака нет, то прибавляем "0" к строке.
                fractionPart += "0";
            }
        }
        var integerPart = ""; // Целая часть.
        var k = countPoint - 1; // Индекс наименьшего десятичного разряда.
        console.log("##########");
        console.log("k: " + k);
        console.log("==========");
        outerLabel: for (var i = Math.floor((countPoint + 2) / 3) ; i > 0; i--) { // Метка.
            for (var j = 0; j < 3; j++) {
                console.log("i: " + i + ";   j: " + j + ";   k: " + k + ";");
                integerPart = numStr[k] + integerPart; // Присоединение десятичного разряда.
                console.log("integerPart: " + integerPart);
                k--; // Декремент индекса.
                if (k < 0) {
                    console.log("==========");
                    console.log("i: " + i + ";   j: " + j + ";   k: " + k + ";");
                    console.log("integerPart: " + integerPart);
                    console.log("++++++++++");
                    break outerLabel; // Выход из обоих циклов for.
                }
            }
            console.log("----------");
            integerPart = "," + integerPart; // Присоединение разделителя тысяч.
            console.log("integerPart: " + integerPart);
            console.log("----------");
        }
        // Соединение знака "$", целой части, десятичной точки и дробной части.
        return "$" + integerPart + "." + fractionPart;
    }

    function priceCheck() { // Проверка по завершении редактирования.
        var elems = inputPrice.parentElement.children;
        console.log("elems: " + elems);

        resetError(elems.addPrice.parentElement);
        var priceNumber = elems.addPrice.value;

        var emptyPrice = false; // Поле ввода цены не является пустой строкой "".
        if (priceNumber === "") { // Поле ввода цены - пустая строка "".
            emptyPrice = true;
        }

        priceNumber = +priceNumber; // Преобразование к числовому значению.
        console.log("priceCheck: priceNumber: " + priceNumber);

        if (emptyPrice) {
            showError(elems.addPrice.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(priceNumber)) {
            showError(elems.addPrice.parentElement, "* Введено не число. Повторите ввод");
        } else if (!priceNumber) {
            inputPrice.value = 0; // Стандартное отображение нулевого значения цены.
            showError(elems.addPrice.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            keepPrice.value = priceNumber; // Значение цены для хранилища.
            inputPrice.value = toMoneySum(priceNumber); // Представление денежной суммы.
            flagPrice = true; // Цена товара корректна.
            proprietyControl(); // Проверка корректности ввода.
        }
    }

    function priceDeny(e) { // Запрещение копирования из буфера обмена.
        var elems = inputPrice.parentElement.children;
        console.log("priceDeny() e.type: " + e.type);
        console.log("priceDeny() inputPrice.value: " + inputPrice.value);
        resetError(elems.addPrice.parentElement);
        showError(elems.addPrice.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault(); // Предотвратить вставку текста.
    }

    function addCheck(e) { // Проверка корректности ввода.
        console.log("addCheck()");
        var assumedValue = !!+inputPropriety.value; // Значение корректности ввода.
        console.log("addCheck: корректность ввода: " + assumedValue);
        if (!assumedValue) { // Если ввод некорректен.
            showError(addBtnInModal.parentElement, "* Заполните поля правильно");
            e.preventDefault(); // Предотвратить нажатие клавиши.
            e.stopPropagation(); // Чтобы модальное окно не закрылось.
        }
    }

    function proprietyControl() { // Проверка корректности ввода.
        console.log("proprietyControl: flagName: " + flagName + ";   flagCount: " + flagCount + ";   flagPrice: " + flagPrice + ";");
        if (flagName && flagCount && flagPrice) { // Сведения о товаре корректны.
            inputPropriety.value = 1; // Установить корректность ввода в true.
            console.log("proprietyControl: передаваемое значение: " + inputPropriety.value);
        }
    }

    // Очистка полей input, сброс флагов и значения корректности для удаления сведений от предыдущего ввода.
    document.getElementById("addAboveModal").addEventListener("click", resetInput, false);
    //window.addEventListener("load", resetInput, false); // Очистка поля input при обновлении.
    inputName.addEventListener("keypress", nameFormat, false); // Проверка имени по символу.
    inputName.addEventListener("paste", nameDeny); // Запретить ввод из буфера обмена.
    inputName.addEventListener("blur", nameCheck, false); // Проверка имени при потере фокуса.
    inputCount.addEventListener("keypress", countFormat, false); // Проверка количества по символу.
    inputCount.addEventListener("paste", countDeny); // Запретить ввод из буфера обмена.
    inputCount.addEventListener("blur", countCheck, false); // Проверка всего количества.
    inputPrice.addEventListener("keypress", priceFormat, false); // Проверка цены по символу.
    inputPrice.addEventListener("paste", priceDeny); // Запретить ввод из буфера обмена.
    inputPrice.addEventListener("blur", priceCheck, false); // Проверка всей цены и её форматирование.
    addBtnInModal.addEventListener("click", addCheck, false); // Проверка корректности ввода.
})();
