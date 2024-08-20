import kaboom from "kaboom";

export const k = kaboom({
    global: false, 
    touchToMouse: true, // for movement on mobile without cursor
    canvas: document.getElementById("game"), // via index.html file remember?
});