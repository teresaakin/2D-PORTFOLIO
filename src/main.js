import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39, // 624(total length from x axis then divide by number of parts (16) to get 39)
    sliceY: 31,
    anims: {
        "idle-down": 944,
        "walk-down": { from: 944 , to: 947 , loop: true, speed: 8 },
        "idle-side": 983,
        "walk-side": { from: 983, to: 986, loop: true, speed: 8 },
        "idle-up": 1022,
        "walk-up": { from: 1022, to: 1025, loop: true, speed: 8 },
    },

});

// loading the map
k.loadSprite("map", "./map.png");

// background color of the game
k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json() // get json file data (get comfy w js functions)
    const layers = mapData.layers; // just to make it cleaner do not need an object?

    // creating our first game object (contains dif compenents like sprites, area etc)--the map
    const map = k.add([ //changes from k.make to k.add to get the map
        k.sprite("map"),
        k.pos(0), // positioned at the origin 
        k.scale(scaleFactor) // pixel art is tiny so scaling it up(?) by 4
    ])

    const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}), // specify default animation
        k.area({
            shape: new k.Rect(k.vec2(0,3), 10, 10) //creates shape roughly same as sprite the hit box -- 10 is smaller than the sprite length and width (16x16)
        }),
        k.body(), // a component makes our player a tangible physics object that can be colided with
        k.anchor("center"), // makes coordinates dead centered (the origin) ? play w it
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false, // when the dialogue textbox is showing, u can only click the close button
        },
        "player", // player tag when want to check for collisions (?might not need this) used to identify game object
    ]);

    // this loop is helping us set up the boundaries of the whole project
    for (const layer of layers) {
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height), // the rectangle defines the area the boundary occupies
                    }),
                    k.body({ isStatic: true }), // makes sure that the player will not be able to overlap project
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);

                if (boundary.name) {
                    // this is a function that gets executed when the collision happens.
                    // it's like saying, "When the player hits this boundary, do the following things"
                    player.onCollide(boundary.name, () => { // ?
                        player.isInDialogue = true; // this line changes a property of the player object's isInDialogue to true
                        displayDialogue(dialogueData[boundary.name],
                             () => player.isInDialogue = false) // player can move again

                    });
                }
            }
            continue;
        }

        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k)

    k.onResize(() => {
        setCamScale(k);
    });

    k.onUpdate(() => {
        k.camPos(player.worldPos().x, player.worldPos().y - 100);
    });

    k.onMouseDown((mouseBtn) => { //mouseBtn considered tap on mobile
        if (mouseBtn !== "left" || player.isInDialogue) return;

        const worldMousePos = k.toWorld(k.mousePos()); // ?
        player.moveTo(worldMousePos, player.speed);

        // to get correct positioning of spawn when moving like left right etc
        const mouseAngle = player.pos.angle(worldMousePos)

        const lowerBound = 50 // 
        const upperBound = 125; // 

        //

        if (
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        }


        if (
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
        ) {
            player.play("walk-down");
            player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }


        if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
        }

        // understand these conditions !!!

    });

    

    k.onMouseRelease(() => {
        if(player.direction === "down") {
            player.play("idle-down");
            return;
        }
        if (player.direction === "up") {
            player.play("idle-up");
            return;
        }

        player.play("idle-side");
    })
});

k.go("main");