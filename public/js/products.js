const productsApi = {
    get: () => {
        return fetch('/api/products')
            .then(data => data.json())
    },
    post: (newProd) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProd)
        }
        return fetch('/api/products', options);
    },
    put: (idProd, newProd) => {
        const options = {
            method: 'PUT',
            body: JSON.stringify(newProd),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return fetch(`/api/products/${idProd}`, options);
    },
    delete: (idProd) => {
        const options = {
            method: 'DELETE'
        }
        return fetch(`/api/products/${idProd}`, options);
    },
}

// productos

updateProductsList();

const formAddProduct = document.getElementById('formAddProduct');
formAddProduct.addEventListener('submit', e => {
    e.preventDefault();
    const product = readProductForm();
    productsApi.post(product)
        .then(updateProductsList)
        .then(() => {
            formAddProduct.reset();
        })
        .catch((err) => {
            alert(err.message);
        })
})

function readProductForm() {
    const product = {
        title: formAddProduct[0].value,
        price: formAddProduct[1].value,
        thumbnail: formAddProduct[2].value,
        category: formAddProduct[3].value
    }
    return product;
}

function updateProductsList() {
    return productsApi.get()
        .then(prods => makeHtmlTable(prods))
        .then(html => {
            document.getElementById('products').innerHTML = html
        })
}

function deleteProduct(idProd) {
    productsApi.delete(idProd)
        .then(updateProductsList)
}

function updateProduct(idProd) {
    const newProd = readProductForm();
    productsApi.put(idProd, newProd)
        .then(updateProductsList);
}


function completeForm(title = '', price = '', thumbnail = '', category ='') {
    formAddProduct[0].value = title
    formAddProduct[1].value = price
    formAddProduct[2].value = thumbnail,
    formAddProduct[3].value = category
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
                    <th>Imagen</th>
                    <th>Category</th>
                </tr>`
        for (const prod of products) {
            html += `
                    <tr>
                    <td><a type="button" onclick="completeForm('${prod.title}', '${prod.price}','${prod.thumbnail}','${prod.category}')" title="copiar a formulario...">${prod.title}</a></td>
                    <td>$${prod.price}</td>
                    <td><img width="50" src=${prod.thumbnail} alt="not found"></td>
                    <td>$${prod.category}</td>
                    <td><a type="button" onclick="deleteProduct('${prod.id}')">borrar</a></td>
                    <td><a type="button" onclick="updateProduct('${prod.id}')">actualizar</a></td>
                    </tr>`
        }
        html += `
            </table>
        </div >`
    }
    return Promise.resolve(html);
}