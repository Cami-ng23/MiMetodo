import {useState,useRef,useEffect,ReactNode} from 'react'
import {Home,CalendarDays,Plus,Lightbulb,User,Flame,Pill,Bell,HeartPulse,Sparkles,BookOpen,ChevronRight,ChevronLeft,Send,X,Check,Shield,Settings,LogOut,SlidersHorizontal,Repeat,ClipboardList} from 'lucide-react'
import {useDB,streak,iso,chatApi,DB} from './store'

const C=({children,className='',onClick}:{children:ReactNode;className?:string;onClick?:()=>void})=>
 <div onClick={onClick} className={`up rounded-3xl bg-white/80 shadow-soft p-4 ${onClick?'cursor-pointer active:scale-[.98] transition':''} ${className}`}>{children}</div>
const Btn=({children,onClick,ghost=false}:{children:ReactNode;onClick:()=>void;ghost?:boolean})=>
 <button onClick={onClick} className={`w-full rounded-full px-5 py-3 text-sm font-medium transition active:scale-95 ${ghost?'bg-sand text-cafe':'bg-gradient-to-br from-[#c28a66] to-cop text-white shadow-soft'}`}>{children}</button>
const Ico=({children}:{children:ReactNode})=><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-cop">{children}</div>
const Row=({icon,title,sub,onClick}:any)=><C onClick={onClick} className="flex items-center gap-3"><Ico>{icon}</Ico><div className="flex-1"><p className="text-sm font-medium">{title}</p>{sub&&<p className="text-xs opacity-70">{sub}</p>}</div><ChevronRight size={18}/></C>
const Sw=({on,set}:{on:boolean;set:()=>void})=><button role="switch" aria-checked={on} aria-label="Activar" onClick={set} className={`relative h-7 w-12 shrink-0 rounded-full transition ${on?'bg-cop':'bg-sand'}`} style={{minHeight:28}}><span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on?'left-[22px]':'left-0.5'}`}/></button>
const Inp=(p:any)=><input {...p} className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-cop"/>
const Lbl=({children}:{children:ReactNode})=><p className="mb-1 mt-3 text-xs font-medium opacity-70">{children}</p>
const Sheet=({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode})=>
 <div className="pop absolute inset-0 z-40 flex flex-col bg-cream"><div className="flex items-center gap-2 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]"><button aria-label="Volver" onClick={onClose} className="grid w-11 place-items-center"><ChevronLeft/></button><h2 className="flex-1 text-lg font-medium">{title}</h2></div><div className="flex-1 space-y-3 overflow-y-auto px-4 pb-8">{children}</div></div>

const SYMS=[['😊','Bien'],['😐','Normal'],['😣','Dolor'],['😴','Cansancio'],['🤢','Náuseas'],['😔','Cambio de ánimo']]
const TIPS=[
 ['Conoce tu método','Cada método funciona distinto',BookOpen,'Existen pastillas, parches, anillos, DIU, implantes e inyecciones. Cada uno tiene horarios, ventajas y cuidados distintos. Conocer cómo funciona el tuyo te ayuda a usarlo con confianza. Consulta a un profesional para elegir el más adecuado para ti.'],
 ['Escucha tu cuerpo','Registra cómo te sientes',HeartPulse,'Anotar tus síntomas con constancia te permite notar patrones y compartirlos con tu profesional de salud. Si algo te preocupa o es intenso, no esperes: consulta.'],
 ['Recuerda tus controles','Agenda tus citas',CalendarDays,'Los controles periódicos y la renovación a tiempo de tu método son parte del cuidado. Agrega las fechas en MiMétodo para recibir tu recordatorio.'],
 ['Resuelve tus dudas','Pregunta al asistente',Sparkles,'Tu asistente virtual puede darte información general y confiable. No reemplaza a un profesional: ante dudas médicas o urgencias, busca atención.']] as const

export default function App(){
 const [db,save,reset]=useDB()
 const [tab,setTab]=useState('home'),[sheet,setSheet]=useState<string|null>(null),[menu,setMenu]=useState(false),[toast,setToast]=useState('')
 const say=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2000)}
 const go=(s:string)=>{setMenu(false);setSheet(s)}
 const n=streak(db.tomas),hoy=db.tomas.includes(iso())
 const nav=[['home','Inicio',Home],['cal','Calendario',CalendarDays],['x','',Plus],['tips','Consejos',Lightbulb],['me','Perfil',User]] as const
 return <div className="relative mx-auto flex h-[100dvh] max-w-[430px] flex-col overflow-hidden bg-gradient-to-b from-cream to-rose shadow-2xl">
  <main className="flex-1 overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top)]">
   {tab==='home'&&<Inicio db={db} n={n} hoy={hoy} go={go} setTab={setTab}/>}
   {tab==='cal'&&<Cal db={db} save={save} n={n} go={go}/>}
   {tab==='chat'&&<Chat/>}
   {tab==='tips'&&<Tips/>}
   {tab==='me'&&<Perfil db={db} save={save} reset={()=>{if(confirm('¿Cerrar sesión y borrar los datos locales?')){reset();say('Sesión cerrada')}}} say={say}/>}
  </main>
  <nav className="absolute bottom-0 z-30 grid w-full grid-cols-5 items-end rounded-t-3xl bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_20px_rgba(168,113,79,.12)]">
   {nav.map(([id,l,I])=>id==='x'?
    <button key={id} aria-label="Agregar registro" onClick={()=>setMenu(!menu)} className="mx-auto -mt-7 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#c28a66] to-cop text-white shadow-lg transition active:scale-90"><Plus size={32} className={`transition ${menu?'rotate-45':''}`}/></button>:
    <button key={id} aria-current={tab===id} onClick={()=>setTab(id)} className={`flex flex-col items-center gap-0.5 text-[11px] ${tab===id||(id==='home'&&tab==='chat'&&false)?'font-semibold text-cop':'opacity-60'}`}><I size={22}/>{l}{tab===id&&<span className="h-1 w-1 rounded-full bg-cop"/>}</button>)}
  </nav>
  {menu&&<div className="absolute inset-0 z-20 bg-black/20" onClick={()=>setMenu(false)}><div className="pop absolute bottom-28 left-1/2 w-[85%] -translate-x-1/2 space-y-1 rounded-3xl bg-white p-3 shadow-xl" onClick={e=>e.stopPropagation()}>
   {[['sint','Registrar síntoma',HeartPulse],['camb','Registrar cambio',Repeat],['rec','Crear recordatorio',Bell],['toma','Registrar toma',Pill],['fecha','Agregar fecha importante',CalendarDays]].map(([k,l,I]:any)=><button key={k} onClick={()=>go(k)} className="flex w-full items-center gap-3 rounded-2xl px-3 text-left text-sm active:bg-sand"><I size={20} className="text-cop"/>{l}</button>)}</div></div>}
  {sheet&&<Form t={sheet} db={db} save={save} close={()=>setSheet(null)} say={say}/>}
  {toast&&<div role="status" className="pop absolute left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-cafe px-5 py-3 text-sm text-white shadow-lg"><Check size={16}/>{toast}</div>}
 </div>
}

function Inicio({db,n,hoy,go,setTab}:any){
 const Q=[['Síntomas',HeartPulse,()=>go('sint')],['Cambios',CalendarDays,()=>go('camb')],['IA',Sparkles,()=>setTab('chat')],['Educación',BookOpen,()=>setTab('tips')]] as const
 const rec=db.rec.find((r:any)=>r.on)
 return <div className="space-y-3 p-4 pb-32">
  <div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#c28a66] to-cop text-xl font-semibold text-white">Mm</div><div className="flex-1"><h1 className="text-2xl font-medium">MiMétodo</h1><p className="text-[11px] opacity-70">Tu salud, tu ritmo, tu decisión.</p></div><button aria-label="Perfil" onClick={()=>setTab('me')} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft"><User size={20}/></button></div>
  <C><p className="text-lg font-medium">¡Hola, Martina! ♡</p><p className="text-sm opacity-70">Hoy es un gran día para cuidar de ti 💕</p></C>
  <div className="up flex items-center gap-4 rounded-3xl bg-gradient-to-br from-[#c9936f] to-[#8f5c3f] p-4 text-white shadow-soft"><Flame size={44}/><div><p className="text-xs">Tu racha diaria</p><p className="text-3xl font-semibold">{n} <span className="text-sm font-normal">días seguidos usando MiMétodo</span></p></div></div>
  <Row icon={<Pill size={22}/>} title="Tu método actual" sub={db.metodo} onClick={()=>setTab('me')}/>
  <C className="flex items-center gap-3"><Ico><CalendarDays size={22}/></Ico><div className="flex-1"><p className="text-sm font-medium">Próxima toma</p><p className="text-xs opacity-70">{hoy?'Mañ':'Hoy'}{hoy?'ana':''} · {rec?.time||'--:--'} hrs</p></div><button aria-label="Registrar toma" onClick={()=>go('toma')} className="grid h-11 w-11 place-items-center rounded-full bg-sand text-cop"><Bell size={20}/></button></C>
  <div className="grid grid-cols-4 gap-2">{Q.map(([l,I,f])=><button key={l} onClick={f} className="up flex flex-col items-center gap-1 rounded-2xl bg-white/80 py-3 text-[11px] shadow-soft active:scale-95 transition"><I size={26} className="text-cop"/>{l}</button>)}</div>
  <p className="pt-4 text-center font-serif text-lg italic text-cop">Tu bienestar también es prioridad ♡</p>
 </div>
}

function Cal({db,save,n,go}:any){
 const t=new Date(),[ym,setYm]=useState([t.getFullYear(),t.getMonth()]),[sel,setSel]=useState(iso())
 const [y,m]=ym,off=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate()
 const mark=(d:string)=>db.fech.some((f:any)=>f.date===d)||db.tomas.includes(d)
 const mv=(k:number)=>{const d=new Date(y,m+k,1);setYm([d.getFullYear(),d.getMonth()])}
 const R=db.rec[0],fs=[...db.fech].sort((a:any,b:any)=>a.date.localeCompare(b.date))
 return <div className="space-y-3 p-4 pb-32">
  <h1 className="text-xl font-medium">Recordatorios</h1>
  <C><div className="mb-2 flex items-center justify-between"><button aria-label="Mes anterior" onClick={()=>mv(-1)}><ChevronLeft/></button><p className="text-sm font-medium capitalize">{new Date(y,m).toLocaleDateString('es',{month:'long',year:'numeric'})}</p><button aria-label="Mes siguiente" onClick={()=>mv(1)}><ChevronRight/></button></div>
   <div className="grid grid-cols-7 gap-y-1 text-center text-xs">{'LMMJVSD'.split('').map((d,i)=><span key={i} className="opacity-60">{d}</span>)}{Array(off).fill(0).map((_,i)=><span key={'o'+i}/>)}
    {Array.from({length:days},(_,i)=>{const d=iso(new Date(y,m,i+1)),on=d===sel;return <button key={d} aria-label={d} onClick={()=>setSel(d)} className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-sm transition ${on?'bg-cop text-white shadow-soft':d===iso()?'ring-1 ring-cop':''}`} style={{minHeight:40}}>{i+1}{mark(d)&&!on&&<span className="-mt-1 h-1 w-1 rounded-full bg-cop"/>}</button>})}</div></C>
  {R&&<C><div className="flex items-center gap-3"><Ico><Pill size={22}/></Ico><div className="flex-1"><p className="text-sm font-medium">{R.name}</p><p className="text-xs opacity-70">{R.freq} · {R.time} hrs</p></div><Sw on={R.on} set={()=>save({rec:db.rec.map((r:any,i:number)=>i?r:{...r,on:!r.on})})}/></div><p className="mt-3 rounded-2xl bg-rose p-3 text-xs">¡No lo olvides! Tu constancia es parte de tu bienestar. 💕</p></C>}
  <C className="flex items-center gap-3"><Ico><Flame size={22}/></Ico><div><p className="text-xs">Tu racha diaria</p><p className="text-xl font-semibold">{n} días</p><div className="flex gap-1">{Array.from({length:6},(_,i)=><Flame key={i} size={16} className={i<n?'text-cop':'text-sand'}/>)}</div></div></C>
  <C><div className="mb-2 flex items-center justify-between"><p className="text-sm font-medium">{sel===iso()?'Hoy':sel}: próximas fechas</p><button aria-label="Agregar fecha" onClick={()=>go('fecha')} className="grid h-9 w-9 place-items-center rounded-full bg-sand text-cop" style={{minHeight:36}}><Plus size={18}/></button></div>
   {fs.length?fs.map((f:any)=><div key={f.id} className="flex items-center gap-2 border-t border-sand py-2 text-sm"><CalendarDays size={16} className="text-cop"/><div className="flex-1"><p>{f.name}</p><p className="text-xs opacity-70">{new Date(f.date+'T12:00').toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'})}{f.time&&` · ${f.time} hrs`}</p></div><button aria-label="Eliminar" onClick={()=>save({fech:db.fech.filter((x:any)=>x.id!==f.id)})} style={{minHeight:32}}><X size={16}/></button></div>):<p className="text-xs opacity-70">Aún no hay fechas.</p>}</C>
 </div>
}

function Chat(){
 const hi='¡Hola, Martina! ✨\n\nSoy tu asistente virtual de MiMétodo. Estoy aquí para responder tus dudas, entregarte información confiable y acompañarte en todo tu proceso.\n\n¿Qué te gustaría saber hoy?'
 const [ms,setMs]=useState<{role:string;content:string}[]>([]),[txt,setTxt]=useState(''),[load,setLoad]=useState(false),[err,setErr]=useState(''),last=useRef(''),end=useRef<HTMLDivElement>(null)
 useEffect(()=>{end.current?.scrollIntoView({behavior:'smooth'})},[ms,load,err])
 const send=async(q:string,retry=false)=>{q=q.trim();if(!q||load)return;setErr('');setTxt('');last.current=q
  const hist=ms;if(!retry)setMs(h=>[...h,{role:'user',content:q}]);setLoad(true)
  try{const r=await chatApi(q,hist);setMs(h=>[...h,{role:'assistant',content:r}])}catch(e:any){setErr(e.message==='error'||!e.message?'No pudimos conectar con el asistente. Inténtalo nuevamente.':e.message)}setLoad(false)}
 const Q=['¿Es normal tener cambios de ánimo?','¿Cuándo debo tomar mi pastilla?','¿Qué hacer si olvido una dosis?','Información sobre otros métodos']
 const B=({r,c}:any)=><div className={`up max-w-[85%] whitespace-pre-wrap rounded-3xl p-4 text-sm shadow-soft ${r==='user'?'ml-auto bg-cop text-white':'bg-white'}`}>{c}</div>
 return <div className="flex h-full flex-col"><h1 className="flex items-center justify-center gap-2 py-3 text-base font-medium"><Sparkles size={18} className="text-cop"/>Asistente virtual</h1>
  <div className="flex-1 space-y-3 overflow-y-auto px-4"><div className="flex items-start gap-2"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand text-2xl">👩</div><B r="a" c={hi}/></div>
   {!ms.length&&Q.map(q=><button key={q} onClick={()=>send(q)} className="up flex w-full items-center justify-between rounded-full bg-white/80 px-4 text-left text-sm shadow-soft">{q}<ChevronRight size={16}/></button>)}
   {ms.map((m,i)=><B key={i} r={m.role} c={m.content}/>)}
   {load&&<p className="text-xs italic opacity-70">MiMétodo está escribiendo...</p>}
   {err&&<C><p className="text-sm">{err.startsWith('Falta')?err:'Lo siento, no pude responder en este momento. Inténtalo nuevamente.'}</p><div className="mt-2"><Btn onClick={()=>send(last.current,true)}>Intentar nuevamente</Btn></div></C>}<div ref={end}/></div>
  <div className="flex items-center gap-2 px-4 pb-28 pt-2"><div className="flex flex-1 items-center rounded-full bg-white px-4 shadow-soft"><input aria-label="Escribe tu duda" value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(txt)} placeholder="Escribe tu duda aquí..." className="h-12 w-full bg-transparent text-sm outline-none"/></div><button aria-label="Enviar" disabled={load} onClick={()=>send(txt)} className="grid h-12 w-12 place-items-center rounded-full bg-cop text-white disabled:opacity-50"><Send size={18}/></button></div></div>
}

function Tips(){
 const [o,setO]=useState<number|null>(null)
 return <div className="space-y-3 p-4 pb-32"><h1 className="text-xl font-medium">Consejos</h1>
  {TIPS.map(([t,d,I],i)=><Row key={t} icon={<I size={22}/>} title={t} sub={d} onClick={()=>setO(i)}/>)}
  {o!==null&&<Sheet title={TIPS[o][0]} onClose={()=>setO(null)}><C><p className="text-sm leading-relaxed">{TIPS[o][3]}</p></C></Sheet>}</div>
}

function Perfil({db,save,reset,say}:any){
 const [p,setP]=useState<string|null>(null)
 const L=[['metodo','Mi método',Pill],['rec','Mis recordatorios',Bell],['sint','Mis síntomas',HeartPulse],['camb','Mis cambios',Repeat],['pref','Mis preferencias',SlidersHorizontal],['priv','Privacidad',Shield],['notif','Notificaciones',Bell],['conf','Configuración',Settings]] as const
 const hist=(a:any[],f:(x:any)=>string)=>a.length?[...a].reverse().map((x,i)=><C key={i}><p className="text-sm">{f(x)}</p>{x.note&&<p className="text-xs opacity-70">{x.note}</p>}</C>):<p className="text-sm opacity-70">Aún no hay registros.</p>
 const info:any={pref:'Idioma: español. Tus datos se guardan solo en este dispositivo.',priv:'MiMétodo guarda tus registros únicamente en tu teléfono (localStorage). Los mensajes del chat se envían a tu servidor y al modelo de IA solo para generar la respuesta.',notif:'Los recordatorios se muestran dentro de la app. Las notificaciones push llegarán en una próxima versión.',conf:'MiMétodo v1.0 · Instálala desde el menú del navegador con "Agregar a pantalla de inicio".'}
 return <div className="space-y-3 p-4 pb-32"><h1 className="text-xl font-medium">Mi perfil</h1>
  <div className="flex flex-col items-center py-2"><div className="grid h-20 w-20 place-items-center rounded-full bg-sand text-4xl">👩</div><p className="mt-2 text-lg font-medium">Martina</p></div>
  {L.map(([k,l,I])=><Row key={k} icon={<I size={20}/>} title={l} onClick={()=>setP(k)}/>)}
  <Row icon={<LogOut size={20}/>} title="Cerrar sesión" onClick={reset}/>
  {p&&<Sheet title={L.find(x=>x[0]===p)![1]} onClose={()=>setP(null)}>
   {p==='metodo'&&['Pastillas anticonceptivas','Parche','Anillo vaginal','DIU','Implante','Inyección','Preservativo','Otro'].map(x=><button key={x} onClick={()=>{save({metodo:x});say('Método actualizado')}} className={`flex w-full items-center justify-between rounded-2xl px-4 text-sm ${db.metodo===x?'bg-cop text-white':'bg-white'}`}>{x}{db.metodo===x&&<Check size={16}/>}</button>)}
   {p==='rec'&&(db.rec.length?db.rec.map((r:any)=><C key={r.id} className="flex items-center gap-3"><div className="flex-1"><p className="text-sm font-medium">{r.name}</p><p className="text-xs opacity-70">{r.time} · {r.freq}</p></div><Sw on={r.on} set={()=>save({rec:db.rec.map((x:any)=>x.id===r.id?{...x,on:!x.on}:x)})}/><button aria-label="Eliminar" onClick={()=>save({rec:db.rec.filter((x:any)=>x.id!==r.id)})}><X size={16}/></button></C>):<p className="text-sm opacity-70">Sin recordatorios.</p>)}
   {p==='sint'&&hist(db.sint,x=>`${x.date} · ${x.items.join(', ')}`)}
   {p==='camb'&&hist(db.camb,x=>`${x.date} · ${x.kind}`)}
   {info[p]&&<C><p className="text-sm">{info[p]}</p></C>}</Sheet>}</div>
}

function Form({t,db,save,close,say}:{t:string;db:DB;save:(p:Partial<DB>)=>void;close:()=>void;say:(m:string)=>void}){
 const [f,setF]=useState<any>({date:iso(),time:t==='fecha'?'':'21:00',sel:[] as string[],note:'',name:'',freq:'Todos los días',kind:'Cambio de método'})
 const s=(k:string,v:any)=>setF((o:any)=>({...o,[k]:v})),id=Date.now()
 const done=(p:Partial<DB>,m:string)=>{save(p);say(m);close()}
 const T:any={sint:'Registrar síntoma',camb:'Registrar cambio',toma:'Registrar toma',rec:'Crear recordatorio',fecha:'Agregar fecha importante'}
 const Date_=<><Lbl>Fecha</Lbl><Inp type="date" value={f.date} onChange={(e:any)=>s('date',e.target.value)}/></>
 const Note=<><Lbl>{t==='sint'?'¿Quieres agregar algún comentario?':'Nota o comentario'}</Lbl><textarea value={f.note} onChange={e=>s('note',e.target.value)} rows={3} className="w-full rounded-2xl border border-sand bg-white p-3 text-sm outline-none focus:border-cop"/></>
 return <Sheet title={T[t]} onClose={close}>
  {t==='sint'&&<><div className="grid grid-cols-2 gap-2">{SYMS.map(([e,l])=>{const on=f.sel.includes(l);return <button key={l} aria-pressed={on} onClick={()=>s('sel',on?f.sel.filter((x:string)=>x!==l):[...f.sel,l])} className={`flex items-center gap-2 rounded-2xl px-3 text-sm transition ${on?'bg-cop text-white shadow-soft':'bg-white'}`}><span className="text-xl">{e}</span>{l}{on&&<Check size={14} className="ml-auto"/>}</button>})}</div>{Note}<Btn onClick={()=>f.sel.length?done({sint:[...db.sint,{id,date:iso(),items:f.sel,note:f.note}]},'Síntoma guardado'):say('Elige al menos una opción')}>Guardar registro</Btn></>}
  {t==='camb'&&<>{['Cambio de método','Cambio de horario','Inicio de método','Suspensión de método','Otro'].map(k=><button key={k} onClick={()=>s('kind',k)} className={`flex w-full items-center justify-between rounded-2xl px-4 text-sm ${f.kind===k?'bg-cop text-white':'bg-white'}`}>{k}{f.kind===k&&<Check size={16}/>}</button>)}{Date_}{Note}<Btn onClick={()=>done({camb:[...db.camb,{id,date:f.date,kind:f.kind,note:f.note}]},'Cambio guardado')}>Guardar registro</Btn></>}
  {t==='toma'&&<><p className="py-2 text-center text-lg font-medium">¿Tomaste tu método hoy?</p><Lbl>Hora</Lbl><Inp type="time" value={f.time} onChange={(e:any)=>s('time',e.target.value)}/><div className="space-y-2 pt-3"><Btn onClick={()=>done({tomas:[...new Set([...db.tomas,iso()])],horas:{...db.horas,[iso()]:f.time}},'¡Toma registrada! 💕')}>Sí, registrar toma</Btn><Btn ghost onClick={()=>{say('Está bien, ¡no lo olvides mañana!');close()}}>No</Btn></div></>}
  {t==='rec'&&<><Lbl>Nombre</Lbl><Inp value={f.name} placeholder="Pastilla anticonceptiva" onChange={(e:any)=>s('name',e.target.value)}/><Lbl>Hora</Lbl><Inp type="time" value={f.time} onChange={(e:any)=>s('time',e.target.value)}/>{Date_}<Lbl>Frecuencia</Lbl><select value={f.freq} onChange={e=>s('freq',e.target.value)} className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm">{['Todos los días','Una vez','Cada semana','Cada mes'].map(x=><option key={x}>{x}</option>)}</select><div className="pt-3"><Btn onClick={()=>f.name.trim()?done({rec:[...db.rec,{id,name:f.name,time:f.time,date:f.date,freq:f.freq,on:true}]},'Recordatorio creado'):say('Escribe un nombre')}>Guardar recordatorio</Btn></div></>}
  {t==='fecha'&&<><Lbl>Tipo</Lbl><div className="flex flex-wrap gap-2">{['Control médico','Renovación del método','Consulta','Otra fecha'].map(x=><button key={x} onClick={()=>s('name',x)} className={`rounded-full px-4 text-xs ${f.name===x?'bg-cop text-white':'bg-white'}`}>{x}</button>)}</div><Inp value={f.name} placeholder="Nombre" onChange={(e:any)=>s('name',e.target.value)}/>{Date_}<Lbl>Hora (opcional)</Lbl><Inp type="time" value={f.time} onChange={(e:any)=>s('time',e.target.value)}/>{Note}<Btn onClick={()=>f.name.trim()?done({fech:[...db.fech,{id,name:f.name,date:f.date,time:f.time,note:f.note}]},'Fecha agregada'):say('Escribe un nombre')}>Guardar fecha</Btn></>}
 </Sheet>
}
