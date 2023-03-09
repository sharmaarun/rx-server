import "reflect-metadata";
//---
import { bootstrap } from "@reactive/client";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/_app";
import { registerCoreAttributeTypes } from "./utils";

// Initialize the app
bootstrap()

// Register all the basic attribute types
registerCoreAttributeTypes()


// Render the app
setTimeout(() => {
    ReactDOM.render(
        <App />
        , document.getElementById("root"))
    const module_ = module as any
    if (module_.hot) {
        module_.hot.accept('./pages/_app', () => {
            const NextRootContainer = require('./pages/_app').default;
            ReactDOM.render(<NextRootContainer />, document.getElementById('root'));
        })
    }
}, 100)