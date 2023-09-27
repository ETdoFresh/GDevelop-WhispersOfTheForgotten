export class GDevelopBehavior {
    static objects = [];
    static behaviors = [];
    static behaviorScripts = [];

    static onCreated(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            if (this.objects.includes(object) && this.behaviors.includes(behavior)) return;
            const behaviorScript = new this(object, behavior);
            this.objects.push(object);
            this.behaviors.push(behavior);
            this.behaviorScripts.push(behaviorScript);
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onCreated)
                behaviorScript.onCreated();
        });
    }

    static onActivate(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onActivate)
                behaviorScript.onActivate();
        });
    }

    static onDeActivate(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onDeActivate)
                behaviorScript.onDeActivate();
        });
    }

    static doStepPreEvents(runtimeScene, eventsFunctionContext) {
        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.doStepPreEvents)
                behaviorScript.doStepPreEvents(delta);
        });
    }

    static doStepPostEvents(runtimeScene, eventsFunctionContext) {
        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.doStepPostEvents)
                behaviorScript.doStepPostEvents(delta);
        });
    }

    static onDestroy(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            this.objects.splice(index, 1);
            this.behaviors.splice(index, 1);
            this.behaviorScripts.splice(index, 1);
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onDestroy)
                behaviorScript.onDestroy();
        });
    }

    static exec(runtimeScene, eventsFunctionContext, func, ...args) {
        let value = null;
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            if (value !== null) return;
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript[func])
                value = behaviorScript[func](...args);
        });
        return value;
    }

    static property(runtimeScene, eventsFunctionContext, property) {
        let value = null;
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            if (value !== null) return;
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            value = behaviorScript[property];
        });
        return value;
    }

    // --------------------------------------------------

    get ObjectX() { return this._object.getX(); }
    set ObjectX(value) { this._object.setX(value); }
    get ObjectY() { return this._object.getY(); }
    set ObjectY(value) { this._object.setY(value); }
    get ObjectAngle() { return this._object.getAngle(); }
    set ObjectAngle(value) { this._object.setAngle(value); }
    get Name() { return this._object.getName(); }
    get ObjectCenterX() { return this._object.getPoint ? this._object.getPoint("Center").getX() : this._object.getCenterX ? this.ObjectX + this._object.getCenterX() : undefined; }
    get ObjectCenterY() { return this._object.getPoint ? this._object.getPoint("Center").getY() : this._object.getCenterY ? this.ObjectY + this._object.getCenterY() : undefined; }
    get ObjectGroundX() { return this._object.getPoint ? this._object.getPoint("Ground").getX() : undefined; }
    get ObjectGroundY() { return this._object.getPoint ? this._object.getPoint("Ground").getY() : undefined; }
    get ObjectWidth() { return this._object.getWidth(); }
    get ObjectHeight() { return this._object.getHeight(); }

    constructor(object, behavior) {
        this._object = object;
        this._behavior = behavior;
        this._behaviorData = behavior._behaviorData;
        this._behaviorData.GDevelopBehavior = this;
    }

    getBehavior(behaviorName) {
        return this._object.getBehavior(behaviorName);
    }

    findObjectsOfType(behaviorName) {
        const allInstances = this.runtimeScene._allInstancesList;
        const instancesWithBehavior = allInstances.filter(instance => instance.getBehavior(behaviorName));
        return instancesWithBehavior.map(instance => instance.getBehavior(behaviorName)._behaviorData.GDevelopBehavior);
    }

    getDistanceTo(other) {
        const thisX = this.ObjectGroundX !== undefined ? this.ObjectGroundX : this.ObjectCenterX !== undefined ? this.ObjectCenterX : this.ObjectX;
        const thisY = this.ObjectGroundY !== undefined ? this.ObjectGroundY : this.ObjectCenterY !== undefined ? this.ObjectCenterY : this.ObjectY;
        const otherX = other.ObjectGroundX !== undefined ? other.ObjectGroundX : other.ObjectCenterX !== undefined ? other.ObjectCenterX : other.ObjectX;
        const otherY = other.ObjectGroundY !== undefined ? other.ObjectGroundY : other.ObjectCenterY !== undefined ? other.ObjectCenterY : other.ObjectY;
        return Math.sqrt(Math.pow(thisX - otherX, 2) + Math.pow(thisY - otherY, 2));
    }
}