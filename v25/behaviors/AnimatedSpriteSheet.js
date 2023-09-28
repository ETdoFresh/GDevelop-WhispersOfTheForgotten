import { GDevelopBehavior } from './GDevelopBehavior.js'

export class AnimatedSpriteSheet extends GDevelopBehavior {
    spriteSheetJSON;
    spriteSheet;

    onCreated() {
        try {
            this.spriteSheetJSON = this._behaviorData.SpriteSheetJSON;
            if (this.spriteSheetJSON.startsWith('http')) {
                fetch(this.spriteSheetJSON)
                    .then(response => response.json())
                    .then(json => this.spriteSheet = json);
            } else if (this.spriteSheetJSON.startsWith('{')) {
                this.spriteSheet = JSON.parse(this.spriteSheetJSON);
            } else {
                this.spriteSheet = this.runtimeScene.getGame().getJsonManager().getLoadedJson(this.spriteSheetJSON);
            }

            const spriteSheetFrame = this._getAnimationByName("SpriteSheet").directions[0].frames[0];
            const startingAnimationIndex = this._object._animations.length;
            const animationNames = []
            const frameNames = {}
            const frameDatas = {}

            if (!this.spriteSheet.animations) {
                this.spriteSheet.animations = {};
                this.spriteSheet.animations["all"] = [];
                for (const frameName in this.spriteSheet.frames) {
                    this.spriteSheet.animations["all"].push(frameName);
                }
            }

            for (const animationName in this.spriteSheet.animations) {
                animationNames.push(animationName);
                const animation = this.spriteSheet.animations[animationName];
                const imageManager = this.runtimeScene.getGame().getImageManager();
                let spriteFrameDataArray = [];

                for (const frameIndex in animation) {
                    const frameName = animation[frameIndex];
                    const frameData = this.spriteSheet.frames[frameName];
                    const frame = frameData.frame;
                    const rotated = frameData.rotated;
                    const ss = frameData.sourceSize;
                    const sss = frameData.spriteSourceSize;
                    const trimmed = frameData.trimmed;
                    frameNames[animationName] = frameNames[animationName] || [];
                    frameNames[animationName].push(frameName);
                    frameDatas[animationName] = frameDatas[animationName] || [];
                    frameDatas[animationName].push(frameData);

                    const spriteFrameData = {
                        centerPoint: { x: ss.w / 2, y: ss.h / 2 },
                        hasCustomCollisionMask: true,
                        customCollisionMask: spriteSheetFrame.customHitBoxes,
                        image: spriteSheetFrame.image,
                        originPoint: { x: 0, y: 0 },
                        points: spriteSheetFrame.points,
                    }
                    const spriteAnimationFrame = new gdjs.SpriteAnimationFrame(imageManager, spriteFrameData);
                    spriteFrameDataArray.push(spriteFrameData);
                }

                const spriteDirectionData = { looping: true, sprites: spriteFrameDataArray, timeBetweenFrames: 0.08 };
                const spriteAnimationDirection = new gdjs.SpriteAnimationDirection(imageManager, spriteDirectionData);
                const spriteAnimationData = { directions: [spriteDirectionData], name: animationName, useMultipleDirections: false };
                const spriteAnimation = new gdjs.SpriteAnimation(imageManager, spriteAnimationData);
                this._object._animations.push(spriteAnimation);
            }

            const endingAnimationIndex = this._object._animations.length;
            for (let i = startingAnimationIndex; i < endingAnimationIndex; i++) {
                const animationName = animationNames[i - startingAnimationIndex];
                const frameNamesArray = frameNames[animationName];
                const frameDatasArray = frameDatas[animationName];
                const animation = this._object._animations[i];
                const animationDirection = animation.directions[0];
                const animationFrames = animationDirection.frames;
                for (let j = 0; j < frameNamesArray.length; j++) {
                    const frame = frameDatasArray[j].frame;
                    const ss = frameDatasArray[j].sourceSize;
                    const sss = frameDatasArray[j].spriteSourceSize;
                    animationFrames[j].image = frameNamesArray[j];
                    const rotate = frameDatasArray[j].rotated;
                    if (!rotate) {
                    const frameRect = new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h);
                    const origRect = new PIXI.Rectangle(0, 0, ss.w, ss.h);
                    const centerX = ss.w / 2;
                    const anchorX = centerX / frame.w * ss.w;
                    const centerY = ss.h / 2;
                    const anchorY = centerY / frame.h * ss.h;
                    const trimRect = new PIXI.Rectangle(anchorX + sss.x - ss.w / 2, anchorY + sss.y - ss.h / 2, sss.w, sss.h);
                    animationFrames[j].texture = new PIXI.Texture(spriteSheetFrame.texture.baseTexture, frameRect, origRect, trimRect);
                    }
                    else {
                        const frameRect = new PIXI.Rectangle(frame.x, frame.y, frame.h, frame.w);
                        const origRect = new PIXI.Rectangle(0, 0, ss.w, ss.h);
                        const centerX = ss.w / 2;
                        const anchorX = centerX / frame.w * ss.w;
                        const centerY = ss.h / 2;
                        const anchorY = centerY / frame.h * ss.h;
                        const trimRect = new PIXI.Rectangle(anchorY + sss.x - ss.h / 2, anchorX + sss.y - ss.w / 2, sss.w, sss.h);
                        animationFrames[j].texture = new PIXI.Texture(spriteSheetFrame.texture.baseTexture, frameRect, origRect, trimRect);
                        animationFrames[j].texture.rotate = rotate ? 2 : 0;
                    }
                }

                for (let j = 0; j < frameNamesArray.length; j++) {
                    animationFrames[j].hasCustomHitBoxes = true;
                    animationFrames[j].customHitBoxes = spriteSheetFrame.customHitBoxes;
                    animationFrames[j].points = spriteSheetFrame.points;
                }
            }

            if (this._behaviorData.InitialAnimationName) {
                this._object.setAnimationName(this._behaviorData.InitialAnimationName);
            }
        } 
        catch (e) { console.error(e); }
    }

    _getAnimationByName(name) {
        for (const animation of this._object._animations) {
            if (animation.name === name) return animation;
        }
        return null;
    }
}