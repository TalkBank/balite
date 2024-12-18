import { Kanit, Outfit, Roboto_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=refresh" />
            </head>
            <body
                className={`${robono.variable} ${kanit.variable} ${work.variable} antialiased`}
            >
                <div id="center">
                    <div>
                        <div id="ui-container">
                            {children}
                        </div>
                        <div id="wordmark-box">
                            <h1>The TalkBank System <span style={{fontWeight: 200}}>|</span> <span id="wordmark-mark">Batchalign</span></h1>
                            {/* <span id="wordmark-box-version">Batchalign Lite (online version)</span> */}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
