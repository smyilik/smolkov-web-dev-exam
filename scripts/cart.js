const API_KEY = '43226412-da53-4a2d-b184-749a4cfe212e';
const API_URL = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods";
const API_URL2 = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders";
const ORDER_URL = `${API_URL2}?&api_key=${API_KEY}`;

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

async function getProducts() {
    try {
        const res = await fetch(
            `${API_URL}?api_key=${API_KEY}`
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

async function showProducts() {
    const products = await getProducts();
    let storage = JSON.parse(localStorage.getItem("addedToCart"));
    let cost = 0;
    if (!storage) {
        storage = [];
    }

    products.forEach(i => {
        if (storage.includes(i.id)) {
            const product_card = document.createElement("div");
            product_card.className = "product-card addedToCart";
            cost += i.discount_price ? i.discount_price : i.actual_price;

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
            button.textContent = "Удалить из корзины";
            button.className = "product-button font-2";
            button.addEventListener("click", () => {
                product_card.classList.remove("addedToCart");
                removeID(i.id);
                product_card.style.visibility = 'hidden';

                const listOfProducts = document.querySelector(".products-list");
                listOfProducts.innerHTML = '';
                showProducts();
            });
            
            product_card.appendChild(img_figure);
            product_card.appendChild(details);
            product_card.appendChild(button);
            
            const products = document.querySelector(".products-list");
            products.appendChild(product_card);
        }
    });
    const total_price = document.getElementById('total-price');
    total_price.textContent = `Итоговая стоимость: ${cost}₽`;
    return;
}


function showLocalStorage() {
    const storage = JSON.parse(localStorage.getItem("addedToCart"));
    console.log("Выбранные товары:", storage);
}

document.addEventListener("DOMContentLoaded", showProducts);
