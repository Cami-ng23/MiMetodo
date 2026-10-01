import 'dotenv/config'
import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'
const dist=path.join(path.dirname(fileURLToPath(import.meta.url)),'..','dist')
const app=express();app.set('trust proxy',1);app.use(express.json({limit:'100kb'}))
const hits=new Map()
app.use('/api/chat',(req,res,next)=>{const now=Date.now(),a=(hits.get(req.ip)||[]).filter(t=>now-t<600000);if(a.length>=30)return res.status(429).json({error:'Demasiados mensajes, espera unos minutos.'});a.push(now);hits.set(req.ip,a);next()})
const SYSTEM=`Te llamas "MiMétodo", asistente virtual de una app de bienestar. Responde en español, de forma amable, clara, cercana y sin lenguaje médico técnico. Te enfocas en educación general sobre métodos anticonceptivos, recordatorios, síntomas y salud sexual y reproductiva. NO eres médica: no diagnostiques ni reemplaces a un profesional. Si algo puede requerir evaluación, recomienda consultar a un profesional; si parece urgente, recomienda buscar atención médica de inmediato. Respuestas breves.`
app.post('/api/chat',async(req,res)=>{
 const key=process.env.OPENROUTER_API_KEY
 if(!key||key==='tu_api_key_aqui')return res.status(500).json({error:'Falta OPENROUTER_API_KEY en el archivo .env del backend.'})
 const {message,history=[],perfil}=req.body||{}
 const cl=(v,n)=>String(v??'').replace(/[^\p{L}\p{N}\s.,-]/gu,'').slice(0,n)
 const ctx=perfil?`\nDatos de la usuaria (úsalos para personalizar y llamarla por su nombre): nombre ${cl(perfil.nombre,40)}, edad ${cl(perfil.edad,3)} años, método actual: ${cl(perfil.metodo,40)}. Si es menor de 18, usa lenguaje apropiado y sugiere hablar con una persona adulta de confianza o un profesional de salud.`:''
 if(!message||typeof message!=='string')return res.status(400).json({error:'Mensaje vacío'})
 const msgs=[{role:'system',content:SYSTEM+ctx},...history.slice(-12).filter(m=>m&&['user','assistant'].includes(m.role)).map(m=>({role:m.role,content:String(m.content).slice(0,2000)})),{role:'user',content:message.slice(0,2000)}]
 try{
  const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','X-Title':'MiMetodo'},body:JSON.stringify({model:process.env.OPENROUTER_MODEL||'openrouter/free',messages:msgs})})
  const d=await r.json()
  const text=d?.choices?.[0]?.message?.content
  if(!r.ok||!text){console.error('OpenRouter:',r.status,d?.error?.message);return res.status(502).json({error:'No pudimos conectar con el asistente. Inténtalo nuevamente.'})}
  res.json({response:text})
 }catch(e){console.error(e.message);res.status(502).json({error:'No pudimos conectar con el asistente. Inténtalo nuevamente.'})}
})
app.use(express.static(dist))
app.get('*',(req,res)=>res.sendFile(path.join(dist,'index.html')))
const PORT=process.env.PORT||3001
app.listen(PORT,()=>console.log('Backend en puerto '+PORT))