// FIXED script2.js - Auto-detects inputs (no IDs needed!)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzF2sCq-EhdIX-deQXzHN_pHkINy6xEsckGhU54YM106lbS-fFb0xAB11stHa9sZAFv_A/exec";

if(location.search.includes('logout')){ localStorage.clear(); }

async function getShops(){
  return new Promise((res)=>{
    let cb="cb"+Date.now();
    window[cb]=function(d){delete window[cb];document.body.removeChild(s);res(d);};
    let s=document.createElement('script');
    s.src=SCRIPT_URL+"?type=getShops&callback="+cb+"&t="+Date.now();
    document.body.appendChild(s);
  });
}

function findInputs(){
  // Find all inputs on page
  let all = document.querySelectorAll('input');
  console.log("Found inputs:", all.length);
  if(all.length >=2){
    return {userInput: all[0], passInput: all[1]}; // First = Shop/Phone, Second = Password
  }
  return {userInput: null, passInput: null};
}

async function doLogin(){
  let {userInput, passInput} = findInputs();
  
  if(!userInput || !passInput){
    alert("Only found "+document.querySelectorAll('input').length+" inputs! Need 2 inputs in reseller.html");
    return;
  }
  
  let userVal = userInput.value.trim(); // Can be Shop Name OR Phone
  let passVal = passInput.value.trim();
  
  if(!userVal || !passVal){ alert("Enter shop name/phone & password!"); return; }
  
  let msg = document.getElementById('msg');
  if(msg) msg.innerText = "Checking...";
  
  let data = await getShops();
  let found = null;
  
  for(let i=1;i<data.length;i++){
    let r=data[i]; if(!r) continue;
    let sName=(r[0]||'').toString().trim();
    let sPhone=(r[1]||'').toString().trim();
    let sPass=(r[2]||'').toString().trim();
    
    // Check by SHOP NAME (Ira Tauna) OR Phone
    let matchName = sName.toLowerCase() === userVal.toLowerCase();
    let matchPhone = sPhone === userVal || sPhone.includes(userVal) || userVal.includes(sPhone);
    
    if((matchName || matchPhone) && sPass === passVal){
      found = {shopName:sName, phone:sPhone};
      break;
    }
  }
  
  if(found){
    localStorage.clear();
    localStorage.setItem('shopName', found.shopName);
    localStorage.setItem('shopPhone', found.phone);
    localStorage.setItem('phone', found.phone);
    
    alert("✅ Welcome "+found.shopName+"!");
    location.href=`dashboard.html?phone=${encodeURIComponent(found.phone)}&shop=${encodeURIComponent(found.shopName)}&t=${Date.now()}`;
  }else{
    alert("❌ Wrong! Tried '"+userVal+"' but not found. Check your Google Sheet - Sheet1 must have: Col A=Shop Name (Ira Tauna), Col B=Phone, Col C=Password");
  }
}

// Auto attach to LOGIN button
document.addEventListener('DOMContentLoaded', ()=>{
  let btn = document.querySelector('button');
  if(btn){
    btn.onclick = (e)=>{ e.preventDefault(); doLogin(); };
    console.log("Login button hooked");
  }
});

function logout(){ localStorage.clear(); location.href='reseller.html?t='+Date.now(); }
