//Overlay Effect
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }


//Shopping Cart
//Remove Items
function removeItemFromCart( id ){
    let removedItem = document.querySelector(`#cartItem${id}`);
    removedItem.remove();
    updatingTotalPrice();
    
}

//Add Items
function addItem(item){
    addItemToCart(  item.dataset.index,
                    item.dataset.image,
                    item.dataset.price,
                    item.dataset.title,
                    1
                 );
}

function addItemToCart(index, image, price, title, quantity){
    let cartContent = document.querySelector("#cartContent");

    if ( !checkRepeats(index) ){
        alert("You have this item already!");
        updatingTotalPrice();
        overlayOn();
        return false;
    }
    
    cartContent.innerHTML =  cartContent.innerHTML + buildHTML( index, 
                                                                image, 
                                                                price, 
                                                                title, 
                                                                quantity
                                                            );

    updatingTotalPrice();
    saveCart();
    
    return true;

}

//Create the HTML
function buildHTML(index, image, price, title, quantity){
    let cartRowContents = `
        <div id="cartItem${index}" class="cart-row">
            <input type="hidden" id="itemId_${index}" value="${index}">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${image}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input  id="quantity${index}" 
                        class="cart-quantity-input" 
                        value="${quantity}"
                        type="number" 
                        onchange="updatingTotalPrice(this)" 
                        data-price="${price}"
                        data-id="${index}"
                        data-title="${title}"
                        data-image="${image}"
                        >
                <button class="remove-button" type="button" onclick="removeItemFromCart( ${index} )">REMOVE</button>
            </div>
        </div>`;

    return cartRowContents;
}

//Check for any repeating Items in Cart
function checkRepeats( id ){
    let items = document.querySelectorAll("input[type=hidden][id^='itemId_']");
    for(let item of items){
        if(item.value == id){
            return false;
        }
    }

    return true;
}

//Updating total Price
function updatingTotalPrice( qtyChanged ){
    if (qtyChanged){
        if( qtyChanged.value < 1){
            if(confirm("Do you want to remove this item?")){
                removeItemFromCart(qtyChanged.dataset.id);
            }
            else{
                return false;
            }
        }
    }

    let totalPrice= 0;
    let items = document.querySelectorAll("input[type=number][id^='quantity']");
    
    for( let item of items) {
        console.log("qty: " + item.value);
        totalPrice += item.value * item.dataset.price;
    }

    document.getElementById('cart-total-price').innerText = '$' + totalPrice.toFixed(2);
    saveCart();

    return true;
}

/*Purchase Cart*/
function purchaseClicked( id ) {

    alert('Thank you for your purchase!')

    let items = document.querySelectorAll("input[type=number][id^='quantity']");
    
    for(let item of items){
        if(item.value > 0){
            removeItemFromCart(item.dataset.id);
        }  
    }
    updateCartTotal();
    saveCart();

    return true;
}

//Web Storage Cart

function saveCart( id ) {
    if (typeof(Storage) !== "undefined") {
        // Store
        let items = document.querySelectorAll("input[type=number][id^='quantity']");
        let itemsArray = [];
        for(let item of items){
            let itemObject = {
                            "itemTitle": item.dataset.title,
                            "itemQuantity": item.value,
                            "itemIndex": item.dataset.id,
                            "itemPrice": item.dataset.price,
                            "itemImage":item.dataset.image
            }
            itemsArray.push(itemObject);
        }
        console.log(itemsArray)
        window.localStorage.setItem("shoppingCart", JSON.stringify(itemsArray));
       
      } else {
        document.getElementById("cartTotal").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
}

function getCart(){
    if (typeof(Storage) !== "undefined") {
        // Retrieve
        if(localStorage.getItem("shoppingCart") != null){
            let savedCart =  JSON.parse(localStorage.getItem("shoppingCart"));

            if(savedCart){
                for(let item of savedCart){
                    addItemToCart(item.itemIndex, item.itemImage, item.itemPrice, item.itemTitle, item.itemQuantity);
                }
            }
        }
    }
    else {
        document.getElementById("cartTotal").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
    
    return null;

}


window.onload = function(){
    getCart();    
}