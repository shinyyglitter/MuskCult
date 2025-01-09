

import * as api from "./api_service.js";
import { AdminLoginView } from "./admin_views/admin_login_view.js";
import { CategoryListView } from "./admin_views/admin_category_list_view.js";
import { ProductListView } from "./admin_views/admin_product_list_view.js";
import { AddProductFormView } from "./admin_views/add_product_form_view.js";
import { ProductDetailView } from "./admin_views/admin_detail_view.js";
import { EditProductFormView } from "./admin_views/edit_product_form_view.js";
import { OrderView } from "./admin_views/admin_order_view.js";

const viewContainer = document.getElementById('viewContainer');

//--------Views---------
const adminLoginView = new AdminLoginView();
const addProductFormView = new AddProductFormView();
const editProductFormView = new EditProductFormView();
const categoryListView = new CategoryListView();
const productListView = new ProductListView();
const productDetailView = new ProductDetailView();
const orderView = new OrderView();


//---------Buttons--------
const deleteProductBtn = document.getElementById('deleteProductBtn');
const editProductBtn = document.getElementById('editProductBtn');

const backToCategoriesBtn = document.getElementById('backtoCategoriesBtn');
const backToProductListBtn = document.getElementById('backToProductListBtn');
const backToAdminPage = document.getElementById('adminPageBtn');


//--------Navigations---------
const viewMap = {
    "login_view": adminLoginView,
    "cat_view": categoryListView,
    "pro_view": productListView,
    "detail_view": productDetailView,
    "order_view": orderView,
}


//startup----------------------------------------
const categoryPromise = api.getCategories();
adminLoginView.refresh(categoryPromise); 
viewContainer.appendChild(adminLoginView);

function navigateTo(route, data) {
    viewContainer.innerHTML = "";
    const view = viewMap[route];
    viewContainer.appendChild(view);
    view.refresh(data);
}

//---------Navigating and loading main views---------
function loadCategories(data) {
    navigateTo("cat_view", data);
}

function loadProductsInCategory(data) {
    navigateTo("pro_view", data);
}

function loadProductDetail(data) {
    navigateTo("detail_view", data)
}
function loadOrder(data){
    navigateTo("order_view", data)
}

function backToCategories(evt){
    const data = api.getCategories()
    loadCategories(data)
}
function backToOrder(evt){
    const data = api.getOrders()
    loadOrder(data)
}

categoryListView.addEventListener("categoryselect", function (evt) {
    const data = api.getProductsByCategory(evt.detail.categoryID);
    loadProductsInCategory(data);
});

productListView.addEventListener("productselect", async function (evt) {

    const data = await api.getProductDetails(evt.detail.newID);
    loadProductDetail(data)
})

//-----------Login code----------
adminLoginView.addEventListener("productviewclistclick", evt => {

    backToCategories()
})



adminLoginView.addEventListener("categoryselect", function (evt) {
    const data = api.getProductsByCategory(evt.detail.categoryID)
    loadProductsInCategory(data);
});
adminLoginView.addEventListener("orderview", async evt => {
    const orders = await api.getOrders();
    loadOrder(orders);
});

//-------Admin login view buttons------------

const btnProducts = document.getElementById("btnProducts");
const btnOrders = document.getElementById("btnOrders");

btnProducts.addEventListener('click', async function (evt) {
    backToCategories()
});

btnOrders.addEventListener('click', async function(evt){

    
    viewContainer.innerHTML='';
    viewContainer.appendChild(orderView);

});


//----- Adding new products--------
productListView.addEventListener("gotoaddproduct", function(evt) {
    viewContainer.innerHTML = "";
    viewContainer.appendChild(addProductFormView);
})

addProductFormView.addEventListener("addproduct", async function(evt){
    
    const result = await api.addProduct(evt.detail);

    backToCategories()
    
})

//--------Deleting products---------
productDetailView.addEventListener("deleteproduct", async function(evt){
    
    const result = await api.deleteProduct(evt.detail);

    backToCategories()
})

//----- Editing products---------
productDetailView.addEventListener("sendtoeditform", function(evt){
    viewContainer.innerHTML = "";
    viewContainer.appendChild(editProductFormView);
})

editProductFormView.addEventListener("editproduct", async function(evt){
    const result = await api.editProduct(evt.detail);

    backToCategories()
})
//--------Deleting orders---------
orderView.addEventListener("deleteorderevent", async function(evt){
    
    const result = await api.deleteOrder(evt.detail);
    backToOrder();
})




