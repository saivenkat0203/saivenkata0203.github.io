let orders = {
    1 : [],
    2 : [],
    3 : [],
    4 : [],
    5 : []
};

let totalPriceOfTables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
};

let totalItemsOfTables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
};

let bills = [];

table_popup = document.getElementsByClassName("table-details")[0];

window.onload = printPricesAndItems();

function printPricesAndItems() {
    let tables = document.getElementsByClassName("table");

    for(let i = 0; i < tables.length; i++) {
        let totalItems = tables[i].getElementsByClassName("total-items");
        let totalPrice = tables[i].getElementsByClassName("total-price");

        totalItems[0].childNodes[0].data = "TOTAL ITEMS: " + totalItemsOfTables[i+1];
        totalPrice[0].childNodes[0].data = "TOTAL PRICE: " + totalPriceOfTables[i+1];
    }
}

function searchTables() {
    let tables = document.getElementsByClassName("table");
    let input = document.getElementById("search1").value;

    for(let i = 0; i < tables.length; i++) {
        let name = tables[i].getElementsByClassName("table-name");

        if(name[0].innerHTML.toLowerCase().indexOf(input.toLowerCase()) > -1) {
            tables[i].style.display = "";
        }
        else {
            tables[i].style.display = "none";
        }
    }
}

function searchMenu() {
    let items = document.getElementsByClassName("item");
    let input = document.getElementById("search2").value;

    for(let i = 0; i < items.length; i++) {
        let name = items[i].getElementsByClassName("name");

        let course = name[0].id;
    
        if(name[0].innerHTML.toLowerCase().indexOf(input.toLowerCase()) > -1 || course.toLowerCase().indexOf(input.toLowerCase()) > -1) {
            items[i].style.display = "";
        }
        else {
            items[i].style.display = "none";
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");

    addItemToTable(ev, data);
}

function addItemToTable(ev, data) {
    let x = document.getElementById(data);
    
    let name = x.getElementsByClassName("name")[0].innerHTML;

    let priceString = x.getElementsByClassName("price")[0].innerHTML;
    let lengthOfString = x.getElementsByClassName("price")[0].innerHTML.length;
    let price = parseInt(priceString.slice(0,lengthOfString-2));

    let parentOfThisElement;

    if(ev.target.className == "table-name" || ev.target.className == "total-items" || ev.target.className == "total-price") {
        parentOfThisElement = ev.target.parentElement;
    }
    else {
        parentOfThisElement = ev.target;
    }

    let tableId = parentOfThisElement.id[0];
    
    totalItemsOfTables[tableId] += 1;
    totalPriceOfTables[tableId] += price;

    printPricesAndItems();
    
    let found = false;
    for(let i = 0; i < orders[tableId].length; i++) {
        if(orders[tableId][i]["name"] == name) {
            orders[tableId][i]["quantity"] += 1;
            found = true;
        }
    }

    if(!found) {
        orders[tableId].push({name, price, quantity: 1});
    }
}

function viewTable(event) {
    document.getElementsByClassName("DTOrder")[0].style.display = "none";
    items = document.getElementsByClassName("item");

    for(let i = 0; i < items.length; i++) {
        items[i].setAttribute("draggable", false);
    }

    table_popup = document.getElementsByClassName("table-details")[0];
    table_popup.style.display = "block";

    let parentOfThisElement;

    if(event.target.className == "table-name" || event.target.className == "total-items" || event.target.className == "total-price") {
        parentOfThisElement = event.target.parentElement;
    }
    else {
        parentOfThisElement = event.target;
    }

    let table_id = parseInt(parentOfThisElement.id[0]);
    let insertID = document.getElementById("table-id");

    insertID.innerHTML = table_id;
    
    computeTable(table_id);
}

function computeTable(table_id) {
    let tbodyRef = document.getElementById("orders-table").getElementsByTagName("tbody")[0];

    tbodyRef.innerHTML = "";
    
    let k = 0;    
    for(let i = 0; i < orders[table_id].length; i++) {
        if(orders[table_id][i]["quantity"] == 0){
            continue;
        }
        let newRow = tbodyRef.insertRow();
        let newCol = newRow.insertCell();
        newCol.append(k+1);
        k++;

        newCol = newRow.insertCell();
        newText = document.createTextNode(orders[table_id][i]["name"]);
        let name = orders[table_id][i]["name"];
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        newText = document.createTextNode(orders[table_id][i]["price"]);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        let inputTag = document.createElement("input");
        inputTag.type = "number";
        inputTag.name = "quantityNewInput";
        inputTag.id = "quantityNewInput";
        inputTag.value = orders[table_id][i]["quantity"];
        inputTag.min = "1";
        inputTag.style.width = "90%";
        inputTag.style.backgroundColor = "rgb(144, 235, 206)";
        newCol.appendChild(inputTag);

        inputTag.addEventListener("input", function() {
                newInputs = document.getElementsByName("quantityNewInput");
            
                for(let i = 0; i < newInputs.length; i++) {
                    if(newInputs[i].value != orders[table_id][i]["quantity"]) {
                        let change = newInputs[i].value - orders[table_id][i]["quantity"];
                        orders[table_id][i]["quantity"] = newInputs[i].value;
                        
                        totalItemsOfTables[table_id] += change;

                        totalPriceOfTables[table_id] += (change * orders[table_id][i]["price"]);

                        printPricesAndItems();

                        computeTotalPrice(table_id);
                    }
                }
        });

        newCol = newRow.insertCell();
        let removeButton = document.createElement("button");
        removeButton.id = "removeItem";
        removeButton.style.backgroundColor = "rgb(144, 235, 206)";
        
        let bin = document.createElement("i");
        bin.className = "fa fa-trash";
        removeButton.appendChild(bin);

        removeButton.style.width = "100%";
        newCol.appendChild(removeButton);

        removeButton.onclick = function() {
            let k;

            for(let j = 0; j < orders[table_id].length; j++) {
                if(orders[table_id][j]["name"] == name) {
                    k = j;
                }
            }
            deleteItemFromTable(table_id, k);
        }
    }
    computeTotalPrice(table_id);
    printPricesAndItems();
}

function deleteItemFromTable(table_id, k) {
    let q = orders[table_id][k]["quantity"];
    orders[table_id][k]["quantity"] = 0;
    totalPriceOfTables[table_id] -= q * orders[table_id][k]["price"];
    totalItemsOfTables[table_id] -= q;

    computeTable(table_id);
}

function closeTable() {
    table_popup.style.display = "none";

    items = document.getElementsByClassName("item");

    for(let i = 0; i < items.length; i++) {
        items[i].setAttribute("draggable", true);
    }
}

function computeTotalPrice(table_id) {
    let total = document.getElementsByClassName("totalPrice-tableView")[0];
    total.innerHTML = "Total price: " + totalPriceOfTables[table_id];
}

function filterItems() {
    let dropDownValue = document.getElementById("course-type").value;

    let items = document.getElementsByClassName("item");

    if(dropDownValue.toLowerCase() === "select") {
        for(let i = 0; i < items.length; i++) {
            items[i].style.removeProperty("display");
        }
    }
    else {
        for(let i = 0; i < items.length; i++) {
            let name = items[i].getElementsByClassName("name");
            let course = name[0].id;
        
            if(course.toLowerCase().indexOf(dropDownValue.toLowerCase()) > -1) {
                items[i].style.display = "";
            }
            else {
                items[i].style.display = "none";
            }
        }
    }
}

function generateBill() {
    let bill = document.getElementsByClassName("DTOrder")[0];
    bill.style.display = "block";

    let currentdate = new Date(); 
    let datetime = "Date: " + currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + 
                   " Time:" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    document.getElementById("dateTime").innerHTML = datetime;
}

function confirmBill(event) {
    let idOfTable = document.getElementById("table-id").innerText;

    if(event.target.value == "Yes") {
        let items = [];
        let totalPrice;
        let totalItems;
        let dateOfOrder;
        let timeOfOrder;
        for(let i = 0; i < orders[idOfTable].length; i++) {
            if(orders[idOfTable][i]["quantity"] > 0) {
                let name = orders[idOfTable][i]["name"];
                let price = orders[idOfTable][i]["price"];
                let quantity = orders[idOfTable][i]["quantity"];

                totalPrice = totalPriceOfTables[idOfTable];
                totalItems = totalItemsOfTables[idOfTable];

                let currentdate = new Date(); 
                dateOfOrder = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear();
                timeOfOrder = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

                items.push({name, price, quantity});
            }
        }
        bills.push({idOfTable, dateOfOrder, timeOfOrder, totalItems, totalPrice, items});

        document.getElementsByClassName("DTOrder")[0].style.display = "none";
        document.getElementById("done").style.display = "block";
        setTimeout(message ,2000);

        function message() {
            document.getElementById("done").style.display = "none";
            closeTable();
        }
        orders[idOfTable] = [];
        totalItemsOfTables[idOfTable] = 0;
        totalPriceOfTables[idOfTable] = 0;

        printPricesAndItems();


    }

    else {
        document.getElementsByClassName("DTOrder")[0].style.display = "none";
    }
}

function viewBills() {
    let billsElement = document.getElementsByClassName("bills")[0];
    console.log(billsElement);
    billsElement.style.display = "block";
    billsElement = document.getElementsByClassName("innerBills")[0];
    
    let tbodyRef = document.getElementById("main-bills");
    tbodyRef.innerHTML = "";

    for(let i = 0; i < bills.length; i++) {
        console.log(bills[i]);

        let date = bills[i]["dateOfOrder"];
        let time = bills[i]["timeOfOrder"];
        let id = bills[i]["idOfTable"];
        let totalItems = bills[i]["totalItems"];
        let totalPrice = bills[i]["totalPrice"];
        let items = bills[i]["items"];

        let newRow = tbodyRef.insertRow();
        let newCol = newRow.insertCell();
        newCol.append(i+1);

        newCol = newRow.insertCell();
        newText = document.createTextNode(date);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        newText = document.createTextNode(time);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        newText = document.createTextNode(id);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        newText = document.createTextNode(totalItems);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        newText = document.createTextNode(totalPrice);
        newCol.appendChild(newText);

        newCol = newRow.insertCell();
        console.log(items);
        let ol = document.createElement("ol");
        ol.style.textAlign = "left";
        for(let j = 0; j < items.length; j++) {
            let li = document.createElement("li");
            li.id = "li";
            let text = `${items[j]["name"]} - ${items[j]["price"]} x${items[j]["quantity"]}`;
            li.appendChild(document.createTextNode(text));
            ol.appendChild(li);
        }
    
        newCol.appendChild(ol);        
    }
    
}

function closeBill(event) {
    let billsElement = document.getElementsByClassName("bills")[0];
    billsElement.style.display = "none";
}