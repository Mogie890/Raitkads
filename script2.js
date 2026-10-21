// FINAL script2.js - FIXED LOGIN (No more M2N stuck!)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzF2sCq-EhdIX-deQXzHN_pHkINy6xEsckGhU54YM106lbS-fFb0xAB11stHa9sZAFv_A/exec";

// Clear old data on page load if logout param
if(location.search.includes('logout')){
  localStorage.clear();
}

async function getShopsFromSheet(){
  return new Promise((resolve)=>{
    let cb = "shops_cb_"+Date.now();
    window[cb]=function(data){
      delete window[cb];
      document.body.removeChild(s);
      resolve(data);
    };
    let s=document.createElement('script');
    s.src=SCRIPT_URL+"?type=getShops&callback="+cb+"&t="+Date.now();
    document.body.appendChild(s);
  });
}

async function doLogin(){
  let phoneInput = document.getElementById('phone')||document.getElementById('shopPhone')||document.getElementById('loginPhone');
  let passInput = document.getElementById('password')||document.getElementById('loginPassword');
  
  if(!phoneInput || !passInput){
    alert("Login inputs not found! Check IDs: phone & password");
    return;
  }
  
  let phone = phoneInput.value.trim();
  let pass = passInput.value.trim();
  
  if(!phone || !pass){ alert("Enter phone & password!"); return; }
  
  let msgEl = document.getElementById('msg')||document.getElementById('loginMsg');
  if(msgEl) msgEl.innerText = "Checking...";
  
  try{
    let data = await getShopsFromSheet();
    if(!data || data.length<=1){ if(msgEl) msgEl.innerText="No shops found"; return; }
    
    let found = null;
    // Sheet: A ShopName, B Phone, C Password, D Location...
    for(let i=1;i<data.length;i++){
      let r=data[i];
      if(!r) continue;
      let sName = (r[0]||'').toString().trim();
      let sPhone = (r[1]||'').toString().trim();
      let sPass = (r[2]||'').toString().trim();
      
      let cleanInput = phone.replace(/\D/g,'').slice(-8);
      let cleanSheet = sPhone.replace(/\D/g,'').slice(-8);
      
      if((sPhone==phone || cleanSheet==cleanInput) && sPass==pass){
        found = {shopName:sName, phone:sPhone, password:sPass};
        break;
      }
    }
    
    if(found){
      // *** CRITICAL FIX: CLEAR OLD M2N DATA ***
      localStorage.clear();
      
      // SAVE NEW RESELLER
      localStorage.setItem('shopName', found.shopName);
      localStorage.setItem('shopPhone', found.phone);
      localStorage.setItem('phone', found.phone);
      localStorage.setItem('shop', found.shopName);
      
      if(msgEl) msgEl.innerText = `✅ Welcome ${found.shopName}!`;
      
      // Redirect with params to force dashboard update
      setTimeout(()=>{
        location.href = `dashboard.html?phone=${encodeURIComponent(found.phone)}&shop=${encodeURIComponent(found.shopName)}&t=${Date.now()}`;
      },500);
    }else{
      if(msgEl) msgEl.innerText = "❌ Wrong phone or password!";
      alert("Reseller not found! Check phone & password.");
    }
  }catch(e){
    if(msgEl) msgEl.innerText = "Error: "+e;
    alert(e);
  }
}

// Auto-attach to login button
document.addEventListener('DOMContentLoaded', ()=>{
  let btn = document.getElementById('loginBtn')||document.querySelector('button[type="submit"]');
  if(btn){
    btn.onclick = (e)=>{ e.preventDefault(); doLogin(); };
  }
});

// Logout function
function logout(){
  localStorage.clear();
  location.href = "reseller.html?logout=1&t="+Date.now();
}
