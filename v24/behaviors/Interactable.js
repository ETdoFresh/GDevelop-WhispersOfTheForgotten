import { GDevelopBehavior } from "./GDevelopBehavior.js";
import { EventBus } from "./EventBus.js";
import { InteractorInteractedEvent, InteractorEnteredRangeEvent, 
    InteractorExitedRangeEvent, InteractorType } from "./Constants.js"

export class Interactable extends GDevelopBehavior {
    get InteractableRadius() { return this._behaviorData.InteractableRadius; }
    set InteractableRadius(value) { this._behaviorData.InteractableRadius = value; }
    get IsInteractable() { return this._behaviorData.IsInteractable; }
    set IsInteractable(value) { this._behaviorData.IsInteractable = value; }
    interactorsInRange = [];

    onCreated() {
        this.InteractableRadius = this.InteractableRadius || 20;
        this.IsInteractable = this.IsInteractable || false;
        EventBus.addListener(InteractorInteractedEvent(), this, this.onInteractorInteracted);
    }

    onDestroyed() {
        EventBus.removeListener(InteractorInteractedEvent(), this, this.onInteractorInteracted);
    }

    doStepPreEvents(delta) {
        if (!this.IsInteractable) return;
        const interactors = this.findObjectsOfType(InteractorType());
        interactors.forEach(interactor => {
            const distance = this.getDistanceTo(interactor);
            if (!this.interactorsInRange.includes(interactor) && distance <= this.InteractableRadius) {
                this.interactorsInRange.push(interactor);
                EventBus.invoke(InteractorEnteredRangeEvent(), interactor, this);
            }
            else if (this.interactorsInRange.includes(interactor) && distance > this.InteractableRadius) {
                this.interactorsInRange.splice(this.interactorsInRange.indexOf(interactor), 1);
                EventBus.invoke(InteractorExitedRangeEvent(), interactor, this);
            }
        });
    }

    onInteractorInteracted(interactor, interactable) {
        if (interactable !== this) return;
        
        console.log(`Interactor ${interactor.Name} interacted with ${interactable.Name}`);
        let interactParticles = this.runtimeScene.createObject("InteractParticles");
        interactParticles.setPosition(this.ObjectCenterX, this.ObjectCenterY);
        interactParticles.setZOrder(100);
    }
}
