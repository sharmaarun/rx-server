import "reflect-metadata"
import ReactDOM from "react-dom"
import React from "react"
import App from "./pages/_app";
import { bootstrap } from "@reactive/client"

bootstrap()

ReactDOM.render(<App />, document.getElementById("root"))
const module_ = module as any
if (module_.hot) {
    module_.hot.accept('./pages/_app', () => {
        console.log("hot updated...")
        const NextRootContainer = require('./pages/_app').default;
        ReactDOM.render(<NextRootContainer />, document.getElementById('root'));
    })
}