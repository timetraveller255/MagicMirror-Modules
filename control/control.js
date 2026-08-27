/*
 * Remote control
 * Copyright 2026, Razvan Cristea. All rights reserved.
 */
const statusLed=document.getElementById("statusLed");
const connectionText=document.getElementById("connectionText");
const hostnameElement=document.getElementById("hostname");
const uptimeElement=document.getElementById("uptime");
const clockElement=document.getElementById("clock");
const dateElement=document.getElementById("date");
const commandLog=document.getElementById("commandLog");
const overlay=document.getElementById("confirmOverlay");
const dialogMessage=document.getElementById("dialogMessage");
const confirmButton=document.getElementById("confirmButton");
const cancelButton=document.getElementById("cancelButton");
let pendingCommand=null;
function setConnection(online){
    statusLed.classList.toggle("online",online);
    statusLed.classList.toggle("offline",!online);
    connectionText.textContent=online?"ONLINE":"OFFLINE";
}
function formatUptime(seconds){
    seconds=Math.max(0,Number(seconds)||0);
    const days=Math.floor(seconds/86400);
    const hours=Math.floor((seconds%86400)/3600);
    const minutes=Math.floor((seconds%3600)/60);
    const secs=Math.floor(seconds%60);
    if(days>0)return `${days}d ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}`;
    return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}
function updateClock(){
    const now=new Date();
    clockElement.textContent=now.toLocaleTimeString("ro-RO",{hour12:false});
    dateElement.textContent=now.toLocaleDateString("ro-RO");
}
function addLog(message,type=""){
    if(!message)return;
    const line=document.createElement("div");
    line.className=`log-line ${type}`;
    const time=document.createElement("time");
    const source=document.createElement("b");
    const text=document.createElement("span");
    time.textContent=new Date().toLocaleTimeString("ro-RO",{hour12:false});
    source.textContent="SYS";
    text.textContent=String(message);
    line.append(time,source,text);
    commandLog.appendChild(line);
    commandLog.scrollTop=commandLog.scrollHeight;
}
async function checkStatus(){
    try{
        const response=await fetch("/control/api/status",{method:"GET",cache:"no-store"});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const data=await response.json();
        if(data.ok!==true)throw new Error("Invalid status response");
        setConnection(true);
        hostnameElement.textContent=data.hostname||"--------";
        uptimeElement.textContent=formatUptime(data.uptime);
    }catch(error){
        setConnection(false);
        hostnameElement.textContent="--------";
        uptimeElement.textContent="--:--:--";
    }
}
async function sendCommand(command){
    addLog(`COMMAND: ${command.toUpperCase()}`,"log-info");
    try{
        const response=await fetch("/control/api/command",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            cache:"no-store",
            body:JSON.stringify({command})
        });
        const data=await response.json();
        if(!response.ok||data.ok!==true){
            throw new Error(data.error||`HTTP ${response.status}`);
        }
        addLog(data.label||"COMMAND ACCEPTED","log-success");
        if(data.result){
            if(data.result.stdout){
                const stdout=data.result.stdout.trim();
                if(stdout)addLog(stdout,"log-info");
            }
            if(data.result.stderr){
                const stderr=data.result.stderr.trim();
                if(stderr)addLog(stderr,"log-error");
            }
        }
        if(command==="x11"||command==="wayland"||command==="startrek"||command==="starwars"||command==="classic"||command==="pinkfloyd"||command==="server"){
            setConnection(false);
            setTimeout(checkStatus,3000);
            setTimeout(checkStatus,6000);
            setTimeout(checkStatus,10000);
        }
        if(command==="reboot"){
            setConnection(false);
        }
    }catch(error){
        addLog(error.message||"COMMAND FAILED","log-error");
    }
}
function showConfirm(command){
    pendingCommand=command;
    const names={
        x11:"RESTART X11",
        wayland:"RESTART WAYLAND",
        startrek:"STARTREK MODE",
        starwars:"STARWARS MODE",
        classic:"CLASSIC MODE",
        pinkfloyd:"PINK FLOYD",
        server:"RESTART SERVER",
        reboot:"REBOOT RASPBERRY PI"
    };
    dialogMessage.textContent=`CONFIRM ${names[command]||command.toUpperCase()}?`;
    overlay.classList.remove("hidden");
}
function hideConfirm(){
    pendingCommand=null;
    overlay.classList.add("hidden");
}
document.querySelectorAll("[data-command]").forEach(button=>{
    button.addEventListener("click",()=>showConfirm(button.dataset.command));
});
confirmButton.addEventListener("click",()=>{
    if(pendingCommand)sendCommand(pendingCommand);
    hideConfirm();
});
cancelButton.addEventListener("click",hideConfirm);
overlay.addEventListener("click",event=>{
    if(event.target===overlay)hideConfirm();
});
updateClock();
checkStatus();
setInterval(updateClock,1000);
setInterval(checkStatus,2000);