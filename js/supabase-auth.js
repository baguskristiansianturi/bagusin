(function () {
  "use strict";

  var PROJECT_URL = "https://hpmeoxynftankklwgntb.supabase.co";
  var PUBLISHABLE_KEY = "sb_publishable_dozGZy3IZCZCrpq1qikNkQ_s891bCrD";
  var SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.min.js";
  var BASE = window.location.pathname.indexOf("/bagusin/") === 0 || window.location.pathname === "/bagusin"
    ? "/bagusin" : "";

  var isEnglish = /(?:\?|&)lang=en(?:&|$)/.test(window.location.search) ||
    /^\/(?:bagusin\/)?en(?:\/|$)/.test(window.location.pathname);
  var ACCOUNT_URL = BASE + (isEnglish ? "/en/account/" : "/account/");

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function addStyles() {
    if (document.querySelector('link[data-supabase-auth-styles]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BASE + "/css/supabase-auth.css?v=20261102-1";
    link.dataset.supabaseAuthStyles = "";
    document.head.appendChild(link);
  }

  function setMessage(node, message, kind) {
    if (!node) return;
    node.textContent = message || "";
    node.dataset.state = kind || "info";
    node.hidden = !message;
  }

  function loadSdk() {
    return new Promise(function (resolve, reject) {
      if (window.supabase && typeof window.supabase.createClient === "function") {
        resolve(window.supabase);
        return;
      }
      var existing = document.querySelector('script[data-supabase-sdk]');
      if (existing) {
        existing.addEventListener("load", function () { resolve(window.supabase); }, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = SDK_URL;
      script.async = true;
      script.dataset.supabaseSdk = "";
      script.onload = function () {
        if (window.supabase && typeof window.supabase.createClient === "function") resolve(window.supabase);
        else reject(new Error("Supabase client library did not initialize."));
      };
      script.onerror = function () { reject(new Error("Could not load the secure connection library. Check your internet connection and try again.")); };
      document.head.appendChild(script);
    });
  }

  function buildAccountLink() {
    var href = ACCOUNT_URL;
    var actions = document.querySelector(".site-header__actions");
    if (actions && !actions.querySelector("[data-bagusin-account-link]")) {
      var link = document.createElement("a");
      link.className = "bagusin-auth-link";
      link.href = href;
      link.dataset.bagusinAccountLink = "";
      link.textContent = isEnglish ? "Sign in" : "Masuk";
      link.setAttribute("aria-label", isEnglish ? "Sign in or open your account" : "Masuk atau buka akun Anda");
      var searchToggle = actions.querySelector("[data-search-toggle]");
      if (searchToggle) actions.insertBefore(link, searchToggle);
      else actions.appendChild(link);
    }
    var mobileList = document.querySelector(".mobile-nav__list");
    if (mobileList && !mobileList.querySelector("[data-bagusin-account-link]")) {
      var item = document.createElement("li");
      var mobileLink = document.createElement("a");
      mobileLink.className = "mobile-nav__link";
      mobileLink.href = href;
      mobileLink.dataset.bagusinAccountLink = "";
      mobileLink.textContent = isEnglish ? "My account" : "Akun saya";
      item.appendChild(mobileLink);
      mobileList.appendChild(item);
    }
  }

  function updateAccountLinks(user) {
    document.querySelectorAll("[data-bagusin-account-link]").forEach(function (link) {
      link.textContent = user
        ? (isEnglish ? "My account" : "Akun")
        : (isEnglish ? "Sign in" : "Masuk");
      link.classList.toggle("is-authenticated", !!user);
    });
  }

  function init(client) {
    window.BagusinSupabase = client;
    window.dispatchEvent(new CustomEvent("bagusin:supabase-ready", { detail: { client: client } }));

    ready(function () {
      addStyles();
      buildAccountLink();

      var authView = document.querySelector("[data-auth-view]");
      var authForm = document.querySelector("[data-auth-form]");
      var profileView = document.querySelector("[data-profile-view]");
      var profileForm = document.querySelector("[data-profile-form]");
      var message = document.querySelector("[data-auth-message]");
      var profileMessage = document.querySelector("[data-profile-message]");
      var modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
      var nameField = document.querySelector("[data-register-name]");
      var submitButton = document.querySelector("[data-auth-submit]");
      var forgotButton = document.querySelector("[data-forgot-password]");
      var signOutButton = document.querySelector("[data-sign-out]");
      var resetForm = document.querySelector("[data-reset-form]");
      var recoveryForm = document.querySelector("[data-recovery-form]");
      var currentMode = "signin";

      function setMode(mode) {
        currentMode = mode;
        modeButtons.forEach(function (button) {
          var active = button.dataset.authMode === mode;
          button.setAttribute("aria-pressed", active ? "true" : "false");
        });
        if (nameField) nameField.hidden = mode !== "signup";
        if (submitButton) submitButton.textContent = mode === "signup"
          ? (isEnglish ? "Create account" : "Buat akun")
          : (isEnglish ? "Sign in" : "Masuk");
        setMessage(message, "", "info");
      }

      function showProfile(user, profile) {
        if (!authView || !profileView) return;
        authView.hidden = !!user;
        profileView.hidden = !user;
        updateAccountLinks(user);
        if (!user) return;
        var email = document.querySelector("[data-account-email]");
        var role = document.querySelector("[data-account-role]");
        var displayName = document.querySelector("[data-profile-name]");
        var username = document.querySelector("[data-profile-username]");
        var bio = document.querySelector("[data-profile-bio]");
        if (email) email.textContent = user.email || "";
        if (role) role.textContent = profile && profile.role === "admin" ? "Admin" : (isEnglish ? "Member" : "Anggota");
        if (displayName) displayName.value = profile && profile.display_name || "";
        if (username) username.value = profile && profile.username || "";
        if (bio) bio.value = profile && profile.bio || "";
      }

      async function loadProfile(user) {
        if (!user) {
          showProfile(null);
          return;
        }
        var result = await client.from("profiles")
          .select("id,username,display_name,bio,role,avatar_url,created_at")
          .eq("id", user.id)
          .maybeSingle();
        if (result.error) throw result.error;
        showProfile(user, result.data || {});
      }

      async function refreshSession() {
        var result = await client.auth.getSession();
        if (result.error) throw result.error;
        await loadProfile(result.data.session ? result.data.session.user : null);
      }

      modeButtons.forEach(function (button) {
        button.addEventListener("click", function () { setMode(button.dataset.authMode); });
      });
      setMode("signin");

      if (authForm) authForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var formData = new FormData(authForm);
        var email = String(formData.get("email") || "").trim();
        var password = String(formData.get("password") || "");
        var displayName = String(formData.get("display_name") || "").trim();
        if (submitButton) submitButton.disabled = true;
        setMessage(message, isEnglish ? "Please wait…" : "Mohon tunggu…", "info");
        try {
          if (currentMode === "signup") {
            var signup = await client.auth.signUp({
              email: email,
              password: password,
              options: {
                data: { display_name: displayName },
                emailRedirectTo: window.location.origin + ACCOUNT_URL
              }
            });
            if (signup.error) throw signup.error;
            if (signup.data.session) {
              await loadProfile(signup.data.user);
              setMessage(message, isEnglish ? "Your account is ready." : "Akun berhasil dibuat.", "success");
            } else {
              setMessage(message, isEnglish
                ? "Account created. Check your email and confirm the address before signing in."
                : "Akun berhasil dibuat. Periksa email dan konfirmasi alamat email sebelum masuk.", "success");
            }
          } else {
            var signin = await client.auth.signInWithPassword({ email: email, password: password });
            if (signin.error) throw signin.error;
            await loadProfile(signin.data.user);
            setMessage(message, isEnglish ? "You are signed in." : "Anda berhasil masuk.", "success");
          }
        } catch (error) {
          setMessage(message, error.message || (isEnglish ? "Something went wrong." : "Terjadi kesalahan."), "error");
        } finally {
          if (submitButton) submitButton.disabled = false;
        }
      });

      if (forgotButton) forgotButton.addEventListener("click", async function () {
        var emailInput = authForm && authForm.querySelector('[name="email"]');
        var email = emailInput ? emailInput.value.trim() : "";
        if (!email) {
          setMessage(message, isEnglish ? "Enter your email address first." : "Masukkan alamat email terlebih dahulu.", "error");
          if (emailInput) emailInput.focus();
          return;
        }
        try {
          var result = await client.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + ACCOUNT_URL
          });
          if (result.error) throw result.error;
          setMessage(message, isEnglish ? "If this email is registered, a password reset link has been sent." : "Jika email terdaftar, tautan pengaturan ulang kata sandi sudah dikirim.", "success");
        } catch (error) {
          setMessage(message, error.message, "error");
        }
      });

      if (resetForm) resetForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var password = String(new FormData(resetForm).get("new_password") || "");
        try {
          var result = await client.auth.updateUser({ password: password });
          if (result.error) throw result.error;
          setMessage(message, isEnglish ? "Password updated. You can continue using your account." : "Kata sandi diperbarui. Anda dapat melanjutkan menggunakan akun.", "success");
          resetForm.hidden = true;
          await refreshSession();
        } catch (error) {
          setMessage(message, error.message, "error");
        }
      });

      if (recoveryForm) {
        var hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        if (hash.get("type") === "recovery" || window.location.search.indexOf("type=recovery") >= 0) {
          recoveryForm.hidden = false;
          if (authForm) authForm.hidden = true;
          authView.hidden = false;
          profileView.hidden = true;
        }
        recoveryForm.addEventListener("submit", async function (event) {
          event.preventDefault();
          var password = String(new FormData(recoveryForm).get("new_password") || "");
          try {
            var result = await client.auth.updateUser({ password: password });
            if (result.error) throw result.error;
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            recoveryForm.hidden = true;
            if (authForm) authForm.hidden = false;
            authView.hidden = false;
            setMessage(message, isEnglish ? "Password updated. Please sign in." : "Kata sandi berhasil diperbarui. Silakan masuk.", "success");
            await refreshSession();
          } catch (error) {
            setMessage(message, error.message, "error");
          }
        });
      }

      if (profileForm) profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var sessionResult = await client.auth.getSession();
        var user = sessionResult.data.session && sessionResult.data.session.user;
        if (!user) return;
        var data = new FormData(profileForm);
        var payload = {
          display_name: String(data.get("display_name") || "").trim() || null,
          username: String(data.get("username") || "").trim() || null,
          bio: String(data.get("bio") || "").trim() || null
        };
        try {
          var result = await client.from("profiles").update(payload).eq("id", user.id).select("id,username,display_name,bio,role").single();
          if (result.error) throw result.error;
          setMessage(profileMessage, isEnglish ? "Profile saved." : "Profil berhasil disimpan.", "success");
        } catch (error) {
          setMessage(profileMessage, error.message || (isEnglish ? "Could not save profile." : "Profil belum dapat disimpan."), "error");
        }
      });

      if (signOutButton) signOutButton.addEventListener("click", async function () {
        signOutButton.disabled = true;
        try {
          var result = await client.auth.signOut();
          if (result.error) throw result.error;
          showProfile(null);
          setMessage(message, isEnglish ? "You have signed out." : "Anda sudah keluar.", "success");
        } catch (error) {
          setMessage(profileMessage, error.message, "error");
        } finally {
          signOutButton.disabled = false;
        }
      });

      client.auth.onAuthStateChange(function (_event, session) {
        window.setTimeout(function () {
          loadProfile(session ? session.user : null).catch(function (error) {
            setMessage(profileMessage || message, error.message, "error");
          });
        }, 0);
      });

      refreshSession().catch(function (error) {
        updateAccountLinks(null);
        setMessage(message, error.message || (isEnglish ? "Could not check your session." : "Tidak dapat memeriksa sesi akun."), "error");
      });
    });
  }

  loadSdk().then(function (sdk) {
    var client = sdk.createClient(PROJECT_URL, PUBLISHABLE_KEY, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });
    init(client);
  }).catch(function (error) {
    ready(function () {
      addStyles();
      buildAccountLink();
      var message = document.querySelector("[data-auth-message]");
      setMessage(message, error.message, "error");
    });
  });
})();