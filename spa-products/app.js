const dynnamicContent = document.getElementById("content");


const routes = {
    "/": "/html/login.html",
    "/products": "/html/products.html",
    "/add": "/html/add.html",
    "/cart": "/html/cart.html",
    "/edit": "/html/edit.html"
};


document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        const path = e.target.getAttribute("href");
        navigate(path);
    }
});

async function navigate(path) {

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const navbar = document.getElementById("navbar");
    const navigationBar =
        `
    <nav>
        <a href="/products" data-link>Products</a>
        <a href="/add" data-link>Add Product</a>
        <a href="/cart" data-link>Cart</a>
        <button id="logout-btn" type="button">Logout</button>
    </nav>
    `;

    if (isLoggedIn) {
        navbar.innerHTML = navigationBar;
        const logoutBtn = document.getElementById("logout-btn")

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("loggedIn");
                navigate("/");
            });
        }
    } else {
        navbar.innerHTML = "";
    }

    if (!isLoggedIn && path !== "/") {
        return navigate("/");
    }

    if (isLoggedIn && path === "/") {
        return navigate("/products");
    }



    const cleanPath = path.split("?")[0];
    const route = routes[cleanPath];
    const html = await fetch(route).then(res => res.text());
    dynnamicContent.innerHTML = html;

    if (path === "/") setupLogin();
    if (path === "/products") setupProducts();
    if (path === "/add") setupAddForm();
    if (path.startsWith("/edit")) {
        setupEditForm(path);
    }
    if (path === "/cart") setupCart();
    history.pushState({}, "", path);
};

function setupLogin() {
    const login = document.getElementById("login-form");
    login.addEventListener("submit", (e) => {
        e.preventDefault();
        localStorage.setItem("loggedIn", "true");
        navigate("/products");
    })
}

function setupProducts() {
    const display = document.getElementById("product-list");
    display.innerHTML = "";
    fetch("http://localhost:3000/products")
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                display.innerHTML = "<p>No products available.</p>";
                return;
            }
            data.forEach(element => {
                const divContainer = document.createElement("div");
                divContainer.innerHTML = `
                <h3>${element.name}</h3>
                <p>${element.price}</p>
                `;
                const editBtn = document.createElement("button");
                editBtn.classList.add("edit-btn");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", () => {
                    navigate(`/edit?id=${element.id}`)
                });

                const addBtn = document.createElement("button");
                addBtn.textContent = "Add to Cart";
                addBtn.addEventListener("click", () => {
                    addToCart(element);
                });

                divContainer.appendChild(editBtn);
                divContainer.appendChild(addBtn);
                display.appendChild(divContainer);
            })
        })
};

function setupAddForm() {
    const form = document.getElementById("add-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formName = document.getElementById("name").value.trim();
        const formPrice = document.getElementById("price").value.trim();

        if (!formName || !formPrice || isNaN(formPrice)) {
            alert("Please enter valid values");
            return;
        };

        fetch("http://localhost:3000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formName, price: Number(formPrice) })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }
                return res.json();
            })
            .then(() => { navigate("/products") })
            .catch(error => console.error("Oops, looks like something went wrong", error));
    });

    form.reset();
}

function setupEditForm(path) {
    const URLparam = new URLSearchParams(path.split("?")[1]);
    const id = URLparam.get("id");
    const form = document.getElementById("edit-form");

    if (!id) {
        console.error("No product ID found in URL");
        return;
    }

    fetch(`http://localhost:3000/products/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").value = data.name;
            document.getElementById("price").value = data.price;
        });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedName = document.getElementById("name").value.trim();
        const updatedPrice = document.getElementById("price").value.trim();

        fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: updatedName,
                price: Number(updatedPrice)
            })
        })
            .then(res => res.json())
            .then(() => {
                navigate("/products");
            });
    });
}

function addToCart(product) {
    let cart = sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];
    cart.push(product);
    sessionStorage.setItem("cart", JSON.stringify(cart));
}

function setupCart() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";

    let cart = sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];

    cart.forEach(item => {
        cartItem = document.createElement("div");
        cartItem.innerHTML = `
        <h2>${item.name}</h2>
        <h3>${item.price}</h3>
        `;
        cartContainer.appendChild(cartItem);
    })

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>Total: ${total}</strong>`;
    cartContainer.appendChild(totalDiv);
}

window.addEventListener("popstate", () => {
    navigate(location.pathname);
});

navigate(location.pathname);