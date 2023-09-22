export class GDevelopScene {
    static scenes = {};

    static onSceneLoaded(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) {
            this.scenes[sceneName] = new this();
        }
        if (this.scenes[sceneName].onSceneLoaded)
            this.scenes[sceneName].onSceneLoaded(runtimeScene, eventsFunctionContext);
    }

    static onScenePreEvents(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) return;
        if (this.scenes[sceneName].onScenePreEvents)
            this.scenes[sceneName].onScenePreEvents(runtimeScene, eventsFunctionContext);
    }

    static onScenePostEvents(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) return;
        if (this.scenes[sceneName].onScenePostEvents)
            this.scenes[sceneName].onScenePostEvents(runtimeScene, eventsFunctionContext);
    }

    static onScenePaused(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) return;
        if (this.scenes[sceneName].onScenePaused)
            this.scenes[sceneName].onScenePaused(runtimeScene, eventsFunctionContext);
    }

    static onSceneResumed(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) return;
        if (this.scenes[sceneName].onSceneResumed)
            this.scenes[sceneName].onSceneResumed(runtimeScene, eventsFunctionContext);
    }

    static onSceneUnloading(runtimeScene, eventsFunctionContext) {
        const sceneName = runtimeScene.getName();
        if (!this.scenes[sceneName]) return;
        if (this.scenes[sceneName].onSceneUnloading)
            this.scenes[sceneName].onSceneUnloading(runtimeScene, eventsFunctionContext);
    }

    // --------------------------------------------------

    constructor() { }
}