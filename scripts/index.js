let orders = {
    1 : [],
    2 : [],
    3 : [],
    4 : []
};

let totalPriceOfTables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

let totalItemsOfTables = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

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

    console.log(parentOfThisElement.id);

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

    console.log(orders);
}

function viewTable(event) {

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
    
    for(let i = 0; i < orders[table_id].length; i++) {
        let newRow = tbodyRef.insertRow();
        let newCol = newRow.insertCell();
        newCol.append(i+1);

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
        
        newCol.appendChild(inputTag);

        inputTag.addEventListener("input", function() {
                newInputs = document.getElementsByName("quantityNewInput");
            
                for(let i = 0; i < newInputs.length; i++) {
                    if(newInputs[i].value != orders[table_id][i]["quantity"]) {
                        console.log("changed");
                        let change = newInputs[i].value - orders[table_id][i]["quantity"];
                        orders[table_id][i]["quantity"] = newInputs[i].value;
                        console.log(change);
                        
                        totalItemsOfTables[table_id] += change;
                        console.log(totalItemsOfTables[table_id]);

                        totalPriceOfTables[table_id] += (change * orders[table_id][i]["price"]);
                        console.log(totalPriceOfTables[table_id]);

                        printPricesAndItems();

                        computeTotalPrice(table_id);
                    }
                }
        });

        newCol = newRow.insertCell();
        let removeButton = document.createElement("button");
        /*removeButton.type = "button";
        removeButton.name = "removeItem";*/
        removeButton.id = "removeItem";
        
        let bin = document.createElement("i");
        bin.className = "fa fa-trash";
        removeButton.appendChild(bin);

        console.log(bin);
        removeButton.style.width = "100%";
        newCol.appendChild(removeButton);

        removeButton.onclick = function() {
            console.log(newRow);
            console.log(name);

            /*
            console.log(orders[table_id]);
            console.log(orders[table_id][i]);
            console.log(typeof orders[table_id]);
            console.log(typeof orders[table_id][i]);

            console.log(orders[table_id].length);
            */

            for(let j = 0; j < orders[table_id].length; j++) {
                if(orders[table_id][j]["name"] == name) {
                    console.log("same");
                    /*delete orders[table_id][j];*/
                }
            }
            
        }
    }
    computeTotalPrice(table_id);
}

function closeTable(event) {
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
    console.log(dropDownValue);

    let items = document.getElementsByClassName("item");

    if(dropDownValue.toLowerCase() === "select") {
        for(let i = 0; i < items.length; i++) {
            console.log(items[i]);
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