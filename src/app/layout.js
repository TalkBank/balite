import { Kanit, Outfit, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Auth from "./auth.js";
import { cookies } from 'next/headers';


import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;


const robono = Roboto_Mono({
    variable: "--font-robono",
    subsets: ["latin"]
});


const kanit = Kanit({
    variable: "--font-kanit",
    weight: ["700"],
    subsets: ["latin"]
});

const work = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"]
});


export const metadata = {
    title: "balite",
    description: "language sample analysis, now online ",
};

export default async function RootLayout({ children }) {
    const store = await cookies();
    const cookie = store.get("talkbank");

    const data = process.env.NODE_ENV === 'development' 
          ? { auth: true }
          : await (await fetch('https://sla2.talkbank.org/sessionHasAuth', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Cookie': `talkbank=${cookie ? cookie.value : ""}`
              },
              body: JSON.stringify({rootName: 'data', path: 'whisper'})
          })).json();


    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=refresh" />
            </head>
            <body
                className={`${robono.variable} ${kanit.variable} ${work.variable} antialiased`}
            >
                <div id="center">
                    {data.auth ? 
                     <div>
                         <div id="ui-container">
                             {children}
                         </div>
                         <div id="wordmark-box">
                             <h1>The TalkBank System <span style={{fontWeight: 200}}>|</span> <span id="wordmark-mark">Batchalign</span></h1>
                         </div>
                     </div>
                     : <div id="ui-container"><Auth state={data}/></div>}
                </div>
            </body>
        </html>
    );
}
