const shopEl = document.querySelector(".shop")
const cartEl = document.querySelector(".cart")
let items = []

let cart = []

const renderJSON = function () {
    document.querySelector("code").textContent = JSON.stringify(cart)
}

const renderShop = function () {
    items.forEach((item) => {
        let sizes = item.sizes.reduce(
            (val, curr) => (val += `<option value="${curr}">${curr}</option>`),
            0
        )
        let template = `
    <div class="item">
      <img src="${item.src}" class="item-img" /> 
      <h3>${item.name}</h3>
      <p>${
          item.currency == "$"
              ? `<span class="currency">${item.currency}</span> <span class="price">${item.price}</span>`
              : `<span class="price">${item.price}</span> <span class="currency">${item.currency}</span>`
      }</p>
      <select name="sizes" id="size-select">
      <option value="">Please choose a size</option>
      ${sizes}
      </select>

      <button class="add-to-cart">Add to cart</button>
    </div>
    `
        shopEl.insertAdjacentHTML("beforeend", template)
    })
}

const removeItem = function (id) {
    const filtered = cart.filter((item) => item.id !== id)
    console.log("Filtered", filtered)
    cart = filtered
    console.log("Cart", cart)
    updateCartView()
    renderJSON()
}

const updateCartView = function () {
    // Tomma ner cart
    cartEl.innerHTML = ""
    // Loopa igenom listan igen vid uppdateringen och rendrera elementet
    cart.forEach((item) => {
        const template = `
        <div class="cart-item">
        <div><img src="${item.src}" height="80px"/></div>
        <span><b>${item.name}</b></span>
        
        <span>
        Price:${item.price} ${item.currency}
        Size: ${item.size}</span>
        <button onclick="removeItem(${item.id})">Remove</button>
        </div>
        `
        cartEl.insertAdjacentHTML("beforeend", template)
    })
}

const attachListeners = function () {
    const addToCartBtns = document.querySelectorAll(".add-to-cart")
    addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const src = btn.parentElement.querySelector("img").src
            const name = btn.parentElement.querySelector("h3").innerHTML
            const price = btn.parentElement.querySelector(".price").innerHTML
            const currency =
                btn.parentElement.querySelector(".currency").innerHTML
            const size =
                btn.parentElement.querySelector("select").selectedOptions[0]
                    .value
            const item = {
                id: Date.now(),
                name,
                src,
                price,
                currency,
                size,
            }
            cart.push(item)
            renderJSON()
            updateCartView()
        })
    })
}

const fetchItems = async function () {
    const { items: data } = await fetch("http://localhost:3000/items").then(
        (res) => res.json()
    )
    if (data) {
        data.forEach((item) => {
            items.push(item)
        })
        renderShop()
        attachListeners()
    } else {
        console.error("Failed to fetch data")
    }
}

const init = function () {
    // Code that runs when application starts
    // Render items
    fetchItems()
    renderJSON()
}

init()
