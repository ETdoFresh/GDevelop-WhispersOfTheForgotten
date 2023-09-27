import { GDevelopBehavior } from "./GDevelopBehavior.js";


export class CharacterController extends GDevelopBehavior {
    get NumberOfDirections() { return this._behaviorData.NumberOfDirections; }
    set NumberOfDirections(value) { this._behaviorData.NumberOfDirections = value; }
    
    doStepPreEvents(delta) {
        this.NumberOfDirections = this.NumberOfDirections || 4;
        if (!this.state) this.state = this.getBehavior("CharacterState");
        if (!this.state) return;
        if (!this.stateData) this.stateData = this.state._behaviorData;
        if (!this.stateData) return;
        if (!this.topDownMovement) this.topDownMovement = this.getBehavior("TopDownMovement");
        if (!this.topDownMovement) return;

        const angle = this.topDownMovement.getAngle();
        if (this.NumberOfDirections === 4) {
            if (angle >= 45 && angle < 135 || angle >= -315 && angle < -225) {
                this.stateData.CurrentDirection = "S";
            }
            else if (angle >= 135 && angle < 225 || angle >= -225 && angle < -135) {
                this.stateData.CurrentDirection = "W";
            }
            else if (angle >= 225 && angle < 315 || angle >= -135 && angle < -45) {
                this.stateData.CurrentDirection = "N";
            }
            else {
                this.stateData.CurrentDirection = "E";
            }
        }
        else if (this.NumberOfDirections === 8) {
            if (angle >= 22.5 && angle < 67.5 || angle >= -337.5 && angle < -292.5) {
                this.stateData.CurrentDirection = "SE";
            }
            else if (angle >= 67.5 && angle < 112.5 || angle >= -292.5 && angle < -247.5) {
                this.stateData.CurrentDirection = "S";
            }
            else if (angle >= 112.5 && angle < 157.5 || angle >= -247.5 && angle < -202.5) {
                this.stateData.CurrentDirection = "SW";
            }
            else if (angle >= 157.5 && angle < 202.5 || angle >= -202.5 && angle < -157.5) {
                this.stateData.CurrentDirection = "W";
            }
            else if (angle >= 202.5 && angle < 247.5 || angle >= -157.5 && angle < -112.5) {
                this.stateData.CurrentDirection = "NW";
            }
            else if (angle >= 247.5 && angle < 292.5 || angle >= -112.5 && angle < -67.5) {
                this.stateData.CurrentDirection = "N";
            }
            else if (angle >= 292.5 && angle < 337.5 || angle >= -67.5 && angle < -22.5) {
                this.stateData.CurrentDirection = "NE";
            }
            else {
                this.stateData.CurrentDirection = "E";
            }
        }
        else if (this.NumberOfDirections === 16) {
            if (angle >= 11.25 && angle < 33.75 || angle >= -348.75 && angle < -326.25) {
                this.stateData.CurrentDirection = "SE";
            }
            else if (angle >= 33.75 && angle < 56.25 || angle >= -326.25 && angle < -303.75) {
                this.stateData.CurrentDirection = "SEE";
            }
            else if (angle >= 56.25 && angle < 78.75 || angle >= -303.75 && angle < -281.25) {
                this.stateData.CurrentDirection = "SSE";
            }
            else if (angle >= 78.75 && angle < 101.25 || angle >= -281.25 && angle < -258.75) {
                this.stateData.CurrentDirection = "S";
            }
            else if (angle >= 101.25 && angle < 123.75 || angle >= -258.75 && angle < -236.25) {
                this.stateData.CurrentDirection = "SSW";
            }
            else if (angle >= 123.75 && angle < 146.25 || angle >= -236.25 && angle < -213.75) {
                this.stateData.CurrentDirection = "SW";
            }
            else if (angle >= 146.25 && angle < 168.75 || angle >= -213.75 && angle < -191.25) {
                this.stateData.CurrentDirection = "SWW";
            }
            else if (angle >= 168.75 && angle < 191.25 || angle >= -191.25 && angle < -168.75) {
                this.stateData.CurrentDirection = "W";
            }
            else if (angle >= 191.25 && angle < 213.75 || angle >= -168.75 && angle < -146.25) {
                this.stateData.CurrentDirection = "NWW";
            }
            else if (angle >= 213.75 && angle < 236.25 || angle >= -146.25 && angle < -123.75) {
                this.stateData.CurrentDirection = "NW";
            }
            else if (angle >= 236.25 && angle < 258.75 || angle >= -123.75 && angle < -101.25) {
                this.stateData.CurrentDirection = "NNW";
            }
            else if (angle >= 258.75 && angle < 281.25 || angle >= -101.25 && angle < -78.75) {
                this.stateData.CurrentDirection = "N";
            }
            else if (angle >= 281.25 && angle < 303.75 || angle >= -78.75 && angle < -56.25) {
                this.stateData.CurrentDirection = "NNE";
            }
            else if (angle >= 303.75 && angle < 326.25 || angle >= -56.25 && angle < -33.75) {
                this.stateData.CurrentDirection = "NE";
            }
            else if (angle >= 326.25 && angle < 348.75 || angle >= -33.75 && angle < -11.25) {
                this.stateData.CurrentDirection = "NEE";
            }
            else {
                this.stateData.CurrentDirection = "E";
            }
        }

        const speed = this.topDownMovement.getSpeed();
        if (speed > 0) {
            this.stateData.CurrentState = "Walking";
        }
        else {
            this.stateData.CurrentState = "Idle";
        }
    }
}
