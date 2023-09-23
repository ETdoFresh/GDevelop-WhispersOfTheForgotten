import { GDevelopBehavior } from "./GDevelopBehavior.js";
import { EventBus } from "./EventBus.js";

export class Interactor extends GDevelopBehavior {
    onCreated() {
        EventBus.addListener("InteractorEnteredRange", this, this.onInteractorEnteredRange);
        EventBus.addListener("InteractorExitedRange", this, this.onInteractorExitedRange);
    }

    onDestroyed() {
        EventBus.removeListener("InteractorEnteredRange", this, this.onInteractorEnteredRange);
        EventBus.removeListener("InteractorExitedRange", this, this.onInteractorExitedRange);
    }

    onInteractorEnteredRange(interactor, interactable) {
        if (interactor !== this.owner) return;
        console.log(`Interactor ${interactor.Name} entered range of ${interactable.Name}`);
    }

    onInteractorExitedRange(interactor, interactable) {
        if (interactor !== this.owner) return;
        console.log(`Interactor ${interactor.Name} exited range of ${interactable.Name}`);
    }
}
