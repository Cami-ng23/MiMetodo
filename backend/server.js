import 'dotenv/config'
import express from 'express'
const app=express();app.use(express.json({limit:'100kb'}))
const SYSTEM=`Te llamas "MiMétodo", asistente virtual de una app de bienestar. Responde en español, de forma amable, clara, cercana y sin lenguaje médico técnico. Te enfocas en educación general sobre métodos anticonceptivos, recordatorios, síntomas y salud sexual y reproductiva. NO eres médica: no diagnostiques ni reemplaces a un profesional. Si algo puede requerir evaluación, recomienda consultar a un profesional; si parece urgente, recomienda buscar atención médica de inmediato. Respuestas breves.`
app.post('/api/chat',async(req,res)=>{
 const key=process.env.OPENROUTER_API_KEY
 if(!key||key==='tu_api_key_aqui')return res.status(500).json({error:'Falta OPENROUTER_API_KEY en el archivo .env del backend.'})
 const {message,history=[]}=req.body||{}
 if(!message||typeof message!=='string')return res.status(400).json({error:'Mensaje vacío'})
 const msgs=[{role:'system',content:SYSTEM},...history.slice(-12).filter(m=>m&&['user','assistant'].includes(m.role)).map(m=>({role:m.role,content:String(m.content).slice(0,2000)})),{role:'user',content:message.slice(0,2000)}]
 try{
  const r=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','X-Title':'MiMetodo'},body:JSON.stringify({model:process.env.OPENROUTER_MODEL||'openrouter/free',messages:msgs})})
  const d=await r.json()
  const text=d?.choices?.[0]?.message?.content
  if(!r.ok||!text){console.error('OpenRouter:',r.status,d?.error?.message);return res.status(502).json({error:'No pudimos conectar con el asistente. Inténtalo nuevamente.'})}
  res.json({response:text})
 }catch(e){console.error(e.message);res.status(502).json({error:'No pudimos conectar con el asistente. Inténtalo nuevamente.'})}
})
app.listen(3001,()=>console.log('Backend en http://localhost:3001'))
