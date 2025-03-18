// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAxblilB8EEB3Z3X6Vt2pRUTIYunrPjiIU",
  authDomain: "resinecomsite-b81db.firebaseapp.com",
  databaseURL: "https://resinecomsite-b81db-default-rtdb.firebaseio.com",
  projectId: "resinecomsite-b81db",
  storageBucket: "resinecomsite-b81db.appspot.com",
  messagingSenderId: "218978469921",
  appId: "1:218978469921:web:c6c7f790b1d869442a7b60"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const imgbbAPIKey = "2dab2fe9bfd405da35d910f8142b4329";

// Upload Product Function
async function uploadProduct() {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("price").value;
    const discount = document.getElementById("discountPrice").value || "";
    const stock = document.getElementById("stock").value;
    const imageFile = document.getElementById("productImage").files[0];
    const uploadMsg = document.getElementById("uploadMessage");

    if (!id || !name || !price || !stock || !imageFile) {
        uploadMsg.innerText = "Fill all fields!";
        uploadMsg.style.color = "red";
        return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    const imageUrl = result.data.display_url;

    const productData = {
        id, name, price, discount, stock, imageUrl
    };

    db.ref("products/" + id).set(productData, () => {
        uploadMsg.innerText = "✔️ Product uploaded successfully!";
        uploadMsg.style.color = "green";
        document.getElementById("productId").value = "";
        document.getElementById("productName").value = "";
        document.getElementById("price").value = "";
        document.getElementById("discountPrice").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("productImage").value = "";
    });
}

// View All Products
function viewAllProducts() {
    const modal = document.getElementById("productModal");
    const modalItems = document.getElementById("modalProductItems");
    modalItems.innerHTML = "";
    modal.style.display = "flex";

    db.ref("products").once("value", snapshot => {
        snapshot.forEach(childSnapshot => {
            const prod = childSnapshot.val();
            const div = document.createElement("div");
            div.className = "product-item";
            div.innerHTML = `
                <div class="product-info">
                    <h4>${prod.name} - ₹${prod.price}</h4>
                    <p>Discount: ₹${prod.discount || "N/A"}, Stock: ${prod.stock}</p>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct('${prod.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${prod.id}')">Delete</button>
                </div>
            `;
            modalItems.appendChild(div);
        });
    });
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

// Delete Product
function deleteProduct(id) {
    if (confirm("Delete this product?")) {
        db.ref("products/" + id).remove(() => {
            alert("Deleted!");
            viewAllProducts();
        });
    }
}

// Edit Product (Basic - pre-fill form)
function editProduct(id) {
    db.ref("products/" + id).once("value", snapshot => {
        const data = snapshot.val();
        document.getElementById("productId").value = data.id;
        document.getElementById("productName").value = data.name;
        document.getElementById("price").value = data.price;
        document.getElementById("discountPrice").value = data.discount;
        document.getElementById("stock").value = data.stock;
        alert("Data loaded for editing. Upload again to save changes.");
        closeModal();
    });
}
