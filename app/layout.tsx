import type { Metadata } from 'next';
import './globals.css';
const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
export const metadata:Metadata={title:'Block Turn — всё в твоих поворотах',description:'Блоковая головоломка: вращай фигуры касанием, собирай линии и побей свой рекорд.',manifest:`${base}/manifest.webmanifest`,appleWebApp:{capable:true,title:'Block Turn',statusBarStyle:'default'},icons:{icon:`${base}/icon-192.png`,apple:`${base}/apple-touch-icon.png`}};
export const viewport={width:'device-width',initialScale:1,themeColor:'#10131d'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>;}
