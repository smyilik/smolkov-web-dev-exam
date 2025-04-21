const API_KEY = '43226412-da53-4a2d-b184-749a4cfe212e';
const API_URL = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods";

let page = 1;
const pageLoad = 9;

function closeAlert() {
    const alert = document.getElementsByClassName('notification');
    if (alert) {
        alert[0].parentElement.style.display='none';
    }
    document.getElementById('header-wrap').style.height = '80px';
}

function showAlert(message, type = 'info') {
    const alert = document.getElementById('alert');
    if (!alert) {
        console.error('Нет доступа к уведомлению');
        return;
    }

    const notification = document.createElement('div');
    notification.innerHTML = `
        <span class="closebtn" onclick="closeAlert()">&times;</span>
        ${message}
    `;
    notification.className = 'notification';
}

async function getProducts(page) {
    try {
        const res = await fetch(
            `${API_URL}?api_key=${API_KEY}&page=${page}&per_page=${pageLoad}`
        );
        if (!res) {
            throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        showAlert('Error', 'error');
        return;
    }
}

function addID(id) {
    let storage = JSON.parse(localStorage.getItem("addedToCart"));
    if (!storage) {
        storage = [];
    }
    if (!storage.includes(id)) {
        storage.push(id);
        localStorage.setItem("addedToCart", JSON.stringify(storage));
    }
}

function removeID(id) {
    let storage = JSON.parse(localStorage.getItem("addedToCart"));
    if (!storage) {
        storage = [];
    }
    if (storage.includes(id)) {
        storage.splice(storage.indexOf(id), 1);
        localStorage.setItem("addedToCart", JSON.stringify(storage));
    }
}

function showRating(rating) {
    const round = Math.round(rating); 
    const full = round;
    const empty = 5 - full;
    return `<span>${rating}</span>
    <span>${'✦'.repeat(full) + '✧'.repeat(empty)}</span>`;
}

function Discount(first, second) {
    return Math.round(((first - second) / first) * 100);
}

function showProducts(products) {
    let storage = JSON.parse(localStorage.getItem("addedToCart"));
    if (!storage) {
        storage = [];
    }

    products.forEach(i => {
        const product_card = document.createElement("div");
        product_card.className = "product-card";

        const img_figure = document.createElement("figure");
        img_figure.className = "img-figure";
        const img = document.createElement("img");
        img.src = i.image_url;
        img.alt = i.name;
        img_figure.appendChild(img);
        const details = document.createElement("div");
        details.className = "product-details font-2";
        const name = document.createElement("h3");
        name.textContent = i.name;
        details.appendChild(name);
        const category = document.createElement("p");
        category.textContent = `Категория: ${i.main_category}`;
        details.appendChild(category);
        const rating = document.createElement("p");
        rating.innerHTML = `Рейтинг: ${showRating(i.rating)}`;
        details.appendChild(rating);
        const price = document.createElement("p");
        const firstPrice = `${i.actual_price} ₽`;
        const secondPrice = i.discount_price ? `<span>${i.discount_price} ₽</span>` : null;
        const discount = i.discount_price ? `<span>- ${Discount(i.actual_price, i.discount_price)}%</span>` : "";
        price.innerHTML = secondPrice ? `${secondPrice} <s> ${firstPrice}</s> ${discount}` : firstPrice;
        details.appendChild(price);
        const button = document.createElement("button");
        button.textContent = "Добавить в корзину";
        button.className = "product-button font-2";
        button.addEventListener("click", () => {
            if (storage.includes(i.id)) {
                button.textContent = "Добавить в корзину";
                product_card.classList.remove("addedToCart");
                removeID(i.id);
            } else {
                button.textContent = "Удалить из корзины";
                product_card.classList.add("addedToCart");
                addID(i.id);
            }
        });

        if (storage.includes(i.id)) {
            product_card.classList.add("addedToCart");
            button.textContent = "Удалить из корзины";
        }
        
        product_card.appendChild(img_figure);
        product_card.appendChild(details);
        product_card.appendChild(button);
        
        const products = document.querySelector(".products-list");
        products.appendChild(product_card);
    });
    return;
}

async function load() {
    const data = await getProducts(page);
    // console.log(data);
    const loadButton = document.querySelector(".load");

    if (data.goods) {
        showProducts(data.goods);

        const all = Math.ceil(data._pagination.total_count / pageLoad);
        if (page >= all) {
            loadButton.style.display = "none";
        } else {
            page += 1;
        }
    } else {
        console.error("Нет доступа к товарам");
        showAlert('Нет доступа к товарам', 'error');
    }
}

function showLocalStorage() {
    const storage = JSON.parse(localStorage.getItem("addedToCart"));
    console.log("Выбранные товары:", storage);
}

const loadButton = document.querySelector(".load");
loadButton.addEventListener("click", load);

document.addEventListener("DOMContentLoaded", load);
