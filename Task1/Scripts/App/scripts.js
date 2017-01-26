; (function () {
    var currentId = 1; // Начальное значение идентификатора.
    var prodDb = []; // Массив с объектами товара.
    var prodShow = []; // Массив с товарами для отображения при поиске и сортировке.
    var sortingName = 0; // 0 - сортировать по имени в прямом порядке; 1 - в обратном.
    var sortingPrice = 0; // 0 - сортировать по цене в прямом порядке; 1 - в обратном.

    var tbodyRowNode = document.getElementsByTagName("tbody")[0]; // Элемент tbody, содержащий строки перечня товаров.
    var editRow = {}; // Хранение всех объектов, связанных с редактируемой записью.
    var dropRow = {}; // Хранение всех объектов, связанных с удаляемой записью.

    function addDb(e) { // Добавляет записываемый объект в хранилище объектов.
        console.log("addDb()");
        console.log("addDb: e: " + e);
		var prodElem = {}; // Элемент перечня товаров.
        var assumedValue = !!+document.getElementById("storePropriety").value; // Принимаемое значение корректности ввода.
        console.log("addDb: принимаемое значение: " + assumedValue);

        if (assumedValue) { // Корректность сведений о товаре.
            prodElem.id = currentId; // Инкрементируемый идентификатор.
            prodElem.name = document.getElementById("storeName").value; // Имя товара.
            prodElem.count = +document.getElementById("storeCount").value; // Количество товара.
            var priceRound = +document.getElementById("storePrice").value; // Для округления и размещения в хранилище.
            prodElem.price = Math.round(priceRound * 100) / 100; // Цена товара.
            console.log("addDb: Имя товара: " + prodElem.name + ";   Количество: " + prodElem.count + ";   Цена: " + prodElem.price + ";");
        } else {
            console.log("addDb: assumedValue-else: e: " + e);
            return;
        }

        prodDb.push(prodElem); // Добавление объекта товара.
        currentId++; // Инкрементирование идентификатора.
        displayDb(); // Отображение обновлённого перечня товаров.
    }

    function drawDb(prodRow) { // Отрисовывает сведения о товарах.
        tbodyRowNode.innerHTML = ""; // Очистить перечень перед отображением строк.
        prodRow.forEach(listRow); // Отобразить все строки перечня товаров.
    }

	function displayDb() { // Отображение перечня товаров.
		prodShow = prodDb; // Переписывание основного массива в массив для отображения.
		drawDb(prodShow); // Отрисовать список товаров.
	}
	
	function searchDb() { // Фильтрация по имени товара.
	    console.log("searchDb()");
	    var dbFilter = document.getElementById("storeFilter"); // Элемент input фильтра по имени товара.
	    var dbFilterUpperCase = dbFilter.value.toUpperCase(); // Регистронезависимая фильтрация.
        prodShow = prodDb.filter(function (prod) { // Равенство начальных символов шаблону поиска.
            return prod.name.slice(0, dbFilter.value.length).toUpperCase() === dbFilterUpperCase;
        });
        drawDb(prodShow); // Отрисовать отфильтрованный список товаров.
    }

    function sortingNameToggle() { // Меняет направление сортировки по имени.
        if (!prodShow) prodShow = prodDb; // Если пуст, то переписать из основного массива.
		prodShow.sort(function (prodA, prodB) { // Сортировка по имени в прямом направлении.
            if (prodA.name.toUpperCase() < prodB.name.toUpperCase()) return -1;
            return 1; // Регистронезависимая сортировка.
        }); 
        !sortingName ? sortingName = 1 : sortingName = 0;
 		var toggleName = document.getElementById("nameToggle"); // Элемент со значком сортировки по имени.
        if (!!sortingName) { // Сортировать в обратном направлении.
			prodShow.reverse(); // Обратить массив, поскольку сортировка обратная.
			toggleName.className = "glyphicon glyphicon-triangle-bottom"; // Значок "вниз".
		} else { // Сортировать в прямом направлении.
			toggleName.className = "glyphicon glyphicon-triangle-top"; // Значок "вверх".
		}
        drawDb(prodShow); // Отрисовать отсортированный по имени список.
    }

    function sortingPriceToggle() { // Меняет направление сортировки по цене.
        if (!prodShow) prodShow = prodDb; // Если пуст, то переписать из основного массива.
        prodShow.sort(function (prodA, prodB) { // Сортировка по цене в прямом направлении.
            if (prodA.price < prodB.price) return -1;
            return 1;
        });
        !sortingPrice ? sortingPrice = 1 : sortingPrice = 0;
		var togglePrice = document.getElementById("priceToggle"); // Элемент со значком сортировки по цене.
        if (!!sortingPrice) { // Сортировать в обратном направлении.
			prodShow.reverse(); // Обратить массив, поскольку сортировка обратная.
			togglePrice.className = "glyphicon glyphicon-triangle-bottom"; // Значок "вниз".
		} else { // Сортировать в прямом направлении.
			togglePrice.className = "glyphicon glyphicon-triangle-top"; // Значок "вверх".
		}
        drawDb(prodShow); // Отрисовать отсортированный по цене список.
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
        outerLabel: for (var i = Math.floor((countPoint + 2) / 3) ; i > 0; i--) { // Метка.
            for (var j = 0; j < 3; j++) {
                integerPart = numStr[k] + integerPart; // Присоединение десятичного разряда.
                k--; // Декремент индекса.
                if (k < 0) {
                    break outerLabel; // Выход из обоих циклов for.
                }
            }
            integerPart = "," + integerPart; // Присоединение разделителя тысяч.
        }
        // Соединение знака "$", целой части, десятичной точки и дробной части.
        return "$" + integerPart + "." + fractionPart;
    }

    function listRow(prod) { // Отрисовывает строку перечня.
        console.log("listRow()");
        var trRowText = document.getElementById("rowBlock").innerHTML; // Текст элемента tr.
        var trRowNode = document.createElement("tr"); // Элемент tr для добавления.
        trRowNode.innerHTML = trRowText; // Добавление текста в элемент tr.
		
        trRowNode.getElementsByClassName("prodName")[0].innerHTML = prod.name; // Имя товара.
        trRowNode.getElementsByClassName("prodCount")[0].innerHTML = prod.count; // Количество товара.
        trRowNode.getElementsByClassName("prodPrice")[0].innerHTML = toMoneySum(prod.price); // Отображаемая цена товара.
        trRowNode.getElementsByClassName("#prodEditModal")[0].setAttribute("data-target", "#editModal" + prod.id); // Добавление атрибута data-target.
        trRowNode.getElementsByClassName("#prodEditModal")[0].setAttribute("id", "editAboveModal" + prod.id); // Добавление атрибута id.
        trRowNode.getElementsByClassName("prodEditModal")[0].setAttribute("id", "editModal" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodEditNameFor")[0].setAttribute("for", "editName" + prod.id); // Установка атрибута for.
        trRowNode.getElementsByClassName("prodEditNameId")[0].setAttribute("id", "editName" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodEditCountFor")[0].setAttribute("for", "editCount" + prod.id); // Установка атрибута for.
        trRowNode.getElementsByClassName("prodEditCountId")[0].setAttribute("id", "editCount" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodEditPriceFor")[0].setAttribute("for", "editPrice" + prod.id); // Установка атрибута for.
        trRowNode.getElementsByClassName("prodEditPriceId")[0].setAttribute("id", "editPrice" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodEditInModal")[0].setAttribute("id", "editInModal" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("#prodDropModal")[0].setAttribute("data-target", "#dropModal" + prod.id); // Установка атрибута data-target.
        trRowNode.getElementsByClassName("#prodDropModal")[0].setAttribute("id", "dropAboveModal" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodDropModal")[0].setAttribute("id", "dropModal" + prod.id); // Установка атрибута id.
        trRowNode.getElementsByClassName("prodDropInModal")[0].setAttribute("id", "dropInModal" + prod.id); // Установка атрибута id.
		
        tbodyRowNode.appendChild(trRowNode); // Добавление tr в tbody.
    }

    function listHandler() { // Редактирует сведения о товаре или удаляет товар в перечне товаров.
        
    }

	window.addEventListener("load", displayDb, false); // Отображение перечня товаров.
	document.getElementById("addInModal").addEventListener("click", addDb, false); // Добавление объекта при нажатии клавиши добавления в модальном.
	document.getElementById("searchAboveModal").addEventListener("click", searchDb, false); // Фильтрация по имени товара.
	document.getElementById("nameToggle").addEventListener("click", sortingNameToggle, false); // Изменение направления сортировки по имени.
	document.getElementById("priceToggle").addEventListener("click", sortingPriceToggle, false); // Изменение направления сортировки по цене.
	tbodyRowNode.addEventListener("click", listHandler, false); // Редактирование или удаление товара.
})();
