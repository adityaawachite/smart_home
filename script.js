/* NestControl — merged 3-file standalone build.
   Original Flask API paths are retained in API_MODE below. When opened
   directly as a static file, local demo mode provides the same UI behavior. */

const API_MODE = location.protocol !== "file:"; // Flask/server mode when served over http(s)
const state = {
  user: {name:"Demo User", email:"demo@example.com", joined:"September 27, 2026"},
  rooms: [
    {id:1,name:"Living Room",count:3},{id:2,name:"Bedroom",count:2},
    {id:3,name:"Kitchen",count:1},{id:4,name:"Garage",count:1}
  ],
  devices: [
    {id:1,name:"Living Room Light",type:"light",room:"Living Room",online:true,status:true},
    {id:2,name:"Television",type:"tv",room:"Living Room",online:true,status:false},
    {id:3,name:"Smart Door",type:"door",room:"Living Room",online:true,status:true},
    {id:4,name:"Bedroom Light",type:"light",room:"Bedroom",online:true,status:false},
    {id:5,name:"Ceiling Fan",type:"fan",room:"Bedroom",online:true,status:true},
    {id:6,name:"Kitchen Light",type:"light",room:"Kitchen",online:true,status:false},
    {id:7,name:"Security Alarm",type:"alarm",room:"Garage",online:true,status:false}
  ],
  automations: [
    {id:1,name:"Evening Lights",condition:"Time = 7:00 PM",action:"Living Room Light = ON",enabled:true},
    {id:2,name:"Auto Cooling",condition:"Temperature > 28°C",action:"AC = ON",enabled:true}
  ],
  security:{armed:true,doorLocked:true},
  notifications:[
    {id:1,message:"Welcome to your Smart Home dashboard!",type:"success",time:"09:00 AM",read:false},
    {id:2,message:"Living Room Light turned ON",type:"success",time:"08:32 AM",read:false},
    {id:3,message:"Security system armed",type:"warning",time:"08:15 AM",read:false}
  ],
  history:[
    {time:"08:32 AM",device:"Living Room Light",action:"Turned ON",date:"2026-10-05",status:"Success"},
    {time:"08:15 AM",device:"Smart Door",action:"Locked",date:"2026-10-05",status:"Success"},
    {time:"07:45 AM",device:"Ceiling Fan",action:"Turned OFF",date:"2026-10-05",status:"Success"},
    {time:"07:20 AM",device:"—",action:"Security System Armed",date:"2026-10-05",status:"Success"},
    {time:"06:55 AM",device:"—",action:"Living Room Motion Detected",date:"2026-10-05",status:"Success"}
  ]
};

const icons = {light:"lightbulb",fan:"fan",tv:"tv",door:"door-open",alarm:"bell",ac:"snowflake",other:"plug"};
const pageTitles = {dashboard:"Dashboard",rooms:"Rooms",devices:"Devices",energy:"Energy Monitoring",
  environment:"Environment",security:"Security Center",automation:"Automations",history:"Activity History",
  notifications:"Notifications",profile:"Profile",login:"Login",register:"Create Account"};

function esc(s){const d=document.createElement("div");d.textContent=s??"";return d.innerHTML;}
function save(){try{localStorage.setItem("nestcontrol",JSON.stringify(state));}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem("nestcontrol"));if(x)Object.assign(state,x);}catch(e){}}
function toast(message,type="success"){
  const stack=document.getElementById("toastStack"); if(!stack)return;
  const ic={success:"fa-circle-check",danger:"fa-circle-exclamation",warning:"fa-triangle-exclamation"};
  const el=document.createElement("div"); el.className=`toast ${type}`;
  el.innerHTML=`<i class="fa-solid ${ic[type]||ic.success}"></i><span>${esc(message)}</span>`;
  stack.appendChild(el); setTimeout(()=>{el.classList.add("hide");setTimeout(()=>el.remove(),220)},3200);
}
function go(page){location.hash=page}
function api(path,options={}){
  if(!API_MODE)return Promise.reject(new Error("static-demo"));
  return fetch(path,options).then(r=>r.json());
}
function deviceCard(d){
 return `<div class="device-card" data-device-id="${d.id}">
  <div class="device-card-top"><div class="device-icon"><i class="fa-solid fa-${icons[d.type]||icons.other}"></i></div>
  <div class="device-card-actions"><label class="toggle-switch"><input type="checkbox" class="device-toggle" data-id="${d.id}" ${d.status?"checked":""} ${!d.online?"disabled":""}><span class="toggle-slider"></span></label></div></div>
  <div class="device-name">${esc(d.name)}</div><div class="device-room">${esc(d.room)}</div>
  <div class="device-status"><span class="status-dot ${d.online?"online":"offline"}"></span><span>${d.online?"Online":"Offline"}</span></div>
  <button class="device-remove-btn" data-remove-device="${d.id}" title="Remove device"><i class="fa-solid fa-trash"></i></button>
 </div>`;
}
function pageShell(title,desc,body,button=""){return `<div class="page-heading-row"><div class="page-heading"><h1>${title}</h1><p>${desc}</p></div>${button}</div>${body}`}

function dashboard(){
 const active=state.devices.filter(d=>d.status).length, online=state.devices.filter(d=>d.online).length;
 return `<div class="page-heading"><h1>Good Morning, ${esc(state.user.name.split(" ")[0])} 👋</h1><p>Here's what's happening in your smart home today.</p></div>
 <div class="stat-grid">
  <div class="stat-card"><div class="stat-icon blue"><i class="fa-solid fa-lightbulb"></i></div><div class="stat-info"><span class="stat-value">${state.devices.length}</span><span class="stat-label">Total Devices</span></div></div>
  <div class="stat-card"><div class="stat-icon green"><i class="fa-solid fa-wifi"></i></div><div class="stat-info"><span class="stat-value">${online}</span><span class="stat-label">Online Devices</span></div></div>
  <div class="stat-card"><div class="stat-icon orange"><i class="fa-solid fa-power-off"></i></div><div class="stat-info"><span class="stat-value">${active}</span><span class="stat-label">Active Devices</span></div></div>
  <div class="stat-card"><div class="stat-icon purple"><i class="fa-solid fa-bolt"></i></div><div class="stat-info"><span class="stat-value">6.8 kWh</span><span class="stat-label">Today's Energy</span></div></div>
 </div>
 <div class="page-heading"><h2>Quick Device Control</h2><a href="#devices" class="link-muted">Manage all devices <i class="fa-solid fa-arrow-right"></i></a></div>
 <div class="device-grid">${state.devices.slice(0,6).map(deviceCard).join("")}</div>
 <div class="page-heading"><h2>Recent Activity</h2><a href="#history" class="link-muted">View all <i class="fa-solid fa-arrow-right"></i></a></div>
 <div class="card"><ul class="activity-list">${state.history.slice(0,5).map(a=>`<li><div class="activity-dot"></div><div class="activity-content"><span class="activity-title">${esc(a.device!=="—"?a.device+" ":"")}${esc(a.action)}</span><span class="activity-time">${esc(a.time)}</span></div></li>`).join("")}</ul></div>`;
}
function rooms(){
 const body=`<div class="room-grid" id="roomGrid">${state.rooms.map(r=>`<div class="room-card" data-room-id="${r.id}">
  <div class="room-card-top"><div class="room-icon"><i class="fa-solid fa-door-open"></i></div><div class="room-menu">
  <button class="icon-btn-sm room-menu-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
  <div class="room-menu-dropdown"><button class="room-rename-btn" data-id="${r.id}"><i class="fa-solid fa-pen"></i> Rename</button><button class="room-delete-btn danger" data-id="${r.id}"><i class="fa-solid fa-trash"></i> Delete</button></div></div></div>
  <h3 class="room-name">${esc(r.name)}</h3><p class="room-device-count">${r.count} device${r.count!==1?"s":""}</p></div>`).join("")}</div>
 <div class="modal-overlay" id="roomModal"><div class="modal-box"><div class="modal-header"><h3>Add Room</h3><button class="icon-btn-sm modal-close" data-close="roomModal"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="modal-body"><div class="form-group"><label>Room name</label><input id="roomNameInput" placeholder="e.g. Home Office"></div></div>
 <div class="modal-footer"><button class="btn-secondary" data-close="roomModal">Cancel</button><button class="btn-primary" id="saveRoomBtn">Save</button></div></div></div>`;
 return pageShell("Rooms","Organize your devices by room.",body,`<button class="btn-primary" id="addRoomBtn"><i class="fa-solid fa-plus"></i> Add Room</button>`);
}
function devices(){
 const opts=state.rooms.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join("");
 const body=`<div class="device-grid" id="deviceGrid">${state.devices.map(deviceCard).join("")}</div>
 <div class="modal-overlay" id="deviceModal"><div class="modal-box"><div class="modal-header"><h3>Add Device</h3><button class="icon-btn-sm modal-close" data-close="deviceModal"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="modal-body"><div class="form-group"><label>Device name</label><input id="deviceNameInput" placeholder="e.g. Study Lamp"></div>
 <div class="form-group"><label>Device type</label><select id="deviceTypeSelect"><option value="light">Light</option><option value="fan">Fan</option><option value="ac">Air Conditioner</option><option value="tv">Television</option><option value="door">Smart Door</option><option value="alarm">Security Alarm</option><option value="other">Other</option></select></div>
 <div class="form-group"><label>Room</label><select id="deviceRoomSelect">${opts}</select></div></div>
 <div class="modal-footer"><button class="btn-secondary" data-close="deviceModal">Cancel</button><button class="btn-primary" id="saveDeviceBtn" ${!state.rooms.length?"disabled":""}>Save</button></div></div></div>`;
 return pageShell("Devices","Control and manage all your connected devices.",body,`<button class="btn-primary" id="addDeviceBtn"><i class="fa-solid fa-plus"></i> Add Device</button>`);
}
function energy(){
 return `<div class="page-heading"><h1>Energy Usage</h1><p>Track how much power your home is consuming.</p></div>
 <div class="stat-grid"><div class="stat-card"><div class="stat-icon orange"><i class="fa-solid fa-bolt"></i></div><div class="stat-info"><span class="stat-value">6.8 kWh</span><span class="stat-label">Today's Usage</span></div></div>
 <div class="stat-card"><div class="stat-icon blue"><i class="fa-solid fa-calendar-week"></i></div><div class="stat-info"><span class="stat-value">48.3 kWh</span><span class="stat-label">This Week</span></div></div>
 <div class="stat-card"><div class="stat-icon green"><i class="fa-solid fa-calendar-days"></i></div><div class="stat-info"><span class="stat-value">172.6 kWh</span><span class="stat-label">This Month</span></div></div></div>
 <div class="chart-grid"><div class="card chart-card"><h3>Daily Usage (kWh)</h3><canvas id="dailyChart"></canvas></div><div class="card chart-card"><h3>Weekly Usage (kWh)</h3><canvas id="weeklyChart"></canvas></div></div>`;
}
function environment(){
 return `<div class="page-heading"><h1>Environment Monitoring</h1><p>Live temperature and humidity readings from your home sensors.</p></div>
 <div class="stat-grid two-col"><div class="stat-card env-card"><div class="stat-icon orange"><i class="fa-solid fa-temperature-half"></i></div><div class="stat-info"><span class="stat-value" id="tempValue">25.4°C</span><span class="stat-label">Temperature</span></div></div>
 <div class="stat-card env-card"><div class="stat-icon blue"><i class="fa-solid fa-droplet"></i></div><div class="stat-info"><span class="stat-value" id="humidityValue">56%</span><span class="stat-label">Humidity</span></div></div></div>
 <div class="card chart-card"><h3>24-Hour Trend</h3><canvas id="envChart"></canvas></div>`;
}
function security(){
 const armed=state.security.armed, locked=state.security.doorLocked;
 return `<div class="page-heading"><h1>Home Security</h1><p>Monitor and control your home's security system.</p></div>
 <div class="security-status-card"><div class="security-status-left"><div class="security-icon ${armed?"armed":"disarmed"}"><i class="fa-solid fa-shield-halved"></i></div><div><h3 id="securityStatusText">${armed?"System Armed":"System Disarmed"}</h3><p>${armed?"Your home is protected.":"Your home is currently unprotected."}</p></div></div>
 <div class="security-status-actions"><button class="btn-secondary" id="disarmBtn" ${!armed?"disabled":""}>Disarm</button><button class="btn-primary" id="armBtn" ${armed?"disabled":""}>Arm System</button></div></div>
 <div class="chart-grid"><div class="card"><h3>Smart Door</h3><div class="door-control"><div class="door-icon-wrap"><i class="fa-solid ${locked?"fa-lock":"fa-lock-open"}" id="doorIcon"></i></div><p id="doorStatusText">${locked?"Locked":"Unlocked"}</p><div class="door-buttons"><button class="btn-secondary" id="unlockBtn" ${!locked?"disabled":""}>Unlock</button><button class="btn-primary" id="lockBtn" ${locked?"disabled":""}>Lock Door</button></div></div></div>
 <div class="card"><h3>Security Events</h3><ul class="activity-list">${state.history.filter(x=>/door|security|motion|armed|disarmed/i.test(x.action+" "+x.device)).slice(0,6).map(e=>`<li><div class="activity-dot"></div><div class="activity-content"><span class="activity-title">${esc(e.device!=="—"?e.device+" ":"")}${esc(e.action)}</span><span class="activity-time">${esc(e.time)}</span></div></li>`).join("")}</ul></div></div>`;
}
function automation(){
 const list=state.automations.map(r=>`<div class="automation-card" data-rule-id="${r.id}"><div class="automation-card-main"><h3>${esc(r.name)}</h3>
 <div class="automation-rule"><span class="automation-tag if-tag">IF</span><span>${esc(r.condition)}</span></div><div class="automation-rule"><span class="automation-tag then-tag">THEN</span><span>${esc(r.action)}</span></div></div>
 <div class="automation-card-actions"><label class="toggle-switch"><input type="checkbox" class="automation-toggle" data-id="${r.id}" ${r.enabled?"checked":""}><span class="toggle-slider"></span></label>
 <button class="icon-btn-sm automation-delete-btn" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button></div></div>`).join("");
 const body=`<div class="automation-list" id="automationList">${list}</div>
 <div class="modal-overlay" id="automationModal"><div class="modal-box"><div class="modal-header"><h3>New Automation</h3><button class="icon-btn-sm modal-close" data-close="automationModal"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="modal-body"><div class="form-group"><label>Automation name</label><input id="autoNameInput" placeholder="e.g. Evening Lights"></div><div class="form-group"><label>IF condition</label><input id="autoConditionInput" placeholder="e.g. Time = 7:00 PM"></div><div class="form-group"><label>THEN action</label><input id="autoActionInput" placeholder="e.g. Living Room Light = ON"></div></div>
 <div class="modal-footer"><button class="btn-secondary" data-close="automationModal">Cancel</button><button class="btn-primary" id="saveAutomationBtn">Save</button></div></div></div>`;
 return pageShell("Automations","Create rules to automate your home.",body,`<button class="btn-primary" id="addAutomationBtn"><i class="fa-solid fa-plus"></i> New Automation</button>`);
}
function historyPage(){
 return `<div class="page-heading"><h1>Activity History</h1><p>A complete log of every action performed in your home.</p></div><div class="card">
 <div class="table-filters"><div class="input-icon-wrap search-input"><i class="fa-solid fa-magnifying-glass"></i><input id="searchInput" placeholder="Search activity..."></div>
 <select id="deviceFilter"><option value="">All Devices</option>${[...new Set(state.history.map(x=>x.device).filter(x=>x!=="—"))].map(x=>`<option>${esc(x)}</option>`).join("")}</select>
 <select id="actionFilter"><option value="">All Actions</option><option value="ON">Turned ON</option><option value="OFF">Turned OFF</option><option value="Locked">Locked</option><option value="Unlocked">Unlocked</option><option value="Armed">Armed</option></select><input type="date" id="dateFilter"></div>
 <div class="table-wrap"><table class="data-table" id="historyTable"><thead><tr><th>Time</th><th>Device</th><th>Action</th><th>Status</th></tr></thead><tbody>
 ${state.history.map(a=>`<tr data-device="${esc(a.device)}" data-action="${esc(a.action)}" data-date="${a.date}"><td>${esc(a.time)}</td><td>${esc(a.device)}</td><td>${esc(a.action)}</td><td><span class="badge badge-success">${esc(a.status)}</span></td></tr>`).join("")}
 </tbody></table></div></div>`;
}
function notifications(){
 return `<div class="page-heading"><h1>Notifications</h1><p>Stay up to date with everything happening in your home.</p></div><div class="card"><ul class="notification-list">
 ${state.notifications.map(n=>`<li class="notification-item ${n.read?"":"unread"}"><div class="notif-icon ${n.type}"><i class="fa-solid ${n.type==="success"?"fa-check":n.type==="warning"?"fa-triangle-exclamation":n.type==="danger"?"fa-circle-exclamation":"fa-circle-info"}"></i></div>
 <div class="notification-content"><span class="notification-message">${esc(n.message)}</span><span class="notification-time">Oct 05, ${esc(n.time)}</span></div></li>`).join("")}</ul></div>`;
}
function profile(){
 return `<div class="page-heading"><h1>Profile</h1><p>Manage your account information and security settings.</p></div>
 <div class="profile-header-card"><div class="profile-avatar-lg">${esc(state.user.name[0].toUpperCase())}</div><div><h2>${esc(state.user.name)}</h2><p>${esc(state.user.email)}</p><span class="badge badge-muted">Member since ${esc(state.user.joined)}</span></div></div>
 <div class="chart-grid"><div class="card"><h3>Edit Profile</h3><form id="profileForm"><div class="form-group"><label>Full name</label><input id="profileName" value="${esc(state.user.name)}" required minlength="2"></div><div class="form-group"><label>Email address</label><input value="${esc(state.user.email)}" disabled></div><button class="btn-primary" type="submit">Save Changes</button></form></div>
 <div class="card"><h3>Change Password</h3><form id="passwordForm"><div class="form-group"><label>Current password</label><input type="password" required></div><div class="form-group"><label>New password</label><input type="password" minlength="6" required></div><div class="form-group"><label>Confirm new password</label><input type="password" minlength="6" required></div><button class="btn-primary" type="submit">Update Password</button></form></div></div>`;
}
function authPage(register=false){
 return `<div class="auth-body"><div class="auth-wrapper"><div class="auth-visual"><div class="auth-visual-inner"><div class="brand-icon big"><i class="fa-solid fa-house-signal"></i></div><h1>NestControl</h1><p>${register?"Create your free account and start controlling your smart home in minutes.":"Smart home control, security and automation in one place."}</p>
 <ul class="auth-feature-list"><li><i class="fa-solid fa-check"></i> Unlimited rooms & devices</li><li><i class="fa-solid fa-check"></i> Secure account</li><li><i class="fa-solid fa-check"></i> Simple smart-home control</li></ul></div></div>
 <div class="auth-form-side"><div class="auth-card"><div class="auth-card-header"><h2>${register?"Create your account":"Welcome back"}</h2><p>${register?"Start managing your smart home today":"Sign in to continue to your dashboard"}</p></div>
 <form class="auth-form" id="${register?"registerForm":"loginForm"}">${register?`<div class="form-group"><label>Full name</label><div class="input-icon-wrap"><i class="fa-solid fa-user"></i><input id="regName" required minlength="2" placeholder="Jane Doe"></div></div>`:""}
 <div class="form-group"><label>Email address</label><div class="input-icon-wrap"><i class="fa-solid fa-envelope"></i><input id="authEmail" type="email" required placeholder="you@example.com"></div></div>
 <div class="form-group"><label>Password</label><div class="input-icon-wrap"><i class="fa-solid fa-lock"></i><input id="authPassword" type="password" required minlength="6" placeholder="${register?"At least 6 characters":"Enter your password"}"></div></div>
 ${register?`<div class="form-group"><label>Confirm password</label><div class="input-icon-wrap"><i class="fa-solid fa-lock"></i><input id="regConfirm" type="password" required minlength="6"></div></div>`:`<div class="form-row-between"><label class="checkbox-label"><input type="checkbox"> <span>Remember me</span></label><a href="#" class="link-muted" id="forgotLink">Forgot password?</a></div>`}
 <button class="btn-primary btn-block" type="submit">${register?"Create Account":"Sign In"}</button></form>
 ${!register?`<div class="demo-hint"><i class="fa-solid fa-circle-info"></i> Demo login: <strong>demo@example.com</strong> / <strong>Demo@123</strong></div>`:""}
 <p class="auth-switch">${register?"Already have an account?":"Don't have an account?"} <a href="#${register?"login":"register"}">${register?"Sign in":"Create one"}</a></p></div></div></div>`;
}

function render(){
 load();
 let page=(location.hash.slice(1)||"dashboard").split("?")[0];
 if(!pageTitles[page])page="dashboard";
 const app=document.getElementById("app");
 const pages={dashboard,rooms,devices,energy,environment,security,automation,history:historyPage,notifications,profile};
 app.innerHTML=page==="login"?authPage(false):page==="register"?authPage(true):pages[page]();
 document.title=`${pageTitles[page]} | NestControl`;
 document.getElementById("topbarTitle").textContent=pageTitles[page];
 document.querySelectorAll(".nav-item").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+page));
 const shell=document.querySelector(".app-shell"); shell.style.display=(page==="login"||page==="register")?"none":"flex";
 if(page==="energy")drawEnergy();
 if(page==="environment")drawEnvironment();
 bindCommon(page);
 updateNotificationUI();
}
function bindCommon(page){
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close)?.classList.remove("show"));
 document.querySelectorAll(".device-toggle").forEach(t=>t.onchange=async()=>toggleDevice(+t.dataset.id,t));
 document.querySelectorAll("[data-remove-device]").forEach(b=>b.onclick=()=>removeDevice(+b.dataset.removeDevice));
 document.querySelectorAll(".nav-item").forEach(a=>a.onclick=()=>{document.getElementById("sidebar")?.classList.remove("show");document.getElementById("sidebarOverlay")?.classList.remove("show")});
 if(page==="rooms")bindRooms();
 if(page==="devices")document.getElementById("addDeviceBtn")?.addEventListener("click",()=>document.getElementById("deviceModal").classList.add("show"));
 if(page==="automation")bindAutomation();
 if(page==="security")bindSecurity();
 if(page==="history")bindHistory();
 if(page==="profile")bindProfile();
 if(page==="login")bindLogin(false);
 if(page==="register")bindLogin(true);
}
function bindRooms(){
 document.getElementById("addRoomBtn").onclick=()=>document.getElementById("roomModal").classList.add("show");
 document.getElementById("saveRoomBtn").onclick=()=>{
  const name=document.getElementById("roomNameInput").value.trim(); if(!name)return toast("Room name is required.","danger");
  state.rooms.push({id:Date.now(),name,count:0});save();toast("Room added.");render();
 };
 document.querySelectorAll(".room-menu-btn").forEach(b=>b.onclick=e=>{e.stopPropagation();b.nextElementSibling.classList.toggle("show")});
 document.querySelectorAll(".room-rename-btn").forEach(b=>b.onclick=()=>{
  const r=state.rooms.find(x=>x.id===+b.dataset.id);const n=prompt("New room name:",r.name);
  if(n?.trim()){r.name=n.trim();save();toast("Room renamed.");render()}
 });
 document.querySelectorAll(".room-delete-btn").forEach(b=>b.onclick=()=>{
  const id=+b.dataset.id;if(!confirm("Delete this room?"))return;
  const r=state.rooms.find(x=>x.id===id); if(state.devices.some(d=>d.room===r.name))return toast("Remove or move its devices first.","danger");
  state.rooms=state.rooms.filter(x=>x.id!==id);save();toast("Room deleted.");render();
 });
}
function bindDevicesSave(){
 const b=document.getElementById("saveDeviceBtn");if(!b)return;
 b.onclick=()=>{const name=document.getElementById("deviceNameInput").value.trim(),type=document.getElementById("deviceTypeSelect").value,rid=+document.getElementById("deviceRoomSelect").value;
  const room=state.rooms.find(r=>r.id===rid);if(!name||!room)return toast("Device name and room are required.","danger");
  state.devices.push({id:Date.now(),name,type,room:room.name,online:true,status:false});room.count++;save();toast("Device added.");render();
 };
}
function toggleDevice(id,t){
 const d=state.devices.find(x=>x.id===id), prev=d.status;t.disabled=true;d.status=t.checked;save();
 const msg=`${d.name} turned ${d.status?"ON":"OFF"}`;state.history.unshift({time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),device:d.name,action:d.status?"Turned ON":"Turned OFF",date:new Date().toISOString().slice(0,10),status:"Success"});
 state.notifications.unshift({id:Date.now(),message:msg,type:"success",time:"now",read:false});save();toast(msg);t.disabled=false;updateNotificationUI();
}
function removeDevice(id){if(!confirm("Remove this device?"))return;const d=state.devices.find(x=>x.id===id);const r=state.rooms.find(x=>x.name===d.room);if(r)r.count=Math.max(0,r.count-1);state.devices=state.devices.filter(x=>x.id!==id);save();toast("Device removed.");render();}
function bindAutomation(){
 document.getElementById("addAutomationBtn").onclick=()=>document.getElementById("automationModal").classList.add("show");
 document.getElementById("saveAutomationBtn").onclick=()=>{const n=autoNameInput.value.trim(),c=autoConditionInput.value.trim(),a=autoActionInput.value.trim();if(!n||!c||!a)return toast("Please fill in all fields.","danger");
  state.automations.push({id:Date.now(),name:n,condition:c,action:a,enabled:true});save();toast("Automation created.");render()};
 document.querySelectorAll(".automation-toggle").forEach(t=>t.onchange=()=>{const r=state.automations.find(x=>x.id===+t.dataset.id);r.enabled=t.checked;save();toast(`Automation ${t.checked?"enabled":"disabled"}.`)});
 document.querySelectorAll(".automation-delete-btn").forEach(b=>b.onclick=()=>{if(!confirm("Delete this automation rule?"))return;state.automations=state.automations.filter(x=>x.id!==+b.dataset.id);save();toast("Automation deleted.");render()});
}
function bindSecurity(){
 const update=()=>render();
 document.getElementById("armBtn")?.addEventListener("click",()=>{state.security.armed=true;state.history.unshift({time:"now",device:"—",action:"Security System Armed",date:new Date().toISOString().slice(0,10),status:"Success"});save();toast("Security system armed.");update()});
 document.getElementById("disarmBtn")?.addEventListener("click",()=>{state.security.armed=false;save();toast("Security system disarmed.","warning");update()});
 document.getElementById("lockBtn")?.addEventListener("click",()=>{state.security.doorLocked=true;save();toast("Front Door Locked.");update()});
 document.getElementById("unlockBtn")?.addEventListener("click",()=>{state.security.doorLocked=false;save();toast("Front Door Unlocked.","warning");update()});
}
function bindHistory(){
 const filter=()=>{const q=document.getElementById("searchInput").value.toLowerCase(),d=document.getElementById("deviceFilter").value,a=document.getElementById("actionFilter").value,date=document.getElementById("dateFilter").value;
 document.querySelectorAll("#historyTable tbody tr").forEach(r=>{const ok=(!q||r.textContent.toLowerCase().includes(q))&&(!d||r.dataset.device===d)&&(!a||r.dataset.action.includes(a))&&(!date||r.dataset.date===date);r.style.display=ok?"":"none"})};
 ["searchInput","deviceFilter","actionFilter","dateFilter"].forEach(id=>document.getElementById(id)?.addEventListener("input",filter));
}
function bindProfile(){
 document.getElementById("profileForm")?.addEventListener("submit",e=>{e.preventDefault();const n=document.getElementById("profileName").value.trim();if(n.length<2)return toast("Please enter a valid name.","danger");state.user.name=n;save();toast("Profile updated successfully.");render()});
 document.getElementById("passwordForm")?.addEventListener("submit",e=>{e.preventDefault();toast("Password updated successfully.")});
}
function bindLogin(register){
 const form=document.getElementById(register?"registerForm":"loginForm");if(!form)return;
 form.addEventListener("submit",e=>{e.preventDefault();
  if(register){if(regPassword.value!==regConfirm.value)return toast("Passwords do not match.","danger");state.user.name=regName.value.trim()||"Demo User";state.user.email=authEmail.value.trim()||"demo@example.com";save();toast("Account created.");go("dashboard")}
  else {if(authEmail.value==="demo@example.com"&&authPassword.value==="Demo@123"){toast("Signed in successfully.");go("dashboard")}else toast("Use demo@example.com / Demo@123 for this standalone demo.","danger")}
 });
 document.getElementById("forgotLink")?.addEventListener("click",e=>{e.preventDefault();alert("Password reset is not available in this standalone demo.")});
}
function drawEnergy(){
 const labels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daily=[6.2,7.1,5.8,8.0,6.5,8.9,6.8],weeks=["Week 1","Week 2","Week 3","Week 4"],weekly=[42.5,48.3,51.7,45.9];
 new Chart(document.getElementById("dailyChart"),{type:"line",data:{labels,datasets:[{label:"kWh",data:daily,tension:.35,fill:true}]},options:{responsive:true,plugins:{legend:{display:false}}}});
 new Chart(document.getElementById("weeklyChart"),{type:"bar",data:{labels:weeks,datasets:[{label:"kWh",data:weekly}]},options:{responsive:true,plugins:{legend:{display:false}}}});
}
function drawEnvironment(){
 const labels=["00:00","03:00","06:00","09:00","12:00","15:00","18:00","21:00"],temps=[22,21,23,25,28,29,26,24],hum=[67,69,65,58,49,45,52,60];
 new Chart(document.getElementById("envChart"),{type:"line",data:{labels,datasets:[{label:"Temperature °C",data:temps,tension:.35},{label:"Humidity %",data:hum,tension:.35}]},options:{responsive:true}});
}
function updateNotificationUI(){
 const unread=state.notifications.filter(n=>!n.read).length;document.getElementById("navBadge").textContent=unread||"";document.getElementById("navBadge").style.display=unread?"":"none";document.getElementById("notifDot").style.display=unread?"":"none";
 const b=document.getElementById("notifDropdownBody");if(b)b.innerHTML=state.notifications.slice(0,5).map(n=>`<div class="notif-mini-item ${n.read?"":"unread"}"><span>${esc(n.message)}</span></div>`).join("")||'<div class="empty-mini">No notifications yet.</div>';
}
document.addEventListener("DOMContentLoaded",()=>{
 load();
 const sidebar=document.getElementById("sidebar"),overlay=document.getElementById("sidebarOverlay");
 document.getElementById("hamburgerBtn").onclick=()=>{sidebar.classList.add("show");overlay.classList.add("show")};
 document.getElementById("sidebarClose").onclick=()=>{sidebar.classList.remove("show");overlay.classList.remove("show")};
 overlay.onclick=()=>{sidebar.classList.remove("show");overlay.classList.remove("show")};
 document.getElementById("notifBtn").onclick=e=>{e.stopPropagation();document.getElementById("notifDropdown").classList.toggle("show")};
 document.addEventListener("click",e=>{if(!e.target.closest(".notif-wrapper"))document.getElementById("notifDropdown").classList.remove("show")});
 window.addEventListener("hashchange",render);
 if(!location.hash)location.hash="dashboard"; else render();
});
/* Compatibility: preserve the original Flask API paths when this file is
   copied into the Flask project's static folder. */
