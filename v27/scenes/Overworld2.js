import { GDevelopScene } from './GDevelopScene.js';

export class Overworld2 extends GDevelopScene {
    onSceneLoaded(runtimeScene, eventsFunctionContext) {
        gdjs.evtTools.camera.setCameraZoom(runtimeScene, 1, "");
        gdjs.evtTools.camera.setCameraZoom(runtimeScene, 1, "Map");

        runtimeScene.getObjects("Transition").forEach(object => {
            const flashTransitionPainter = object.getBehavior("FlashTransitionPainter");
            const color = "0;0;0";
            const timerInSeconds = 0.5;
            const type = "Circular";
            const direction = "Backward";
            const maxOpacity = 0;
            flashTransitionPainter.PaintEffect(color, timerInSeconds, type, direction, maxOpacity, runtimeScene);
        });

        runtimeScene.getObjects("NPC_2").forEach(object => {
            object.getBehavior("JSONSpriteSheetAnimator").PlayAnimation("Walking_S", runtimeScene);
        });

        gdjs.dialogueTree.loadFromJsonFile(runtimeScene, "assets/npcs.json");

        gdjs.dialogueTree.startFrom("Introduction");
    }

    onScenePreEvents(runtimeScene, eventsFunctionContext) {
        if (!gdjs.evtTools.systemInfo.hasTouchScreen()) {
            if (this._objectGroups && this._objectGroups["TouchControls"]) {
                this._objectGroups["TouchControls"].forEach(object => {
                    object.deleteFromScene(runtimeScene);
                });
            }
        }

        gdjs.evtTools.camera.centerCamera(runtimeScene, runtimeScene.getObjects("Amy")[0], false, "");
        gdjs.evtTools.camera.centerCamera(runtimeScene, runtimeScene.getObjects("Amy")[0], false, "Map");

        runtimeScene.getObjects("AmyDebug").forEach(object => {
            const amy = runtimeScene.getObjects("Amy")[0];
            const distance = 35;
            const degrees = -90;
            object.putAroundObject(amy, distance, degrees);
        });

        runtimeScene.getObjects("AmyDebug").forEach(object => {
            const amy = runtimeScene.getObjects("Amy")[0];
            const characterState = amy.getBehavior("CharacterState");
            const state = characterState.getState(runtimeScene);
            const direction = characterState.getDirection(runtimeScene);
            const topDownMovement = amy.getBehavior("TopDownMovement");
            const angle = topDownMovement.getAngle(runtimeScene);
            object.setString(`${state}_${direction}\n${angle}`);
        });

        runtimeScene.getObjects("Amy").forEach(object => {
            const collidables = this._objectGroups?.Collidable || [];
            const ignoreTouchingEdges = false;
            object.separateFromObjects(collidables, ignoreTouchingEdges);
        });

        const objectsToAlign = Hashtable.newFrom({Object: runtimeScene.getObjects("TargetRoundButton")})
        gdjs.evtsExt__AlignObject__ToSceneRight.func(runtimeScene, objectsToAlign, eventsFunctionContext);

        runtimeScene.getObjects("Shadow").forEach(object => {
            const amy = runtimeScene.getObjects("Amy")[0];
            const groundX = amy.getPointX("Ground");
            const groundY = amy.getPointY("Ground");
            object.setCenterPositionInScene(groundX, groundY);
        });
    }
}