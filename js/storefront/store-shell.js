(function(){
"use strict";
var menu=document.querySelector("[data-store-mobile-nav]"),toggle=document.querySelector("[data-store-menu-toggle]");
if(toggle&&menu)toggle.addEventListener("click",function(){var open=menu.hidden;menu.hidden=!open;toggle.setAttribute("aria-expanded",String(open))});
function read(key){try{var value=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(value)?value:[]}catch(e){return []}}
var cart=read("bagusin-store-cart"),wishlist=read("bagusin-store-wishlist");
var cartCount=cart.reduce(function(total,item){return total+(Number(item.qty)||0)},0);
document.querySelectorAll("[data-cart-count]").forEach(function(node){node.textContent=cartCount});
document.querySelectorAll("[data-wishlist-count]").forEach(function(node){node.textContent=wishlist.length});
document.querySelectorAll("[data-focus-store-search]").forEach(function(button){button.addEventListener("click",function(){var input=document.querySelector("#store-search");if(input){input.focus();input.scrollIntoView({behavior:"smooth",block:"center"})}else location.href="/bagusin/store/#store-search"})});
if(document.querySelector("[data-product-page]"))document.addEventListener("click",function(event){var button=event.target.closest("[data-open-cart],[data-open-wishlist]");if(!button)return;event.preventDefault();location.href=button.hasAttribute("data-open-cart")?"/bagusin/store/?open=cart":"/bagusin/store/?open=wishlist"});
document.addEventListener("click",function(event){
var overlay=event.target.closest("[data-store-overlay]");
if(overlay){document.querySelector("[data-wishlist-drawer]")?.classList.remove("is-open")}
var link=event.target.closest("[data-store-footer-category]");
if(link){event.preventDefault();var name=link.getAttribute("data-store-footer-category"),buttons=Array.from(document.querySelectorAll("[data-category]")),target=buttons.find(function(button){return button.getAttribute("data-category")===name});if(target){target.click();document.querySelector("#store-grid")?.scrollIntoView({behavior:"smooth",block:"start"})}else{var all=buttons.find(function(button){return button.getAttribute("data-category")==="all"});if(all)all.click();document.querySelector("#store-search")?.focus()}}
var type=link&&link.getAttribute("data-store-type");
if(type){event.preventDefault();var search=document.querySelector("#store-search");if(search)search.value="";var allButton=document.querySelector('[data-category="all"]');if(allButton)allButton.click();document.querySelector("#store-grid")?.scrollIntoView({behavior:"smooth",block:"start"})}
});
})();