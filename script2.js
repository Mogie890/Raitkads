const SHEET_URL = "https://script.google.com/macros/s/AKfycbzF2sCq-EhdIX-deQXzHN_pHkINy6xEsckGhU54YM106lbS-fFb0xAB11stHa9sZAFv_A/exec";

function jsonpRequest(params, callback){
  const cb = "cb_"+Date.now()+"_"+Math.floor(Math.random()*1000);
    window[cb] = function(data){
        try{ callback(data); }finally{ 
              const el = document.getElementById(cb); 
                    if(el) el.remove(); 
                          delete window[cb]; 
                              }
                                };
                                  const qs = new URLSearchParams({...params, callback: cb, _: Date.now()}).toString();
                                    const s = document.createElement("script");
                                      s.id = cb;
                                        s.src = SHEET_URL + "?" + qs;
                                          s.onerror = ()=>{
                                              alert("Could not connect to Google Sheet!");
                                                  delete window[cb];
                                                      s.remove();
                                                        };
                                                          document.body.appendChild(s);
                                                          }

                                                          function register(){
                                                            const inputs = document.querySelectorAll('input');
                                                              const selects = document.querySelectorAll('select');
                                                                const shop = inputs[0]?.value.trim();
                                                                  const owner = inputs[1]?.value.trim();
                                                                    const phone = inputs[2]?.value.trim();
                                                                      const idType = selects[0]?.value || "Driver License";
                                                                        const idNumber = inputs[3]?.value.trim();
                                                                          const province = inputs[4]?.value.trim();
                                                                            const town = inputs[5]?.value.trim();
                                                                              const location = inputs[6]?.value.trim();
                                                                                const pass = inputs[7]?.value.trim();

                                                                                  if(!shop || !pass){
                                                                                      alert("Fill shop name and password");
                                                                                          return;
                                                                                            }
                                                                                              
                                                                                                const btn = document.querySelector('button');
                                                                                                  if(btn) btn.disabled = true;
                                                                                                    
                                                                                                      jsonpRequest({type:"register", shop, owner, phone, idType, idNumber, province, town, location, pass}, (res)=>{
                                                                                                          if(btn) btn.disabled = false;
                                                                                                              if(res && res.success){
                                                                                                                    alert("✅ "+res.message);
                                                                                                                          location.reload();
                                                                                                                              } else {
                                                                                                                                    alert("❌ "+(res?.message||"Failed"));
                                                                                                                                        }
                                                                                                                                          });
                                                                                                                                          }

                                                                                                                                          function createShop(){ register(); }

                                                                                                                                          function login(){
                                                                                                                                            const inputs = document.querySelectorAll('input');
                                                                                                                                              const shop = document.getElementById("loginShop")?.value.trim() || inputs[0]?.value.trim();
                                                                                                                                                const pass = document.getElementById("loginPass")?.value.trim() || inputs[1]?.value.trim();
                                                                                                                                                  
                                                                                                                                                    if(!shop || !pass){
                                                                                                                                                        alert("Enter Shop Name and Password");
                                                                                                                                                            return;
                                                                                                                                                              }
                                                                                                                                                                
                                                                                                                                                                  const btn = document.getElementById("loginBtn");
                                                                                                                                                                    if(btn){
                                                                                                                                                                        btn.disabled=true;
                                                                                                                                                                            btn.innerText="Checking...";
                                                                                                                                                                              }
                                                                                                                                                                                
                                                                                                                                                                                  jsonpRequest({type:"list"}, (data)=>{
                                                                                                                                                                                      if(btn){
                                                                                                                                                                                            btn.disabled=false;
                                                                                                                                                                                                  btn.innerText="LOGIN";
                                                                                                                                                                                                      }
                                                                                                                                                                                                          
                                                                                                                                                                                                              if(!Array.isArray(data)){
                                                                                                                                                                                                                    alert(data.message||"Error loading shops");
                                                                                                                                                                                                                          return;
                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                  // data[i][0]=shopName, data[i][8]=password
                                                                                                                                                                                                                                      for(let i=1; i<data.length; i++){
                                                                                                                                                                                                                                            const rowShop = String(data[i][0]||"").trim();
                                                                                                                                                                                                                                                  const rowPass = String(data[i][8]||"").trim();

                                                                                                                                                                                                                                                        if(rowShop.toLowerCase() === shop.toLowerCase() && rowPass === pass){
                                                                                                                                                                                                                                                                localStorage.setItem("currentShop", rowShop);
                                                                                                                                                                                                                                                                        alert("Welcome "+rowShop+"! ✅");
                                                                                                                                                                                                                                                    
window.location.href = "dashboard.html";
                                                                                                                                                                                                                                                                                        
return;
                                                                                                                                                                                                                                                                                              
}
                                                                                                                                                                                                                                                                                                  
}

                                                                                                                    alert("❌ Wrong Shop Name or Password. Shops found: "+(data.length-1));
                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                        function viewShops(){
                                                                                                                                                                                                                                                                                                          jsonpRequest({type:"list"}, (data)=>{
                                                                                                                                                                                                                                                                                                              if(!Array.isArray(data)){
                                                                                                                                                                                                                                                                                                                    alert(data.message||"No shops");
                                                                                                                                                                                                                                                                                                                          return;
                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                  let msg = "SHOPS ("+(data.length-1)+"):\n\n";
                                                                                                                                                                                                                                                                                                                                      for(let i=1;i<data.length;i++){
                                                                                                                                                                                                                                                                                                                                            msg += data[i][0]+" | "+data[i][2]+" | "+data[i][5]+"\n";
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                    alert(msg);
                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                      }