import { GDevelopBehavior } from "./GDevelopBehavior.js";


export class CharacterAnimator extends GDevelopBehavior {
    doStepPreEvents(delta) {
        if (!this.state) this.state = this.getBehavior("CharacterState");
        if (!this.state) return;
        if (!this.stateData) this.stateData = this.state._behaviorData;
        if (!this.stateData) return;

        if (this.state.IsNewCharacterState() || this.state.IsNewCharacterDirection()) {
            const state = this.stateData.CurrentState;
            const direction = this.stateData.CurrentDirection;
            const animationName = `${state}_${direction}`;
            this._object.setAnimationName(animationName);
        }
    }
}

