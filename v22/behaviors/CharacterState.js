import { GDevelopBehavior } from "./GDevelopBehavior.js";


export class CharacterState extends GDevelopBehavior {
    get CurrentState() { return this._behaviorData.CurrentState; }
    set CurrentState(newValue) { this._behaviorData.CurrentState = newValue; }
    get CurrentDirection() { return this._behaviorData.CurrentDirection; }
    set CurrentDirection(newValue) { this._behaviorData.CurrentDirection = newValue; }
    get PreviousState() { return this._behaviorData.PreviousState; }
    set PreviousState(newValue) { this._behaviorData.PreviousState = newValue; }
    get PreviousDirection() { return this._behaviorData.PreviousDirection; }
    set PreviousDirection(newValue) { this._behaviorData.PreviousDirection = newValue; }
    get HasStateBeenChanged() { return this.hasStateBeenChanged; }
    get HasDirectionBeenChanged() { return this.hasDirectionBeenChanged; }
    
    onCreated() {
        this.CurrentState = "Idle";
        this.PreviousState = "Idle";
        this.CurrentDirection = "S";
        this.PreviousDirection = "S";
    }
    
    doStepPreEvents(delta) {
        this.hasStateBeenChanged = this.CurrentState !== this.PreviousState;
        this.PreviousState = this.CurrentState;

        this.hasDirectionBeenChanged = this.CurrentDirection !== this.PreviousDirection;
        this.PreviousDirection = this.CurrentDirection;
    }
}