import { GDevelopBehavior } from "./GDevelopBehavior.js";


export class CharacterAnimatorSheet extends GDevelopBehavior {
    doStepPreEvents(delta) {
        if (!this.state) this.state = this.getBehavior("CharacterState");
        if (!this.state) return;
        if (!this.stateData) this.stateData = this.state._behaviorData;
        if (!this.stateData) return;
        if (!this.animator) this.animator = this.getBehavior("JSONSpriteSheetAnimator");
        if (!this.animator) return;

        if (this.state.IsNewCharacterState() || this.state.IsNewCharacterDirection()) {
            const state = this.stateData.CurrentState;
            const direction = this.stateData.CurrentDirection;
            const animationName = `${state}_${direction}`;
            this.animator.PlayAnimation(animationName, this.eventFunctionContext);
        }
    }
}
