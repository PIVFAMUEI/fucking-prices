let	dateValue, shopValue, productValue, brandValue, priceValue, discountValue,
	lastItem = localStorage.length,
	data = '',
	submitButton = document.querySelector('[type="submit"]');

function updateData() {
	lastItem = localStorage.length;

	dateValue  = document.querySelector('#date').value,
	shopValue  = document.querySelector('#shop').value,
	productValue=document.querySelector('#product').value,
	brandValue = document.querySelector('#brand').value,
	priceValue = document.querySelector('#price').value;

	data = dateValue + '\n' + shopValue + '\n' + productValue + '\n' + 
		   brandValue + '\n' + priceValue + '\n' + discountValue;
};

function addNumber() {
	updateData();
	document.querySelector('#number').textContent = lastItem;
};

function clearForm() {
	document.querySelector('#product').value=null;
	document.querySelector('#brand').value = null;
	document.querySelector('#price').value = null;
	if(document.querySelector('#discount'))
		document.querySelector('#discount').value = null;
};

function saveLocalData() {
	localStorage.setItem(String(lastItem + 1), data);
	clearForm();
};

let discountCheckbox = document.querySelector('#discount-checkbox'),
	discountElement,
	discountLine;
	
function convertDiscount() {
	updateData();
	let fullPrice = Number(discountElement.value),
		discPrice = Number(priceValue);
		
	return Math.round(100 - ((100 * discPrice) / fullPrice));
};

function checkDiscount() {
	discountElement = document.querySelector('#discount');
	if(discountElement)
		discountValue = convertDiscount();
	else
		discountValue = 0;

	if(discountCheckbox.checked && !discountLine) {
		discountLine = document.createElement('div');
		discountLine.className = 'form-line';
		discountLine.innerHTML = '<label for="discount">Цена без скидки:</label>' +
								 '<input id="discount" type="number" min="1" step="0.01">';

		document.querySelector('#discount-checkbox-line').after(discountLine);
	};
	if(!discountCheckbox.checked && discountLine) {
		discountLine.remove();
		discountLine = null;
	};
};

function checkFilledForms() {
	checkDiscount();
	updateData();
	
	if(discountElement) {
		if(dateValue && shopValue && productValue && brandValue && priceValue && discountValue) {
			submitButton.removeAttribute('disabled');
		} else {
			submitButton.setAttribute('disabled', 'true');
		};
	} else {
		if(dateValue && shopValue && productValue && brandValue && priceValue) {
			submitButton.removeAttribute('disabled');
		} else {
			submitButton.setAttribute('disabled', 'true');
		};
	};
};

if(submitButton) {
	addNumber();
	setInterval(checkFilledForms, 125);
	submitButton.onclick = function() {
		saveLocalData();
		addNumber();
	};
};

let date = [], shop = [], product = [], brand = [], price = [], discount = [];

function initData() {
	if(lastItem > 0) {
		for(let i = 1; i <= lastItem; i++) {
			date[i-1]   = localStorage.getItem(String(i)).split('\n')[0];
			shop[i-1]   = localStorage.getItem(String(i)).split('\n')[1];
			product[i-1]= localStorage.getItem(String(i)).split('\n')[2];
			brand[i-1]  = localStorage.getItem(String(i)).split('\n')[3];
			price[i-1]  = localStorage.getItem(String(i)).split('\n')[4];
			discount[i-1]=localStorage.getItem(String(i)).split('\n')[5];
		};
	};
};

function logData() {
	initData();
	for(let i = 0; i < lastItem; i++) {
		console.log(date[i] + '\n' + shop[i] + '\n' + product[i] + '\n' + 
					brand[i] + '\n' + price[i] + '\n' + discount[i]);
	};
};

logData();

let table = document.querySelector('tbody');

function createTable() {
	let tableRow;

	function createTableCell(value) {
		let createCell = document.createElement('td');
		createCell.innerText = value;
		tableRow.append(createCell);
	};

	for(let i = 0; i < lastItem; i++) {
		let createTableRow = document.createElement('tr');
		createTableRow.id = 'tr' + String(i);
		table.append(createTableRow);

		tableRow = document.querySelector('#tr' + String(i));
		
		createTableCell(date[i]);
		createTableCell(shop[i]);
		createTableCell(product[i]);
		createTableCell(brand[i]);
		createTableCell(price[i] + ' ₽');
		createTableCell(discount[i] + '%');
	};
};

function changeLocalData(i, j, value) {
	let oldItem = localStorage.getItem(String(i+1)).split('\n'),
		newItem;

	switch(j) {
		case 0: newItem = value.replace(/[^-\d]/g,'') + '\n' + oldItem[1] + '\n' + oldItem[2] + '\n' + oldItem[3] + '\n' + oldItem[4] + '\n' + oldItem[5]; break;
		case 1: newItem = oldItem[0] + '\n' + value + '\n' + oldItem[2] + '\n' + oldItem[3] + '\n' + oldItem[4] + '\n' + oldItem[5]; break;
		case 2: newItem = oldItem[0] + '\n' + oldItem[1] + '\n' + value + '\n' + oldItem[3] + '\n' + oldItem[4] + '\n' + oldItem[5]; break;
		case 3: newItem = oldItem[0] + '\n' + oldItem[1] + '\n' + oldItem[2] + '\n' + value + '\n' + oldItem[4] + '\n' + oldItem[5]; break;
		case 4: newItem = oldItem[0] + '\n' + oldItem[1] + '\n' + oldItem[2] + '\n' + oldItem[3] + '\n' + value.replace(/[^.\d]/g,'') + '\n' + oldItem[5]; break;
		case 5: newItem = oldItem[0] + '\n' + oldItem[1] + '\n' + oldItem[2] + '\n' + oldItem[3] + '\n' + oldItem[4] + '\n' + value.replace(/[^.\d]/g,''); break;
	};
	localStorage.setItem(String(i+1), newItem);
};

let tableCell = [];

function editTable() {
	let inputCell;

	for(let i = 0; i < lastItem; i++) {
		tableCell[i] = [];
		for(let j = 0; j < 6; j++) {
			tableCell[i][j] = document.querySelectorAll('#tr' + String(i) + ' td')[j];
			tableCell[i][j].ondblclick = function() {
				if(!inputCell) {
					let createInputCell = document.createElement('input');

					createInputCell.id = 'input-cell';
					createInputCell.setAttribute('type', 'text');
					tableCell[i][j].replaceWith(createInputCell);

					inputCell = document.querySelector('#input-cell');
					inputCell.value = tableCell[i][j].innerText;
					inputCell.focus();

					inputCell.addEventListener('focusout', () => {
						inputCell.replaceWith(tableCell[i][j]);//inputCell.focus());
						inputCell = null;
					});
					inputCell.addEventListener('keydown', () => {
						if(event.key === 'Enter') {
							changeLocalData(i, j, inputCell.value);
							window.location.reload();
						};
					});
				};
			};
		};
	};
};

if(table) {
	createTable();
	editTable();
};