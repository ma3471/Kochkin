; (function () {
    var keepFilter = document.getElementById("storeFilter"); // Элемент input фильтра по имени товара.

    keepFilter.value = ""; // Начальное значение фильтра по имени товара.

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

    function filterFormat(evt) { // Проверка символов по одному.
        var filterMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
            elems = keepFilter.parentElement.children;

        resetError(elems.storeFilter.parentElement);

        // Получить объект события.
        var e = evt || window.evt; // Модель стандартная или IE.
        var filterSymbol; // Введённый неизвестный символ.

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
        filterSymbol = String.fromCharCode(code);

        console.log("filterSymbol: " + filterSymbol);
        if (!filterMask.test(filterSymbol)) {
            showError(elems.storeFilter.parentElement, "* Введите буквы, цифры или спецсимволы");
            e.preventDefault(); // Предотвратить вставку символа.
        } else if (keepFilter.value.length >= 15) {
            showError(elems.storeFilter.parentElement, "* Фильтр должен быть от 1 до 15 символов");
            e.preventDefault(); // Предотвратить вставку символа.
        }
    }

    function filterCheck() { // Проверка фильтра имени товара для поиска.
        var elems = keepFilter.parentElement.children;
        console.log("elems: " + elems);

        resetError(elems.storeFilter.parentElement);
        var filterText = keepFilter.value.trim(); // Удалить хвостовые пробелы.

        // Фильтр имени товара может быть пустым.
        console.log("filterCheck: filterText: " + filterText);

        keepFilter.value = filterText; // Значение фильтра имени для отображения.
    }

    function filterDeny(e) { // Запрещение копирования из буфера обмена.
        var elems = keepFilter.parentElement.children;
        console.log("filterDeny() e.type: " + e.type);
        console.log("filterDeny() keepFilter.value: " + keepFilter.value);
        resetError(elems.storeFilter.parentElement);
        showError(elems.storeFilter.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault(); // Предотвратить вставку текста.
    }

    keepFilter.addEventListener("keypress", filterFormat, false); // Проверка фильтра по символу.
    keepFilter.addEventListener("paste", filterDeny); // Запретить ввод из буфера обмена.
    keepFilter.addEventListener("blur", filterCheck, false); // Прверка фильтра при потере фокуса.
})();