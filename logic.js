// Scroll to services when hero button is clicked
document.querySelector(".book-btn").addEventListener("click", function () {
    document.querySelector("#services").scrollIntoView({
        behavior: "smooth"
    });
});

// ================= CART DATA =================
let cart = [];
let totalAmount = 0;

// ELEMENTS
const serviceRows = document.querySelectorAll(".service-row");
const itemsTable = document.getElementById("items-table");
const totalBox = document.getElementById("total-box");
const noItemsBox = document.getElementById("no-items-box");
const totalAmountSpan = totalBox.querySelector("span");

const bookBtn = document.getElementById("book-btn");
const bookWarning = document.getElementById("book-warning");
const successMsg = document.getElementById("success-msg");

// FORM INPUTS
const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

// ================= ADD / REMOVE SERVICES =================
serviceRows.forEach((row) => {
    const name = row.querySelector("span").innerText.trim();
    const price = parseInt(row.querySelector(".price").innerText.replace("₹", ""));
    const btn = row.querySelector("button");

    btn.addEventListener("click", () => {
        const isAdded = btn.classList.contains("active");

        if (!isAdded) {
            cart.push({ name, price });
            totalAmount += price;

            btn.classList.add("active");
            btn.innerText = "Remove Item −";
            btn.style.background = "red";
            btn.style.color = "white";
        } else {
            cart = cart.filter((item) => item.name !== name);
            totalAmount -= price;

            btn.classList.remove("active");
            btn.innerText = "Add Item ＋";
            btn.style.background = "";
            btn.style.color = "";
        }

        updateCartUI();
    });
});

// ================= UPDATE CART UI =================
function updateCartUI() {
    // ---------------- EMPTY CART ----------------
    if (cart.length === 0) {
        resetCartUI();
        updateBookButton();
        return;
    }

    // ---------------- SHOW ADDED ITEMS ----------------
    noItemsBox.style.display = "none";
    itemsTable.style.display = "table";
    totalBox.style.display = "flex";

    // Clear previous rows
    const oldRows = itemsTable.querySelectorAll("tr:not(:first-child)");
    oldRows.forEach((r) => r.remove());

    // Add new rows
    cart.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>₹${item.price}.00</td>
        `;
        itemsTable.appendChild(tr);
    });

    totalAmountSpan.innerText = `₹${totalAmount}.00`;
    updateBookButton();
}

// ================= RESET CART UI =================
function resetCartUI() {
    // Remove all table rows except header
    const rows = itemsTable.querySelectorAll("tr:not(:first-child)");
    rows.forEach(r => r.remove());

    // Table header visible
    itemsTable.style.display = "table";

    // Show "No Items Added" BELOW table
    noItemsBox.style.display = "flex";
    itemsTable.insertAdjacentElement("afterend", noItemsBox);

    // Reset total
    totalAmountSpan.innerText = "₹0.00";
    totalBox.style.display = "flex";
}

// ================= ENABLE / DISABLE BOOK BUTTON =================
function updateBookButton() {
    if (cart.length === 0) {
        bookBtn.disabled = true;
        bookBtn.style.opacity = "0.6";
    } else {
        bookBtn.disabled = false;
        bookBtn.style.opacity = "1";
    }
}

// ================= RESET CART =================
function resetCart() {
    cart = [];
    totalAmount = 0;

    serviceRows.forEach((row) => {
        const btn = row.querySelector("button");
        btn.classList.remove("active");
        btn.innerText = "Add Item ＋";
        btn.style.background = "";
        btn.style.color = "";
    });

    updateCartUI();
}

// ================= BOOK NOW CLICK =================
bookBtn.addEventListener("click", (e) => {
    e.preventDefault(); // STOP refresh

    // ---- CASE 1: Cart empty ----
    if (cart.length === 0) {
        successMsg.style.display = "none";
        bookWarning.innerText = "Add items to cart before booking";
        bookWarning.style.display = "block";
        return;
    }

    // ---- CASE 2: Form incomplete ----
    if (
        fullName.value.trim() === "" ||
        email.value.trim() === "" ||
        phone.value.trim() === ""
    ) {
        successMsg.style.display = "none";
        bookWarning.innerText = "Please fill all details before booking";
        bookWarning.style.display = "block";
        return;
    }

    // ---- SUCCESS ----
    bookWarning.style.display = "none";
    successMsg.style.display = "block";

    // ✨ 3 seconds ke baad message hide hoga
    setTimeout(() => {
        successMsg.style.display = "none";
    }, 3000);

    // Clear form
    fullName.value = "";
    email.value = "";
    phone.value = "";

    // Reset the cart
    resetCart();
});
