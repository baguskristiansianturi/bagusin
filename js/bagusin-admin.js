(function(){
"use strict";
var root=document.querySelector("[data-admin-content]");if(!root)return;
var locked=document.querySelector("[data-admin-locked]"),message=document.querySelector("[data-admin-message]");
function node(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n;}
function money(v){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(v||0));}
function say(selector,text){var n=document.querySelector(selector);if(n)n.textContent=text||"";}
function isAdmin(client,user){return client.from("profiles").select("role").eq("id",user.id).maybeSingle().then(function(r){if(r.error)throw r.error;return r.data&&r.data.role==="admin";});}
async function start(client){
if(root.dataset.started==="1")return;root.dataset.started="1";
var session=await client.auth.getSession(),user=session.data.session&&session.data.session.user;
if(!user){message.textContent="Silakan masuk dengan akun admin Bagusin.";return;}
if(!await isAdmin(client,user)){message.textContent="Akun ini belum memiliki akses admin. Hubungi pemilik Bagusin.";return;}
locked.hidden=true;root.hidden=false;
var courseCatalogResult=await client.from("courses").select("id,title,meeting_count").order("title");var courseCatalog=courseCatalogResult.data||[];
var customerSelect=document.querySelector('[data-create-order] select[name="customer_id"]');
var profiles=await client.from("profiles").select("id,display_name,username").order("display_name");
if(!profiles.error)(profiles.data||[]).forEach(function(p){var o=node("option","",(p.display_name||p.username||"Pelanggan")+" · "+p.id.slice(0,8));o.value=p.id;customerSelect.appendChild(o);});
customerSelect.addEventListener("change",function(){var p=(profiles.data||[]).find(function(x){return x.id===customerSelect.value;});if(p){var f=document.querySelector("[data-create-order]");if(!f.elements.customer_name.value)f.elements.customer_name.value=p.display_name||p.username||"";}});
async function loadSettings(){var r=await client.from("payment_methods").select("*").eq("method_code","bca_manual").maybeSingle();if(r.error)throw r.error;var f=document.querySelector("[data-payment-settings]");if(r.data){f.elements.account_number.value=r.data.account_number||"";f.elements.is_active.checked=!!r.data.is_active;}var e=await client.from("site_settings").select("setting_value").eq("setting_key","payment_expiry_hours").maybeSingle();if(!e.error&&e.data)f.elements.expiry_hours.value=Number(e.data.setting_value)||24;var rem=await client.from("site_settings").select("setting_value").eq("setting_key","payment_reminder_hours").maybeSingle();if(!rem.error&&rem.data&&Array.isArray(rem.data.setting_value))f.elements.reminder_hours.value=rem.data.setting_value.join(",");var reviewDelay=await client.from("site_settings").select("setting_value").eq("setting_key","review_request_delay_hours").maybeSingle();if(!reviewDelay.error&&reviewDelay.data)f.elements.review_delay_hours.value=Number(reviewDelay.data.setting_value)||24;}
document.querySelector("[data-payment-settings]").addEventListener("submit",async function(e){e.preventDefault();var f=e.currentTarget;var number=f.elements.account_number.value.trim();var active=f.elements.is_active.checked;if(active&&number.length<5){say("[data-settings-message]","Nomor rekening belum lengkap. Instruksi belum diaktifkan.");return;}var r=await client.from("payment_methods").update({account_number:number,is_active:active,updated_at:new Date().toISOString()}).eq("method_code","bca_manual");if(r.error){say("[data-settings-message]",r.error.message);return;}var hours=Math.max(1,Math.min(168,Number(f.elements.expiry_hours.value)||24));var setting=await client.from("site_settings").upsert({setting_key:"payment_expiry_hours",setting_value:hours,description:"Default payment due period after an invoice is issued; adjustable by admin",updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});if(setting.error){say("[data-settings-message]",setting.error.message);return;}var offsets=Array.from(new Set(f.elements.reminder_hours.value.split(",").map(function(x){return Number(x.trim());}).filter(function(x){return Number.isInteger(x)&&x>=1&&x<=167;}))).sort(function(a,b){return a-b;});if(!offsets.length){say("[data-settings-message]","Masukkan jam pengingat yang valid, misalnya 2,12,22.");return;}var reminder=await client.from("site_settings").upsert({setting_key:"payment_reminder_hours",setting_value:offsets,description:"Reminder offsets after invoice issue; delivery requires a connected provider",updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});if(reminder.error){say("[data-settings-message]",reminder.error.message);return;}var reviewDelayHours=Math.max(1,Math.min(720,Number(f.elements.review_delay_hours.value)||24));var reviewSetting=await client.from("site_settings").upsert({setting_key:"review_request_delay_hours",setting_value:reviewDelayHours,description:"Hours after order completion before a voluntary review invitation is queued",updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});say("[data-settings-message]",reviewSetting.error?reviewSetting.error.message:"Instruksi pembayaran, batas waktu, pengingat, dan undangan ulasan berhasil disimpan.");});
document.querySelector("[data-create-order]").addEventListener("submit",async function(e){e.preventDefault();var f=e.currentTarget,d=new FormData(f),customer=d.get("customer_id"),qty=Number(d.get("quantity")),price=Number(d.get("item_price")),shipping=Number(d.get("shipping_amount")||0);var total=qty*price+shipping;if(!customer){say("[data-create-message]","Pilih akun pelanggan terlebih dahulu.");return;}var profile=(profiles.data||[]).find(function(p){return p.id===customer;});var btn=f.querySelector("button[type=submit]");btn.disabled=true;
try{var order=await client.from("orders").insert({customer_id:customer,customer_name:String(d.get("customer_name")).trim(),customer_email:String(d.get("customer_email")).trim(),customer_phone:String(d.get("customer_phone")||"").trim()||null,order_type:d.get("order_type"),order_status:"pending_review",payment_status:"unpaid",fulfillment_status:"not_started",subtotal_amount:qty*price,shipping_amount:shipping,total_amount:total,shipping_method:d.get("shipping_method")||null,customer_note:String(d.get("customer_note")||"").trim()||null}).select("id,order_number").single();if(order.error)throw order.error;var itemType=d.get("order_type")==="physical"?"store_product":d.get("order_type")==="digital"?"digital":d.get("order_type")==="mixed"?"other":d.get("order_type");var item=await client.from("order_items").insert({order_id:order.data.id,item_type:itemType,item_slug:String(d.get("item_slug")||"").trim()||null,item_name:String(d.get("item_name")).trim(),quantity:qty,unit_price:price,line_total:qty*price});if(item.error){await client.from("orders").delete().eq("id",order.data.id);throw item.error;}say("[data-create-message]","Pesanan "+order.data.order_number+" berhasil dibuat. Status awal: menunggu peninjauan.");f.reset();await loadOrders();}catch(err){say("[data-create-message]",err.message||"Pesanan belum dapat dibuat.");}finally{btn.disabled=false;}});
var inquiryBox=document.querySelector("[data-admin-inquiries]");
async function loadInquiries(){if(!inquiryBox)return;inquiryBox.replaceChildren(node("p","admin-note","Memuat inquiry…"));var r=await client.from("inquiries").select("*").order("created_at",{ascending:false}).limit(100);if(r.error)throw r.error;inquiryBox.replaceChildren();var rows=r.data||[];if(!rows.length){inquiryBox.appendChild(node("p","admin-note","Belum ada inquiry masuk."));return;}rows.forEach(function(item){var card=node("article","admin-inquiry"),head=node("div","admin-store-product__head"),title=node("strong","",(item.subject||"Permintaan umum")+" · "+item.full_name),status=node("span","admin-store-product__status",item.status);head.append(title,status);card.append(head,node("p","admin-note",item.request_type+" · "+new Date(item.created_at).toLocaleString("id-ID")+" · "+(item.source_path||"")));var contact=node("p","admin-note",item.email+(item.phone?" · "+item.phone:"")+(item.company_name?" · "+item.company_name:""));card.appendChild(contact);var body=node("p","admin-inquiry__message",item.message);body.style.whiteSpace="pre-wrap";card.appendChild(body);var actions=node("div","admin-actions"),mail=node("a","admin-button admin-button--light","Balas email");mail.href="mailto:"+encodeURIComponent(item.email)+"?subject="+encodeURIComponent("Re: "+(item.subject||"Permintaan Bagusin"));actions.appendChild(mail);var phone=String(item.phone||"").replace(/[^0-9]/g,"");if(phone){var wa=node("a","admin-button admin-button--light","WhatsApp");wa.href="https://wa.me/"+(phone.startsWith("0")?"62"+phone.slice(1):phone)+"?text="+encodeURIComponent("Halo "+item.full_name+", terima kasih telah menghubungi Bagusin. Kami menindaklanjuti permintaan Anda.");wa.target="_blank";wa.rel="noopener noreferrer";actions.appendChild(wa);}var select=node("select","admin-inquiry-status");["new","in_review","replied","qualified","closed","spam"].forEach(function(v){var opt=node("option","",v.replace("_"," "));opt.value=v;select.appendChild(opt);});select.value=item.status;select.setAttribute("aria-label","Status inquiry");select.addEventListener("change",async function(){select.disabled=true;var u=await client.from("inquiries").update({status:select.value,updated_at:new Date().toISOString()}).eq("id",item.id);if(u.error){alert(u.error.message);select.value=item.status;}else{item.status=select.value;status.textContent=item.status;}select.disabled=false;});actions.appendChild(select);card.appendChild(actions);inquiryBox.appendChild(card);});}
var refreshInquiries=document.querySelector("[data-refresh-inquiries]");if(refreshInquiries)refreshInquiries.addEventListener("click",function(){loadInquiries().catch(function(e){say("[data-admin-message]",e.message);});});
var storeForm=document.querySelector("[data-store-product-form]"),storeBox=document.querySelector("[data-admin-store-products]"),galleryEditor=document.querySelector("[data-store-gallery-editor]"),storeProducts=[];
function publicImage(path){return client.storage.from("bagusin-public").getPublicUrl(path).data.publicUrl;}
async function renderProductGallery(productId){
 if(!galleryEditor)return;
 galleryEditor.replaceChildren(node("p","admin-note","Memuat galeri foto…"));
 if(!productId){galleryEditor.replaceChildren(node("p","admin-note","Foto tambahan akan tersimpan bersama produk."));return;}
 var r=await client.from("store_product_images").select("id,image_path,alt_text,sort_order,is_primary").eq("product_id",productId).order("sort_order",{ascending:true});
 if(r.error)throw r.error;
 galleryEditor.replaceChildren();
 if(!r.data.length){galleryEditor.appendChild(node("p","admin-note","Belum ada foto tambahan. Foto utama lama tetap digunakan jika tersedia."));return;}
 var grid=node("div","admin-store-gallery");
 r.data.forEach(function(img){
  var item=node("label","admin-store-gallery__item"),preview=node("img");
  preview.src=publicImage(img.image_path);preview.alt=img.alt_text||"Foto produk";
  var meta=node("span","",img.is_primary?"Foto utama":"Foto "+(Number(img.sort_order)+1));
  var remove=node("input");remove.type="checkbox";remove.name="remove_gallery_image";remove.value=img.id;remove.setAttribute("aria-label","Hapus foto ini");
  item.append(preview,meta,remove);grid.appendChild(item);
 });
 galleryEditor.appendChild(grid);
 galleryEditor.appendChild(node("small","admin-note","Centang foto yang ingin dihapus, lalu simpan produk."));
}
async function loadStoreProducts(){
 if(!storeBox)return;
 storeBox.replaceChildren(node("p","admin-note","Memuat produk Store…"));
 var r=await client.from("store_products").select("*").order("updated_at",{ascending:false});
 if(r.error)throw r.error;
 storeProducts=r.data||[];
 var ids=storeProducts.map(function(p){return p.id;});
 if(ids.length){
  var images=await client.from("store_product_images").select("product_id,id,image_path,sort_order,is_primary").in("product_id",ids);
  if(images.error)throw images.error;
  storeProducts.forEach(function(p){p.gallery=(images.data||[]).filter(function(x){return x.product_id===p.id;});});
 }
 storeBox.replaceChildren();
 var cats=Array.from(new Set(storeProducts.map(function(p){return p.category;}).filter(Boolean))).sort();
 var datalist=document.querySelector("#store-category-options");
 if(datalist){datalist.replaceChildren();cats.forEach(function(c){var o=node("option");o.value=c;datalist.appendChild(o);});}
 if(!storeProducts.length){storeBox.appendChild(node("p","admin-note","Belum ada produk. Tambahkan produk pertama melalui formulir di atas."));return;}
 storeProducts.forEach(function(p){
  var card=node("article","admin-store-product"),head=node("div","admin-store-product__head"),title=node("strong","",p.name),status=node("span","admin-store-product__status",p.status==="published"?"Published":p.status==="archived"?"Archived":"Draft");
  head.append(title,status);
  card.append(head,node("p","admin-note",(p.category||"Tanpa kategori")+" · "+(p.sku||"Tanpa SKU")+" · "+money(p.price_amount)),node("p","admin-note","Slug: "+p.slug+" · "+(p.manage_stock?"Stok: "+p.stock_quantity:"Stok tidak dikelola")+" · "+(p.gallery||[]).length+" foto"));
  var edit=node("button","admin-button admin-button--light","Edit produk");edit.type="button";
  edit.addEventListener("click",async function(){
   ["id","name","slug","sku","category","product_type","price_amount","stock_quantity","availability","status","brand","short_description","description","image_path","seo_title","seo_description"].forEach(function(k){if(storeForm.elements[k])storeForm.elements[k].value=p[k]??"";});
   storeForm.elements.manage_stock.checked=!!p.manage_stock;
   storeForm.elements.image_files.value="";
   await renderProductGallery(p.id);
   storeForm.scrollIntoView({behavior:"smooth",block:"start"});
   say("[data-store-product-message]","Mengedit "+p.name+". Kelola foto yang ada atau tambahkan foto baru, lalu simpan.");
  });
  card.appendChild(edit);storeBox.appendChild(card);
 });
}
if(storeForm){
 storeForm.addEventListener("submit",async function(e){
  e.preventDefault();
  var f=e.currentTarget,d=new FormData(f),id=String(d.get("id")||""),slug=String(d.get("slug")||"").trim().toLowerCase(),name=String(d.get("name")||"").trim(),files=Array.from(f.elements.image_files.files||[]),imagePath=String(d.get("image_path")||"").trim(),btn=f.querySelector('button[type="submit"]');
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){say("[data-store-product-message]","Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");return;}
  for(var file of files){if(file.size>8*1024*1024){say("[data-store-product-message]","Ukuran setiap foto maksimal 8 MB.");return;}if(!["image/jpeg","image/png","image/webp","image/avif"].includes(file.type)){say("[data-store-product-message]","Format foto harus JPG, PNG, WebP, atau AVIF.");return;}}
  btn.disabled=true;btn.textContent="Menyimpan…";
  try{
   var existing=[];
   if(id){var current=await client.from("store_product_images").select("id,image_path,sort_order,is_primary").eq("product_id",id).order("sort_order",{ascending:true});if(current.error)throw current.error;existing=current.data||[];}
   var removeIds=Array.from(galleryEditor.querySelectorAll('input[name="remove_gallery_image"]:checked')).map(function(x){return x.value;});
   var remaining=existing.filter(function(x){return !removeIds.includes(x.id);});
   if(remaining.length+files.length>15)throw Error("Maksimal 15 foto per produk. Hapus beberapa foto sebelum menambahkan yang baru.");
   if(removeIds.length){
    var removed=existing.filter(function(x){return removeIds.includes(x.id);});
    var removedPrimary=removed.find(function(x){return x.is_primary;});
    var del=await client.from("store_product_images").delete().in("id",removeIds);if(del.error)throw del.error;
    var storageDel=await client.storage.from("bagusin-public").remove(removed.map(function(x){return x.image_path;}));if(storageDel.error)throw storageDel.error;
    if(removedPrimary&&imagePath===removedPrimary.image_path)imagePath=remaining.length?remaining[0].image_path:null;
    for(var ri=0;ri<remaining.length;ri++){
     var normalize=await client.from("store_product_images").update({sort_order:ri,is_primary:removedPrimary?ri===0:!!remaining[ri].is_primary}).eq("id",remaining[ri].id);
     if(normalize.error)throw normalize.error;
    }
   }
   var payload={slug:slug,name:name,sku:String(d.get("sku")||"").trim()||null,category:String(d.get("category")||"").trim()||null,product_type:String(d.get("product_type")||"physical"),price_amount:Number(d.get("price_amount")||0),currency:"IDR",stock_quantity:Math.max(0,Number(d.get("stock_quantity")||0)),availability:String(d.get("availability")||"in_stock"),manage_stock:f.elements.manage_stock.checked,brand:String(d.get("brand")||"").trim()||null,short_description:String(d.get("short_description")||"").trim()||null,description:String(d.get("description")||"").trim(),image_path:imagePath||null,status:String(d.get("status")||"draft"),seo_title:String(d.get("seo_title")||"").trim()||null,seo_description:String(d.get("seo_description")||"").trim()||null,updated_at:new Date().toISOString()};
   var result=id?await client.from("store_products").update(payload).eq("id",id).select("id").single():await client.from("store_products").insert(payload).select("id").single();
   if(result.error)throw result.error;
   var productId=result.data.id,uploaded=[];
   for(var i=0;i<files.length;i++){
    var imageFile=files[i],ext=imageFile.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"")||"webp",path="products/"+slug+"-"+Date.now()+"-"+i+"."+ext;
    var upload=await client.storage.from("bagusin-public").upload(path,imageFile,{upsert:false,contentType:imageFile.type});if(upload.error)throw upload.error;
    uploaded.push({product_id:productId,image_path:path,alt_text:name+" — foto "+(remaining.length+i+1),sort_order:remaining.length+i,is_primary:remaining.length===0&&i===0});
    if(!imagePath&&remaining.length===0&&i===0)imagePath=path;
   }
   if(uploaded.length){var inserted=await client.from("store_product_images").insert(uploaded);if(inserted.error)throw inserted.error;}
   if(imagePath!==payload.image_path){var sync=await client.from("store_products").update({image_path:imagePath}).eq("id",productId);if(sync.error)throw sync.error;}
   say("[data-store-product-message]",'Produk "'+name+'" berhasil disimpan dengan '+(remaining.length+uploaded.length)+' foto. Status: '+payload.status+'.');
   f.reset();f.elements.id.value="";f.elements.manage_stock.checked=true;await renderProductGallery("");await loadStoreProducts();
  }catch(err){say("[data-store-product-message]",err.message||"Produk belum dapat disimpan.");}
  finally{btn.disabled=false;btn.textContent="Simpan produk";}
 });
 var reset=storeForm.querySelector("[data-reset-store-product]");
 if(reset)reset.addEventListener("click",function(){storeForm.reset();storeForm.elements.id.value="";storeForm.elements.manage_stock.checked=true;renderProductGallery("");say("[data-store-product-message]","Form siap untuk produk baru.");});
}
var refreshStore=document.querySelector("[data-refresh-store-products]");
if(refreshStore)refreshStore.addEventListener("click",function(){loadStoreProducts().catch(function(e){say("[data-store-product-message]",e.message);});});
async function loadOrders(){
var box=document.querySelector("[data-admin-orders]");box.replaceChildren(node("p","admin-note","Memuat pesanan…"));
var r=await client.from("orders").select("*").order("created_at",{ascending:false});if(r.error)throw r.error;
var orders=r.data||[];var ids=orders.map(function(o){return o.id;});var payments=[],items=[],shipments=[],enrollments=[],entitlements=[],invoices=[];
if(ids.length){
 var itemResult=await client.from("order_items").select("*").in("order_id",ids);if(itemResult.error)throw itemResult.error;items=itemResult.data||[];
 var itemIds=items.map(function(i){return i.id;});
 var q=await Promise.all([
  client.from("payments").select("*").in("order_id",ids),
  client.from("shipments").select("*").in("order_id",ids),
  client.from("invoices").select("id,order_id,invoice_number,invoice_status,due_at").in("order_id",ids),
  itemIds.length?client.from("course_enrollments").select("id,order_item_id,meetings_total,instructor_name,start_date,schedule_notes,enrollment_status").in("order_item_id",itemIds):Promise.resolve({data:[],error:null}),
  itemIds.length?client.from("digital_entitlements").select("id,order_item_id,entitlement_status").in("order_item_id",itemIds):Promise.resolve({data:[],error:null})
 ]);
 q.forEach(function(x){if(x.error)throw x.error;});
 payments=q[0].data||[];shipments=q[1].data||[];invoices=q[2].data||[];enrollments=q[3].data||[];entitlements=q[4].data||[];if(enrollments.length){var sessionResult=await client.from("course_sessions").select("*").in("enrollment_id",enrollments.map(function(e){return e.id;}));if(sessionResult.error)throw sessionResult.error;var courseSessions=sessionResult.data||[];}else{var courseSessions=[];}
}
var proofUrls={};
var proofRows=payments.filter(function(p){return !!p.proof_path;});
await Promise.all(proofRows.map(async function(p){var proof=await client.storage.from("bagusin-payment-proofs").createSignedUrl(p.proof_path,600);if(!proof.error&&proof.data)proofUrls[p.id]=proof.data.signedUrl;}));
box.replaceChildren();if(!orders.length){box.appendChild(node("p","admin-note","Belum ada pesanan yang tercatat."));return;}
orders.forEach(function(order){
var card=node("article","admin-order"),top=node("div","admin-order__top"),left=node("div");left.append(node("strong","",order.order_number+" · "+order.customer_name),node("span","",order.customer_email+" · "+new Date(order.created_at).toLocaleString("id-ID")));top.append(left,node("span","admin-tag",order.order_status+" / "+order.payment_status));card.appendChild(top);
var meta=node("div","admin-order__meta");[[ "Total",money(order.total_amount)],["Jenis",order.order_type],["Pengiriman",order.shipping_method||"—"]].forEach(function(pair){var d=node("div");d.append(node("small","",pair[0]),node("b","",pair[1]));meta.appendChild(d);});card.appendChild(meta);
var line=items.filter(function(i){return i.order_id===order.id;});line.forEach(function(i){card.appendChild(node("p","admin-note",i.item_name+" × "+i.quantity));});
if(order.payment_status==="paid" && order.order_type==="course"){
 line.forEach(function(item){
  var enrollment=enrollments.find(function(e){return e.order_item_id===item.id;});
  if(!enrollment){
   var form=node("form","admin-proof"),course=node("select"),instructor=node("input"),startDate=node("input"),meetings=node("input"),notes=node("input"),submit=node("button","is-primary","Buat pendaftaran kursus");
   course.required=true;course.appendChild(node("option","","Pilih course"));
   courseCatalog.forEach(function(c){var o=node("option","",c.title);o.value=c.id;course.appendChild(o);});course.addEventListener("change",function(){var selected=courseCatalog.find(function(c){return c.id===course.value;});if(selected&&selected.meeting_count)meetings.value=selected.meeting_count;});
   instructor.placeholder="Nama pengajar";instructor.value="Bagus";startDate.type="date";meetings.type="number";meetings.min="1";meetings.value="19";notes.placeholder="Catatan jadwal / lokasi";submit.type="submit";
   form.append(course,instructor,startDate,meetings,notes,submit);
   form.addEventListener("submit",async function(e){e.preventDefault();var selected=courseCatalog.find(function(c){return c.id===course.value;});var ins=await client.from("course_enrollments").insert({order_item_id:item.id,customer_id:order.customer_id,course_id:course.value,instructor_name:instructor.value||null,start_date:startDate.value||null,meetings_total:Number(meetings.value)||selected&&selected.meeting_count||null,schedule_notes:notes.value||null,enrollment_status:"pending"});if(ins.error)alert(ins.error.message);else await loadOrders();});
   card.appendChild(form);return;
  }
  var scheduleBox=node("div","admin-proof admin-course-schedule"),scheduleTitle=node("strong","", "Jadwal kursus · "+(enrollment.instructor_name||"Pengajar belum diatur"));
  scheduleBox.appendChild(scheduleTitle);
  var related=courseSessions.filter(function(s){return s.enrollment_id===enrollment.id;});
  related.forEach(function(session){
   var row=node("div","admin-order__meta");
   row.appendChild(node("span","", "Pertemuan "+session.session_number+" · "+(session.scheduled_at?new Date(session.scheduled_at).toLocaleString("id-ID"):"Belum dijadwalkan")+" · "+session.session_status));
   if(session.session_status!=="completed"){var done=node("button","admin-button admin-button--light","Tandai selesai");done.addEventListener("click",async function(){var u=await client.from("course_sessions").update({session_status:"completed",completed_at:new Date().toISOString()}).eq("id",session.id);if(u.error)alert(u.error.message);else await loadOrders();});row.appendChild(done);}
   scheduleBox.appendChild(row);
  });
  var sessionForm=node("form","admin-form admin-form--inline"),sessionNo=node("input"),sessionTitle=node("input"),sessionDate=node("input"),sessionDuration=node("input"),sessionLocation=node("input"),addSession=node("button","is-primary","Tambah pertemuan");
  sessionNo.type="number";sessionNo.min="1";sessionNo.value=String(related.reduce(function(max,s){return Math.max(max,s.session_number);},0)+1);
  sessionTitle.placeholder="Judul pertemuan";sessionDate.type="datetime-local";sessionDate.required=true;sessionDuration.type="number";sessionDuration.min="1";sessionDuration.value="90";sessionLocation.placeholder="Lokasi / catatan";addSession.type="submit";
  sessionForm.append(sessionNo,sessionTitle,sessionDate,sessionDuration,sessionLocation,addSession);
  sessionForm.addEventListener("submit",async function(e){e.preventDefault();var ins=await client.from("course_sessions").insert({enrollment_id:enrollment.id,session_number:Number(sessionNo.value),title:sessionTitle.value||null,scheduled_at:sessionDate.value?new Date(sessionDate.value).toISOString():null,duration_minutes:Number(sessionDuration.value)||null,location_note:sessionLocation.value||null,session_status:"scheduled"});if(ins.error)alert(ins.error.message);else{await client.from("course_enrollments").update({enrollment_status:"scheduled"}).eq("id",enrollment.id);await loadOrders();}});
  if(enrollment.meetings_total && related.length>=enrollment.meetings_total && related.every(function(s){return s.session_status==="completed";}) && enrollment.enrollment_status!=="completed"){var courseDone=node("button","admin-button admin-button--light","Tandai kursus selesai");courseDone.addEventListener("click",async function(){var u=await client.from("course_enrollments").update({enrollment_status:"completed"}).eq("id",enrollment.id);if(u.error)alert(u.error.message);else await loadOrders();});scheduleBox.appendChild(courseDone);}
  scheduleBox.appendChild(sessionForm);card.appendChild(scheduleBox);
 });
}
if(order.payment_status==="paid" && order.order_type==="digital"){
 line.forEach(function(item){
  if(entitlements.some(function(e){return e.order_item_id===item.id;}))return;
  var form=node("form","admin-proof"),path=node("input"),limit=node("input"),submit=node("button","is-primary","Aktifkan unduhan");
  path.placeholder="Path file di bagusin-private";path.required=true;limit.type="number";limit.min="1";limit.placeholder="Batas unduhan (kosong = tanpa batas)";submit.type="submit";form.append(path,limit,submit);
  form.addEventListener("submit",async function(e){e.preventDefault();var ins=await client.from("digital_entitlements").insert({order_item_id:item.id,customer_id:order.customer_id,item_name:item.item_name,storage_bucket:"bagusin-private",storage_path:path.value.trim(),download_limit:limit.value?Number(limit.value):null,entitlement_status:"active"});if(ins.error)alert(ins.error.message);else await loadOrders();});
  card.appendChild(form);
 });
}
var invoice=invoices.find(function(i){return i.order_id===order.id;});if(invoice)card.appendChild(node("p","admin-note","Invoice: "+invoice.invoice_number+" · "+invoice.invoice_status+(invoice.due_at?" · jatuh tempo "+new Date(invoice.due_at).toLocaleString("id-ID"):"")));
var acts=node("div","admin-actions");
if(order.order_status==="pending_review"){var accept=node("button","is-primary","Terima & terbitkan invoice");accept.addEventListener("click",async function(){var setting=await client.from("site_settings").select("setting_value").eq("setting_key","payment_expiry_hours").maybeSingle();var hours=Math.max(1,Math.min(168,Number(setting.data&&setting.data.setting_value)||24));var now=new Date(),due=new Date(now.getTime()+hours*60*60*1000);var r=await client.from("orders").update({order_status:"awaiting_payment",accepted_at:now.toISOString(),expires_at:due.toISOString()}).eq("id",order.id);if(r.error){alert(r.error.message);return;}var inv=await client.from("invoices").upsert({order_id:order.id,invoice_status:"issued",issued_at:now.toISOString(),due_at:due.toISOString(),subtotal_amount:order.subtotal_amount,shipping_amount:order.shipping_amount,discount_amount:order.discount_amount,total_amount:order.total_amount},{onConflict:"order_id"});if(inv.error)alert(inv.error.message);await loadOrders();});acts.appendChild(accept);}
var pay=payments.filter(function(p){return p.order_id===order.id;}).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);})[0];
if(pay&&proofUrls[pay.id]){var a=node("a","","Lihat bukti transfer");a.href=proofUrls[pay.id];a.target="_blank";a.rel="noopener noreferrer";acts.appendChild(a);}
if(pay&&pay.payment_status==="proof_submitted"){var verify=node("button","is-primary","Konfirmasi dana masuk");verify.addEventListener("click",async function(){if(!confirm("Pastikan dana benar-benar sudah masuk ke rekening BCA. Konfirmasi pembayaran?"))return;var p=await client.from("payments").update({payment_status:"verified",verified_at:new Date().toISOString(),verified_by:user.id}).eq("id",pay.id);if(p.error){alert(p.error.message);return;}var paidAt=new Date().toISOString();var o=await client.from("orders").update({payment_status:"paid",paid_at:paidAt,order_status:"processing"}).eq("id",order.id);if(o.error){alert(o.error.message);return;}await client.from("invoices").update({invoice_status:"paid"}).eq("order_id",order.id);await loadOrders();});acts.appendChild(verify);var reject=node("button","","Tolak bukti");reject.addEventListener("click",async function(){var reason=prompt("Alasan penolakan bukti transfer:","Bukti belum sesuai. Mohon kirim ulang bukti transfer yang jelas.");if(reason===null)return;var p=await client.from("payments").update({payment_status:"rejected",admin_note:reason}).eq("id",pay.id);if(p.error){alert(p.error.message);return;}var o=await client.from("orders").update({payment_status:"rejected"}).eq("id",order.id);if(o.error){alert(o.error.message);return;}await loadOrders();});acts.appendChild(reject);}
if(order.order_status==="awaiting_payment"){var expire=node("button","","Tandai kedaluwarsa");expire.addEventListener("click",async function(){var r=await client.from("orders").update({order_status:"expired"}).eq("id",order.id);if(r.error)alert(r.error.message);else{await client.from("invoices").update({invoice_status:"expired"}).eq("order_id",order.id);await loadOrders();}});acts.appendChild(expire);}
if(order.order_type==="physical"&&order.payment_status==="paid"){var shipForm=node("form","admin-proof"),carrier=node("input"),tracking=node("input"),url=node("input"),submit=node("button","is-primary","Simpan resi");carrier.placeholder="Nama kurir";carrier.required=true;tracking.placeholder="Nomor resi";url.placeholder="URL pelacakan (opsional)";submit.type="submit";shipForm.append(carrier,tracking,url,submit);shipForm.addEventListener("submit",async function(e){e.preventDefault();var s=await client.from("shipments").insert({order_id:order.id,shipping_method:order.shipping_method||"courier_manual",carrier_name:carrier.value,tracking_number:tracking.value,tracking_url:url.value||null,shipment_status:"in_transit",shipped_at:new Date().toISOString()});if(s.error){alert(s.error.message);return;}var u=await client.from("orders").update({fulfillment_status:"shipped"}).eq("id",order.id);if(u.error)alert(u.error.message);await loadOrders();});card.appendChild(shipForm);}
var canComplete=order.order_type==="course"?line.length>0&&line.every(function(i){return enrollments.some(function(e){return e.order_item_id===i.id&&e.enrollment_status==="completed";});}):order.order_type==="digital"?line.length>0&&line.every(function(i){return entitlements.some(function(e){return e.order_item_id===i.id&&e.entitlement_status==="active";});}):order.order_type!=="physical";
if(order.payment_status==="paid" && order.order_status==="processing" && canComplete){
 var complete=node("button","is-primary","Tandai pekerjaan selesai");
 complete.addEventListener("click",async function(){var u=await client.from("orders").update({order_status:"completed",fulfillment_status:"completed",completed_at:new Date().toISOString()}).eq("id",order.id);if(u.error)alert(u.error.message);else await loadOrders();});
 acts.appendChild(complete);
}
if(acts.childNodes.length)card.appendChild(acts);
var shipment=shipments.find(function(s){return s.order_id===order.id;});
if(shipment){
 card.appendChild(node("p","admin-note","Pengiriman: "+(shipment.carrier_name||shipment.shipping_method)+" · "+(shipment.tracking_number||shipment.shipment_status)));
 if(shipment.shipment_status!=="delivered"){
  var delivered=node("button","admin-button admin-button--light","Tandai sudah diterima");
  delivered.addEventListener("click",async function(){var now=new Date().toISOString();var s=await client.from("shipments").update({shipment_status:"delivered",delivered_at:now}).eq("id",shipment.id);if(s.error){alert(s.error.message);return;}var o=await client.from("orders").update({fulfillment_status:"delivered",order_status:"completed",completed_at:now}).eq("id",order.id);if(o.error)alert(o.error.message);await loadOrders();});
  card.appendChild(delivered);
 }
}
var wa=String(order.customer_phone||"").replace(/[^0-9]/g,"");if(wa){var link=node("a","admin-note","Buka WhatsApp pelanggan ↗");link.href="https://wa.me/"+(wa.startsWith("0")?"62"+wa.slice(1):wa)+"?text="+encodeURIComponent("Halo "+order.customer_name+", terkait pesanan "+order.order_number+" di Bagusin. Silakan cek member area untuk detail terbaru.");link.target="_blank";link.rel="noopener noreferrer";card.appendChild(link);}
box.appendChild(card);
});
}
async function loadReviews(){var box=document.querySelector("[data-admin-reviews]");var r=await client.from("product_reviews").select("*").eq("moderation_status","pending").order("created_at",{ascending:false});if(r.error)throw r.error;box.replaceChildren();if(!r.data.length){box.appendChild(node("p","admin-note","Tidak ada ulasan yang menunggu moderasi."));return;}r.data.forEach(function(review){var card=node("article","admin-review");card.append(node("strong","",review.item_name+" · "+review.rating+"/5"),node("p","",review.review_title||""),node("p","admin-note",review.review_body));var actions=node("div","admin-actions");["published","rejected"].forEach(function(status){var b=node("button",status==="published"?"is-primary":"",status==="published"?"Tampilkan":"Tolak");b.addEventListener("click",async function(){var u=await client.from("product_reviews").update({moderation_status:status,published_at:status==="published"?new Date().toISOString():null}).eq("id",review.id);if(u.error)alert(u.error.message);else await loadReviews();});actions.appendChild(b);});card.appendChild(actions);box.appendChild(card);});}
document.querySelector("[data-refresh-orders]").addEventListener("click",function(){loadOrders().catch(function(e){say("[data-admin-message]",e.message);});});
await loadSettings();await loadInquiries();await loadStoreProducts();await loadOrders();await loadReviews();
}
function connect(client){start(client).catch(function(e){message.textContent=e.message||"Gagal memuat dashboard.";});}
window.addEventListener("bagusin:supabase-ready",function(e){if(e.detail&&e.detail.client)connect(e.detail.client);});
if(window.BagusinSupabase)connect(window.BagusinSupabase);
})();