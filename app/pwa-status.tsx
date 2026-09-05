'use client';
import {useEffect,useRef,useState} from 'react';
export default function PwaStatus(){
 const [status,setStatus]=useState('');const [waiting,setWaiting]=useState<ServiceWorker|null>(null);const updating=useRef(false);
 useEffect(()=>{
  if(!window.isSecureContext){setStatus('Офлайн-установка доступна по HTTPS');return;}
  if(!('serviceWorker' in navigator)){setStatus('Этот браузер не поддерживает офлайн-режим');return;}
  let disposed=false;const cleanups:(()=>void)[]=[];
  const report=(text:string)=>{if(!disposed)setStatus(text);};
  const controllerChange=()=>{if(updating.current)window.location.reload();};
  navigator.serviceWorker.addEventListener('controllerchange',controllerChange);
  report('Сохраняем игру для офлайн-режима…');
  navigator.serviceWorker.register(new URL('sw.js',new URL(document.querySelector<HTMLLinkElement>('link[rel=manifest]')?.href||'manifest.webmanifest',location.href)).href,{updateViaCache:'none'}).then(reg=>{
   if(disposed)return;
   if(reg.waiting)setWaiting(reg.waiting);
   const watch=()=>{const worker=reg.installing;if(!worker)return;const change=()=>{if(disposed)return;if(worker.state==='installed'&&reg.active&&reg.waiting)setWaiting(reg.waiting);if(worker.state==='redundant'&&!reg.active)report('Не удалось сохранить игру. Обнови страницу при подключении к сети.');};worker.addEventListener('statechange',change);cleanups.push(()=>worker.removeEventListener('statechange',change));};
   reg.addEventListener('updatefound',watch);cleanups.push(()=>reg.removeEventListener('updatefound',watch));watch();
   navigator.serviceWorker.ready.then(()=>report('Готово к игре без интернета'));
  }).catch(()=>report('Офлайн-режим не сохранён. Обнови страницу при подключении к сети.'));
  return()=>{disposed=true;cleanups.forEach(fn=>fn());navigator.serviceWorker.removeEventListener('controllerchange',controllerChange);};
 },[]);
 return <div className="pwa-status" role="status">{waiting?<button onClick={()=>{updating.current=true;setStatus('Обновляем игру…');waiting.postMessage({type:'ACTIVATE_UPDATE'});setWaiting(null);}}>Доступна новая версия · Обновить</button>:status}</div>;
}
