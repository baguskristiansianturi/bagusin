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
async function loadSettings(){var r=await client.from("payment_methods").select("*").eq("method_code","bca_manual").maybeSingle();if(r.error)throw r.error;var f=document.querySelector("[data-payment-settings]");if(r.data){f.elements.account_number.value=r.data.account_number||"";f.elements.is_active.checked=!!r.data.is_active;}var e=await client.from("site_settings").select("setting_value").eq("setting_key","payment_expiry_hours").maybeSingle();if(!e.error&&e.data)f.elements.expiry_hours.value=Number(e.data.setting_value)||24;var rem=await client.from("site_settings").select("setting_value").eq("setting_key","payment_reminder_hours").maybeSingle();if(!rem.error&&rem.data&&Array.isArray(rem.data.setting_value))f.elements.reminder_hours.value=rem.data.setting_value.join(",");}
document.querySelector("[data-payment-settings]").addEventListener("submit",async function(e){e.preventDefault();var f=e.currentTarget;var number=f.elements.account_number.value.trim();var active=f.elements.is_active.checked;if(active&&number.length<5){say("[data-settings-message]","Nomor rekening belum lengkap. Instruksi belum diaktifkan.");return;}var r=await client.from("payment_methods").update({account_number:number,is_active:active,updated_at:new Date().toISOString()}).eq("method_code","bca_manual");if(r.error){say("[data-settings-message]",r.error.message);return;}var hours=Math.max(1,Math.min(168,Number(f.elements.expiry_hours.value)||24));var setting=await client.from("site_settings").upsert({setting_key:"payment_expiry_hours",setting_value:hours,description:"Default payment due period after an invoice is issued; adjustable by admin",updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});if(setting.error){say("[data-settings-message]",setting.error.message);return;}var offsets=Array.from(new Set(f.elements.reminder_hours.value.split(",").map(function(x){return Number(x.trim());}).filter(function(x){return Number.isInteger(x)&&x>=1&&x<=167;}))).sort(function(a,b){return a-b;});if(!offsets.length){say("[data-settings-message]","Masukkan jam pengingat yang valid, misalnya 2,12,22.");return;}var reminder=await client.from("site_settings").upsert({setting_key:"payment_reminder_hours",setting_value:offsets,description:"Reminder offsets after invoice issue; delivery requires a connected provider",updated_by:user.id,updated_at:new Date().toISOString()},{onConflict:"setting_key"});say("[data-settings-message]",reminder.error?reminder.error.message:"Instruksi pembayaran, batas waktu, dan jadwal pengingat berhasil disimpan.");});
document.querySelector("[data-create-order]").addEventListener("submit",async function(e){e.preventDefault();var f=e.currentTarget,d=new FormData(f),customer=d.get("customer_id"),qty=Number(d.get("quantity")),price=Number(d.get("item_price")),shipping=Number(d.get("shipping_amount")||0);var total=qty*price+shipping;if(!customer){say("[data-create-message]","Pilih akun pelanggan terlebih dahulu.");return;}var profile=(profiles.data||[]).find(function(p){return p.id===customer;});var btn=f.querySelector("button[type=submit]");btn.disabled=true;
try{var order=await client.from("orders").insert({customer_id:customer,customer_name:String(d.get("customer_name")).trim(),customer_email:String(d.get("customer_email")).trim(),customer_phone:String(d.get("customer_phone")||"").trim()||null,order_type:d.get("order_type"),order_status:"pending_review",payment_status:"unpaid",fulfillment_status:"not_started",subtotal_amount:qty*price,shipping_amount:shipping,total_amount:total,shipping_method:d.get("shipping_method")||null,customer_note:String(d.get("customer_note")||"").trim()||null}).select("id,order_number").single();if(order.error)throw order.error;var itemType=d.get("order_type")==="physical"?"store_product":d.get("order_type")==="digital"?"digital":d.get("order_type")==="mixed"?"other":d.get("order_type");var item=await client.from("order_items").insert({order_id:order.data.id,item_type:itemType,item_slug:String(d.get("item_slug")||"").trim()||null,item_name:String(d.get("item_name")).trim(),quantity:qty,unit_price:price,line_total:qty*price});if(item.error){await client.from("orders").delete().eq("id",order.data.id);throw item.error;}say("[data-create-message]","Pesanan "+order.data.order_number+" berhasil dibuat. Status awal: menunggu peninjauan.");f.reset();await loadOrders();}catch(err){say("[data-create-message]",err.message||"Pesanan belum dapat dibuat.");}finally{btn.disabled=false;}});
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
   courseCatalog.forEach(function(c){var o=node("option","",c.title);o.value=c.id;course.appendChild(o);});
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
if(pay&&pay.proof_path){var proof=await client.storage.from("bagusin-payment-proofs").createSignedUrl(pay.proof_path,600);if(!proof.error){var a=node("a","","Lihat bukti transfer");a.href=proof.data.signedUrl;a.target="_blank";a.rel="noopener noreferrer";acts.appendChild(a);}}
if(pay&&pay.payment_status==="proof_submitted"){var verify=node("button","is-primary","Konfirmasi dana masuk");verify.addEventListener("click",async function(){if(!confirm("Pastikan dana benar-benar sudah masuk ke rekening BCA. Konfirmasi pembayaran?"))return;var p=await client.from("payments").update({payment_status:"verified",verified_at:new Date().toISOString(),verified_by:user.id}).eq("id",pay.id);if(p.error){alert(p.error.message);return;}var paidAt=new Date().toISOString();var o=await client.from("orders").update({payment_status:"paid",paid_at:paidAt,order_status:"processing"}).eq("id",order.id);if(o.error){alert(o.error.message);return;}await client.from("invoices").update({invoice_status:"paid"}).eq("order_id",order.id);await loadOrders();});acts.appendChild(verify);var reject=node("button","","Tolak bukti");reject.addEventListener("click",async function(){var reason=prompt("Alasan penolakan bukti transfer:","Bukti belum sesuai. Mohon kirim ulang bukti transfer yang jelas.");if(reason===null)return;var p=await client.from("payments").update({payment_status:"rejected",admin_note:reason}).eq("id",pay.id);if(p.error){alert(p.error.message);return;}var o=await client.from("orders").update({payment_status:"rejected"}).eq("id",order.id);if(o.error){alert(o.error.message);return;}await loadOrders();});acts.appendChild(reject);}
if(order.order_status==="awaiting_payment"){var expire=node("button","","Tandai kedaluwarsa");expire.addEventListener("click",async function(){var r=await client.from("orders").update({order_status:"expired"}).eq("id",order.id);if(r.error)alert(r.error.message);else{await client.from("invoices").update({invoice_status:"expired"}).eq("order_id",order.id);await loadOrders();}});acts.appendChild(expire);}
if(order.order_type==="physical"&&order.payment_status==="paid"){var shipForm=node("form","admin-proof"),carrier=node("input"),tracking=node("input"),url=node("input"),submit=node("button","is-primary","Simpan resi");carrier.placeholder="Nama kurir";carrier.required=true;tracking.placeholder="Nomor resi";url.placeholder="URL pelacakan (opsional)";submit.type="submit";shipForm.append(carrier,tracking,url,submit);shipForm.addEventListener("submit",async function(e){e.preventDefault();var s=await client.from("shipments").insert({order_id:order.id,shipping_method:order.shipping_method||"courier_manual",carrier_name:carrier.value,tracking_number:tracking.value,tracking_url:url.value||null,shipment_status:"in_transit",shipped_at:new Date().toISOString()});if(s.error){alert(s.error.message);return;}var u=await client.from("orders").update({fulfillment_status:"shipped"}).eq("id",order.id);if(u.error)alert(u.error.message);await loadOrders();});card.appendChild(shipForm);}
var canComplete=order.order_type==="course"?line.length>0&&line.every(function(i){return enrollments.some(function(e){return e.order_item_id===i.id&&e.enrollment_status==="completed";});}):order.order_type==="digital"?line.length>0&&line.every(function(i){return entitlements.some(function(e){return e.order_item_id===i.id&&e.entitlement_status==="active";});}):order.order_type!=="physical";\nif(order.payment_status==="paid" && order.order_status==="processing" && canComplete){
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
await loadSettings();await loadOrders();await loadReviews();
}
function connect(client){start(client).catch(function(e){message.textContent=e.message||"Gagal memuat dashboard.";});}
window.addEventListener("bagusin:supabase-ready",function(e){if(e.detail&&e.detail.client)connect(e.detail.client);});
if(window.BagusinSupabase)connect(window.BagusinSupabase);
})();