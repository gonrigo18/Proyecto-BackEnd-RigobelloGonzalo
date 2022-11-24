const productsApi = {
    get: () => {
        return fetch('/api/products')
            .then(data => data.json());
    }
}

const cartApi = {
    createCart: () => {
        const options = { method: "POST" }
        return fetch('/api/cart', options)
            .then(data => data.json());
    },
    getIds: () => {
        return fetch('/api/cart')
            .then(data => data.json());
    },
    postProd: (idCart, idProd) => {
        const data = { id: idProd }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        return fetch(`/api/cart/${idCart}/products`, options);
    },
    getProds: idCart => {
        return fetch(`/api/cart/${idCart}/products`)
            .then(data => data.json());
    },
    deleteProd: (idCart, idProduct) => {
        const options = {
            method: 'DELETE',
        }
        return fetch(`/api/cart/${idCart}/products/${idProduct}`, options);
    }
}

loadSelectedProducts();
loadSelectedCart();

document.getElementById('btnAddToCart').addEventListener('click', () => {
    const idCart = document.getElementById('selectedCart').value;
    const idProd = document.getElementById('selectedProducts').value;
    if (idCart && idProd) {
        addToCart(idCart, idProd);
    } else {
        alert('debe seleccionar un carrito y un producto');
    }
})

document.getElementById('btnCreateCart').addEventListener('click', () => {
    cartApi.createCart()
        .then(({ id }) => {
            loadSelectedCart().then(() => {
                const selected = document.getElementById('selectedCart');
                selected.value = `${id}`;
                selected.dispatchEvent(new Event('change'));
            })
        })
})

document.getElementById('selectedCart').addEventListener('change', () => {
    const idCart = document.getElementById('selectedCart').value
    updateCartList(idCart);
})

function addToCart(idCart, idProduct) {
    return cartApi.postProd(idCart, idProduct).then(() => {
        updateCartList(idCart);
    })
}

function deleteFromCart(idProduct) {
    const idCart = document.getElementById('selectedCart').value;
    return cartApi.deleteProd(idCart, idProduct).then(() => {
        updateCartList(idCart);
    })
}

function updateCartList(idCart) {
    return cartApi.getProds(idCart)
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('cart').innerHTML = html;
        })
}

function makeHtmlTable(products) {
    let html = `
        <style>
            .table td,
            .table th {
                vertical-align: middle;
            }
        </style>`

    if (products.length > 0) {
        html += `
        <h2>Lista de Productos</h2>
        <div class="table-responsive">
            <table class="table table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                    <th>Category</th>
                </tr>`
        for (const prod of products) {
            html += `
                    <tr>
                    <td>${prod.title}</td>
                    <td>$${prod.price}</td>
                    <td><img width="50" src=${prod.thumbnail} alt="not found"></td>
                    <td>${prod.category}</td>
                    <td><a type="button" onclick="quitarDelCarrito('${prod.id}')">borrar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    } else {
        html += `<br><h4>carrito sin productos</h2>`
    }
    return Promise.resolve(html);
}

function createMenu(leyend) {
    const defaultItem = document.createElement("option");
    defaultItem.value = '';
    defaultItem.text = leyend;
    defaultItem.hidden = true;
    defaultItem.disabled = true;
    defaultItem.selected = true;
    return defaultItem;
}

function loadSelectedProducts() {
    return productsApi.get()
        .then(products => {
            const selected = document.getElementById('selectedProducts');
            selected.appendChild(createMenu('elija un producto'));
            for (const prod of productos) {
                const selectedItem = document.createElement("option");
                selectedItem.value = prod.id;
                selectedItem.text = prod.title;
                selected.appendChild(selectedItem);
            }
        })
}

function deleteSelected(selected) {
    while (selected.childElementCount > 0) {
        selected.remove(0);
    }
}

function loadSelectedCart() {
    return cartApi.getIds()
        .then(ids => {
            const selected = document.getElementById('salectedCart');
            vaciarCombo(selected);
            selected.appendChild(createMenu('elija un carrito'));
            for (const id of ids) {
                const selectedItem = document.createElement("option");
                selectedItem.value = id;
                selectedItem.text = id;
                selected.appendChild(selectedItem);
            }
        })
}