(function () {
  "use strict";
  var root = document.querySelector("[data-member-area]");
  if (!root) return;
  var isEnglish = /^\\/(?:bagusin\\/)?en(?:\\/|$)/.test(window.location.pathname);
  var words = isEnglish ? {
    loading:"Loading your orders…", empty:"No orders yet. Your orders will appear here after a request is accepted by Bagusin.",
    error:"We could not load your account activity. Please refresh and try again.",
    pending_review:"Under review", awaiting_payment:"Awaiting payment", processing:"In progress", ready:"Ready", completed:"Completed", cancelled:"Cancelled", expired:"Expired",
    unpaid:"Unpaid", proof_submitted:"Proof submitted", paid:"Paid", rejected:"Payment needs review", refunded:"Refunded",
    type_service:"Service", type_course:"Course", type_digital:"Digital product", type_physical:"Physical product", type_mixed:"Mixed order",
    upload:"Upload transfer proof", file:"Choose receipt image or PDF", submit:"Send proof", sending:"Sending…",
    missingBank:"Payment instructions are not available yet. Please contact Bagusin before transferring.",
    uploaded:"Proof submitted. Bagusin will check the incoming transfer and update your order.",
    uploadError:"The proof could not be submitted. Please try again or contact Bagusin.",
    reviewTitle:"Share your experience", reviewPlaceholder:"Tell us about your experience (at least 10 characters).",
    reviewSubmit:"Send review", reviewSent:"Thank you. Your review has been sent for moderation.",
    reviewPending:"Waiting for review", reviewPublished:"Published", reviewRejected:"Not published",
    reviewEmpty:"No reviews submitted yet.", payment:"Payment", shipment:"Delivery", tracking:"Tracking number", noTracking:"Tracking information will appear here after dispatch.",
    amount:"Total", created:"Order date", noAccount:"Bank details have not been configured yet."
  } : {
    loading:"Memuat pesanan Anda…", empty:"Belum ada pesanan. Pesanan akan muncul di sini setelah permintaan diterima Bagusin.",
    error:"Aktivitas akun belum dapat dimuat. Silakan muat ulang halaman.",
    pending_review:"Sedang ditinjau", awaiting_payment:"Menunggu pembayaran", processing:"Sedang diproses", ready:"Siap", completed:"Selesai", cancelled:"Dibatalkan", expired:"Kedaluwarsa",
    unpaid:"Belum dibayar", proof_submitted:"Bukti dikirim", paid:"Lunas", rejected:"Pembayaran perlu diperiksa", refunded:"Dikembalikan",
    type_service:"Layanan", type_course:"Kursus", type_digital:"Produk digital", type_physical:"Produk fisik", type_mixed:"Pesanan campuran",
    upload:"Unggah bukti transfer", file:"Pilih gambar atau PDF bukti transfer", submit:"Kirim bukti", sending:"Mengirim…",
    missingBank:"Instruksi pembayaran belum tersedia. Hubungi Bagusin sebelum melakukan transfer.",
    uploaded:"Bukti transfer berhasil dikirim. Bagusin akan memeriksa dana masuk dan memperbarui pesanan Anda.",
    uploadError:"Bukti transfer belum dapat dikirim. Silakan coba lagi atau hubungi Bagusin.",
    reviewTitle:"Bagikan pengalaman Anda", reviewPlaceholder:"Ceritakan pengalaman Anda (minimal 10 karakter).",
    reviewSubmit:"Kirim ulasan", reviewSent:"Terima kasih. Ulasan Anda sudah dikirim untuk diperiksa.",
    reviewPending:"Menunggu pemeriksaan", reviewPublished:"Ditampilkan", reviewRejected:"Tidak ditampilkan",
    reviewEmpty:"Belum ada ulasan yang dikirim.", payment:"Pembayaran", shipment:"Pengiriman", tracking:"Nomor resi", noTracking:"Informasi pelacakan akan muncul setelah pesanan dikirim.",
    amount:"Total", created:"Tanggal pesanan", noAccount:"Rekening pembayaran belum dikonfigurasi."
  };
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }
  function money(value) {
    return new Intl.NumberFormat(isEnglish ? "en-US" : "id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value || 0));
  }
  function date(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat(isEnglish ? "en-GB" : "id-ID", {dateStyle:"medium"}).format(new Date(value));
  }
  function statusLabel(value) { return words[value] || value || "—"; }
  function message(text, state) {
    var node = root.querySelector("[data-member-message]");
    if (!node) return;
    node.textContent = text || "";
    node.dataset.state = state || "info";
    node.hidden = !text;
  }
  function addLine(parent, label, value) {
    var row = el("div","member-detail-row");
    row.append(el("span","",label),el("strong","",value || "—"));
    parent.appendChild(row);
  }
  function makePaymentForm(order, paymentMethods) {
    var activeMethod = paymentMethods.find(function (method) { return method.is_active && method.account_number; });
    var box = el("div","member-action-box");
    box.appendChild(el("h4","",words.payment));
    if (!activeMethod) {
      box.appendChild(el("p","member-muted",words.missingBank));
      return box;
    }
    var account = el("div","member-bank-details");
    account.append(el("strong","",activeMethod.bank_name + " · " + activeMethod.account_holder),
      el("b","",activeMethod.account_number),
      el("span","",activeMethod.instructions || ""));
    box.appendChild(account);
    var form = el("form","member-upload-form");
    var label = el("label","",words.file);
    var input = el("input");
    input.type = "file"; input.accept = "image/jpeg,image/png,image/webp,application/pdf"; input.required = true;
    label.appendChild(input);
    var submit = el("button","member-button",words.submit); submit.type = "submit";
    form.append(label,submit);
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) { message(isEnglish ? "Maximum file size is 8 MB." : "Ukuran file maksimal 8 MB.", "error"); return; }
      submit.disabled = true; submit.textContent = words.sending; message("", "info");
      try {
        var ext = file.type === "application/pdf" ? "pdf" : (file.type === "image/png" ? "png" : (file.type === "image/webp" ? "webp" : "jpg"));
        var path = window.BagusinCurrentUser.id + "/" + order.order_number + "/" + Date.now() + "." + ext;
        var upload = await window.BagusinSupabase.storage.from("bagusin-payment-proofs").upload(path,file,{upsert:false,contentType:file.type});
        if (upload.error) throw upload.error;
        var result = await window.BagusinSupabase.from("payments").insert({
          order_id:order.id, customer_id:window.BagusinCurrentUser.id, method:"bank_transfer",
          bank_name:activeMethod.bank_name, account_holder:activeMethod.account_holder,
          amount:Number(order.total_amount), payment_status:"proof_submitted", proof_path:path,
          submitted_at:new Date().toISOString()
        });
        if (result.error) throw result.error;
        message(words.uploaded,"success"); await loadDashboard(window.BagusinCurrentUser);
      } catch (error) {
        console.error("Bagusin payment proof:",error);
        message(words.uploadError,"error");
      } finally { submit.disabled=false; submit.textContent=words.submit; }
    });
    box.appendChild(form);
    return box;
  }
  function makeReviewForm(item, existing) {
    if (existing) return null;
    var form = el("form","member-review-form");
    form.appendChild(el("h4","",words.reviewTitle));
    var rating = el("select"); rating.required=true; rating.setAttribute("aria-label",isEnglish?"Rating":"Penilaian");
    [5,4,3,2,1].forEach(function (value) { var option=el("option","",value+" ★"); option.value=String(value); rating.appendChild(option); });
    var title = el("input"); title.type="text"; title.maxLength=100; title.placeholder=isEnglish?"Review title (optional)":"Judul ulasan (opsional)";
    var body = el("textarea"); body.required=true; body.minLength=10; body.maxLength=3000; body.rows=3; body.placeholder=words.reviewPlaceholder;
    var submit = el("button","member-button",words.reviewSubmit); submit.type="submit";
    form.append(rating,title,body,submit);
    form.addEventListener("submit",async function(event){
      event.preventDefault(); submit.disabled=true;
      try {
        var result=await window.BagusinSupabase.from("product_reviews").insert({
          order_item_id:item.id, customer_id:window.BagusinCurrentUser.id, item_type:item.item_type,
          item_slug:item.item_slug, item_name:item.item_name, rating:Number(rating.value),
          review_title:title.value.trim()||null, review_body:body.value.trim(),
          display_name:window.BagusinDisplayName||null, moderation_status:"pending", verified_purchase:true
        });
        if(result.error) throw result.error;
        message(words.reviewSent,"success"); await loadDashboard(window.BagusinCurrentUser);
      } catch(error) { console.error("Bagusin review:",error); message(error.message||words.uploadError,"error"); }
      finally { submit.disabled=false; }
    });
    return form;
  }
  function renderOrder(order, items, payments, shipments, reviews, methods) {
    var card=el("article","member-order-card");
    var top=el("div","member-order-card__top");
    var title=el("div");
    title.append(el("strong","",order.order_number),el("span","member-muted",statusLabel("type_"+order.order_type)+" · "+date(order.created_at)));
    var status=el("span","member-status member-status--"+order.order_status,statusLabel(order.order_status));
    top.append(title,status); card.appendChild(top);
    var details=el("div","member-order-card__details");
    addLine(details,words.amount,money(order.total_amount));
    addLine(details,words.payment,statusLabel(order.payment_status));
    if(order.shipping_method) addLine(details,words.shipment,order.shipping_method.replaceAll("_"," "));
    card.appendChild(details);
    var its=items.filter(function(item){return item.order_id===order.id;});
    if(its.length){var list=el("ul","member-order-items");its.forEach(function(item){list.appendChild(el("li","",item.item_name+" × "+item.quantity));});card.appendChild(list);}
    var latestPayment=payments.filter(function(p){return p.order_id===order.id;}).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);})[0];
    if(order.order_status==="awaiting_payment" && order.payment_status!=="paid" && (!latestPayment || latestPayment.payment_status==="rejected" || latestPayment.payment_status==="expired")) card.appendChild(makePaymentForm(order,methods));
    else if(latestPayment && latestPayment.payment_status==="proof_submitted") card.appendChild(el("p","member-muted",isEnglish?"Transfer proof received. Waiting for Bagusin verification.":"Bukti transfer diterima. Menunggu verifikasi Bagusin."));
    var shipment=shipments.find(function(s){return s.order_id===order.id;});
    if(shipment){var ship=el("div","member-action-box");ship.appendChild(el("h4","",words.shipment));ship.appendChild(el("p","",statusLabel(shipment.shipment_status)));if(shipment.tracking_number)addLine(ship,words.tracking,shipment.tracking_number);else ship.appendChild(el("p","member-muted",words.noTracking));card.appendChild(ship);}
    var eligible=order.order_status==="completed" && order.payment_status==="paid";
    if(eligible){its.forEach(function(item){var prior=reviews.find(function(review){return review.order_item_id===item.id;});var form=makeReviewForm(item,prior);if(form)card.appendChild(form);});}
    return card;
  }
  async function loadDashboard(user) {
    if(!user) { root.hidden=true; return; }
    window.BagusinCurrentUser=user; root.hidden=false;
    var result=await window.BagusinSupabase.from("orders").select("id,order_number,order_type,order_status,payment_status,fulfillment_status,total_amount,currency,shipping_method,expires_at,created_at").eq("customer_id",user.id).order("created_at",{ascending:false});
    if(result.error) throw result.error;
    var orders=result.data||[], ids=orders.map(function(o){return o.id;});
    var items=[],payments=[],shipments=[],reviews=[],methods=[];
    if(ids.length){
      var responses=await Promise.all([
        window.BagusinSupabase.from("order_items").select("id,order_id,item_type,item_slug,item_name,quantity").in("order_id",ids),
        window.BagusinSupabase.from("payments").select("id,order_id,payment_status,created_at").in("order_id",ids),
        window.BagusinSupabase.from("shipments").select("id,order_id,tracking_number,shipment_status,tracking_url").in("order_id",ids),
        window.BagusinSupabase.from("product_reviews").select("id,order_item_id,moderation_status").eq("customer_id",user.id)
      ]);
      responses.forEach(function(response){if(response.error)throw response.error;});
      items=responses[0].data||[];payments=responses[1].data||[];shipments=responses[2].data||[];reviews=responses[3].data||[];
    }
    var methodResult=await window.BagusinSupabase.from("payment_methods").select("bank_name,account_holder,account_number,instructions,is_active").eq("method_code","bca_manual");
    if(!methodResult.error) methods=methodResult.data||[];
    var pending=orders.filter(function(o){return ["pending_review","awaiting_payment","processing","ready"].includes(o.order_status);}).length;
    root.querySelector("[data-stat-orders]").textContent=orders.length;
    root.querySelector("[data-stat-pending]").textContent=pending;
    root.querySelector("[data-stat-complete]").textContent=orders.filter(function(o){return o.order_status==="completed";}).length;
    var list=root.querySelector("[data-orders-list]"); list.replaceChildren();
    if(!orders.length) list.appendChild(el("p","member-empty",words.empty));
    orders.forEach(function(order){list.appendChild(renderOrder(order,items,payments,shipments,reviews,methods));});
    var reviewList=root.querySelector("[data-review-list]"); reviewList.replaceChildren();
    if(!reviews.length) reviewList.appendChild(el("p","member-empty",words.reviewEmpty));
    reviews.forEach(function(review){var row=el("div","member-review-row");row.append(el("strong","",statusLabel("review"+review.moderation_status)),el("span","member-muted",review.moderation_status));reviewList.appendChild(row);});
  }
  function start(client) {
    if(root.dataset.memberReady==="true") return;
    root.dataset.memberReady="true";
    client.auth.getSession().then(async function(result){
      var user=result.data.session&&result.data.session.user;
      if(!user){root.hidden=true;return;}
      window.BagusinCurrentUser=user;
      var profile=await client.from("profiles").select("role,display_name").eq("id",user.id).maybeSingle();
      if(profile.error) throw profile.error;
      if(profile.data&&profile.data.role==="admin"){var admin=root.querySelector("[data-admin-link]");if(admin)admin.hidden=false;}
      window.BagusinDisplayName=profile.data&&profile.data.display_name;
      await loadDashboard(user);
    }).catch(function(error){console.error("Bagusin member area:",error);message(words.error,"error");});
    client.auth.onAuthStateChange(function(_event,session){if(session&&session.user){window.BagusinCurrentUser=session.user;loadDashboard(session.user).catch(function(error){message(error.message||words.error,"error");});}else{root.hidden=true;}});
  }
  window.addEventListener("bagusin:supabase-ready",function(event){if(event.detail&&event.detail.client)start(event.detail.client);});
  if(window.BagusinSupabase) start(window.BagusinSupabase);
})();