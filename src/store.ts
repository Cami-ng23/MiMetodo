import {useState,useEffect} from 'react'
export type DB={tomas:string[];horas:Record<string,string>;sint:any[];camb:any[];rec:any[];fech:any[];metodo:string;perfil:any;visitas:string[]}
const K='mimetodo-db'
export const iso=(d=new Date())=>d.toLocaleDateString('sv')
export const init:DB={perfil:null,visitas:[],tomas:[],horas:{},sint:[],camb:[],metodo:'Pastillas anticonceptivas',rec:[{id:1,name:'Toma tu pastilla',time:'21:00',date:iso(),freq:'Todos los días',on:true}],fech:[{id:1,name:'Control médico',date:'2026-10-17',time:'19:00',note:''},{id:2,name:'Renovar método anticonceptivo',date:'2026-10-25',time:'',note:''}]}
export function useDB():[DB,(p:Partial<DB>)=>void,()=>void]{
 const [db,setDb]=useState<DB>(()=>{try{return {...init,...JSON.parse(localStorage.getItem(K)||'{}')}}catch{return init}})
 useEffect(()=>{localStorage.setItem(K,JSON.stringify(db))},[db])
 useEffect(()=>{setDb(d=>d.perfil&&!d.visitas.includes(iso())?{...d,visitas:[...d.visitas,iso()]}:d)},[db.perfil])
 return [db,p=>setDb(d=>({...d,...p})),()=>setDb(init)]
}
export const streak=(t:string[])=>{let n=0;const d=new Date();if(!t.includes(iso(d)))d.setDate(d.getDate()-1);while(t.includes(iso(d))){n++;d.setDate(d.getDate()-1)}return n}
export const chatApi=async(message:string,history:any[],perfil:any)=>{
 const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history,perfil})})
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'error');return d.response as string
}