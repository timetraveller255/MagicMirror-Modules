/*
 * Remote control and dimmer
 * Copyright 2026, Razvan Cristea. All rights reserved.
 */
const NodeHelper=require("node_helper");
const path=require("path");
const fs=require("fs");
const express=require("express");
const {spawn}=require("child_process");
const os=require("os");

module.exports=NodeHelper.create({
    start(){
        this.magicMirrorRoot=path.resolve(this.path,"../..");
        this.ipadPath=path.join(this.magicMirrorRoot,"ipad");
        this.controlPath=path.join(this.magicMirrorRoot,"control");
        this.commands={
            x11:{label:"Restart X11",script:"restartx.sh"},
            wayland:{label:"Restart Wayland",script:"restartw.sh"},
            startrek:{label:"Restart StarTrek Mode",script:"startrek.sh"},
            starwars:{label:"Restart StarWars Mode",script:"starwars.sh"},
            classic:{label:"Restart Classic Mode",script:"classic.sh"},
            pinkfloyd:{label:"Restart Pink Floyd",script:"pinkfloyd.sh"},
            server:{label:"Restart Server Only",script:"restarts.sh"},
            reboot:{label:"Reboot Raspberry Pi",script:"reboot-rpi.sh"}
        };
        this.expressApp.use("/ipad",express.static(this.ipadPath));
        this.expressApp.use("/control",express.static(this.controlPath));
        this.expressApp.get("/ipad",(req,res)=>{
            res.sendFile(path.join(this.ipadPath,"index.html"));
        });
        this.expressApp.get("/control",(req,res)=>{
            res.sendFile(path.join(this.controlPath,"index.html"));
        });
        this.expressApp.get("/control/api/status",(req,res)=>{
            res.json({
                ok:true,
                hostname:os.hostname(),
                platform:process.platform,
                architecture:process.arch,
                node:process.version,
                uptime:Math.floor(process.uptime()),
                time:new Date().toISOString()
            });
        });
        this.expressApp.get("/control/api/commands",(req,res)=>{
            const commands={};
            Object.entries(this.commands).forEach(([id,command])=>{
                commands[id]={label:command.label};
            });
            res.json({ok:true,commands});
        });
        this.expressApp.post("/control/api/command",express.json(),async(req,res)=>{
            const id=req.body&&req.body.command;
            if(!id||!this.commands[id]){
                return res.status(400).json({ok:false,error:"Unknown command"});
            }
            try{
                const result=await this.executeScript(this.commands[id].script);
                res.json({ok:true,command:id,label:this.commands[id].label,result});
            }catch(error){
                console.error(`[${this.name}] Command send:`,error);
                res.status(500).json({ok:false,command:id,error:error.message});
            }
        });
        console.log(`[${this.name}] Root: ${this.magicMirrorRoot}`);
    },
    executeScript(scriptName){
        return new Promise((resolve,reject)=>{
            const scriptPath=path.join(this.magicMirrorRoot,scriptName);
            const root=this.magicMirrorRoot+path.sep;

            if(!scriptPath.startsWith(root)){
                return reject(new Error("Invalid script path"));
            }

            if(!fs.existsSync(scriptPath)){
                return reject(new Error(`Script not found: ${scriptName}`));
            }

            if(process.platform==="win32"){
                return reject(new Error("This module requires Linux"));
            }

            const child=spawn("bash",[scriptPath],{
                cwd:this.magicMirrorRoot,
                env:{
                    ...process.env,
                    MAGICMIRROR_ROOT:this.magicMirrorRoot
                },
                detached:true,
                stdio:"ignore"
            });

            child.unref();

            resolve({
                exitCode:0,
                stdout:"",
                stderr:""
            });
        });
    }
});