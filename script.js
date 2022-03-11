const shopEl = document.querySelector(".shop")
const cartEl = document.querySelector(".cart")
let items = []

let cart = []

const renderError = function (heading, message) {
    const alertEl = document.querySelector(".alert")
    alertEl.classList.remove("hidden")
    alertEl.style.opacity = 100
    alertEl.querySelector("h3").textContent = heading
    alertEl.querySelector("p").textContent = message
    setTimeout(() => {
        alertEl.style.opacity = 0
        alertEl.classList.add("hidden")
    }, 5000)
}

const totalPrice = function () {
    return cart.reduce((acc, curr) => (acc += +curr.price), 0)
}

const renderShop = function () {
    items.forEach((item) => {
        let sizes = item.sizes.reduce(
            (val, curr) => (val += `<option value="${curr}">${curr}</option>`),
            0
        )
        let template = `
    <div class="item">
      <img src="${item.src}" class="item-img"/>
      <div><h3>${item.name}</h3>
      <p>${
          item.currency == "$"
              ? `<span class="currency">${item.currency}</span> <span class="price">${item.price}</span>`
              : `<span class="price">${item.price}</span> <span class="currency">${item.currency}</span>`
      }</p>
      <select name="sizes" id="size-select">
      <option value="">Please choose a size</option>
      ${sizes}
      </select>

      <button class="add-to-cart">Add to cart</button></div>
    </div>
    `
        shopEl.insertAdjacentHTML("beforeend", template)
    })
}

const getLocalCartItems = function () {
    const localCart = localStorage.getItem("localCart")
    if (localCart == null) return
    // set items
    cart = JSON.parse(localCart)
    // render items
    updateCartView()
    // Render json
}

const removeItem = function (id) {
    const filtered = cart.filter((item) => item.id !== id)
    cart = filtered
    localStorage.setItem("localCart", JSON.stringify(cart))
    updateCartView()
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
    const total = totalPrice()

    cartEl.parentElement.querySelector("span").textContent = total
}

const attachListeners = function () {
    const addToCartBtns = document.querySelectorAll(".add-to-cart")
    addToCartBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const src = btn.parentElement.parentElement.querySelector("img").src
            const name = btn.parentElement.querySelector("h3").innerHTML
            const price = btn.parentElement.querySelector(".price").innerHTML
            const currency =
                btn.parentElement.querySelector(".currency").innerHTML
            const size =
                btn.parentElement.querySelector("select").selectedOptions[0]
                    .value

            if (!size) {
                renderError(
                    "You didn't select a size for the product",
                    "Please choose a shoe size and try again"
                )
                return
            }
            const item = {
                id: Date.now(),
                name,
                src,
                price,
                currency,
                size,
            }
            cart.push(item)
            localStorage.setItem("localCart", JSON.stringify(cart))
            updateCartView()
        })
    })
}

const fetchItems = async function () {
    try {
        const { items: data } = await fetch("http://localhost:3000/items").then(
            (res) => res.json()
        )
        getLocalCartItems()
        data.forEach((item) => {
            items.push(item)
        })
        renderShop()
        attachListeners()
    } catch (e) {
        let template = `
        <div class="failed-fetch">
            <h1>Fetching data from API was unsuccessfull, please reach out to <a href="emailto:support@webshop.se">support@webshop.se</a></h1>
        </div>
        `
        shopEl.style.display = ""

        shopEl.insertAdjacentHTML("beforeend", template)
    }
}

const init = function () {
    // Code that runs when application starts
    // Render items
    fetchItems()
}

init()
