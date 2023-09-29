import { GDevelopBehavior } from "./GDevelopBehavior.js";
import { EventBus } from "./EventBus.js";
import { InteractorEnteredRangeEvent, InteractorExitedRangeEvent, InteractorInteractedEvent } from "./Constants.js"
import { Interactable } from "./Interactable.js";

export class Interactor extends GDevelopBehavior {

    _interactPopupInstance;
    _interactablesInRange = [];
    _wasInteractPressed = false;
    _isSimulatedInteractPressed = false;

    onCreated() {
        EventBus.addListener(InteractorEnteredRangeEvent(), this, this._onInteractorEnteredRange);
        EventBus.addListener(InteractorExitedRangeEvent(), this, this._onInteractorExitedRange);
    }

    onDestroyed() {
        EventBus.removeListener(InteractorEnteredRangeEvent(), this, this._onInteractorEnteredRange);
        EventBus.removeListener(InteractorExitedRangeEvent(), this, this._onInteractorExitedRange);
    }

    doStepPreEvents(delta) {
        const isInteractDown = gdjs.evtTools.input.isKeyPressed(this.runtimeScene, "e") || this._isSimulatedInteractPressed;
        const isInteractPressedThisFrame = isInteractDown && !this._wasInteractPressed;
        this._wasInteractPressed = isInteractDown;
        
        if (isInteractPressedThisFrame) {
            const closestInteractable = this._getClosestInteractable();
            if (closestInteractable) {
                EventBus.invoke(InteractorInteractedEvent(), this, closestInteractable);
            }
        }
    }

    simulateInteractPress(isPressed) {
        this._isSimulatedInteractPressed = isPressed;
    }

    _onInteractorEnteredRange(/** @type {Interactor} */ interactor, /** @type {Interactable} */ interactable) {
        if (interactor !== this) return;
        
        this._interactablesInRange.push(interactable);

        if (!this._interactPopupInstance)
            this._interactPopupInstance = this.runtimeScene.createObject("InteractPopup");

        const x = interactable.ObjectCenterX - this._interactPopupInstance.getWidth() / 2;
        const y = interactable.ObjectY - this._interactPopupInstance.getHeight();
        this._interactPopupInstance.setPosition(x, y);
        this._interactPopupInstance.setZOrder(100);
    }

    _onInteractorExitedRange(/** @type {Interactor} */ interactor, /** @type {Interactable} */ interactable) {
        if (interactor !== this) return;

        this._interactablesInRange.splice(this._interactablesInRange.indexOf(interactable), 1);

        if (this._interactPopupInstance) {
            this._interactPopupInstance.deleteFromScene(this.runtimeScene);
            this._interactPopupInstance = null;
        }
    }

    _getClosestInteractable() {
        let closestInteractable = null;
        let closestDistance = Infinity;
        this._interactablesInRange.forEach(interactable => {
            const distance = this.getDistanceTo(interactable);
            if (distance < closestDistance) {
                closestInteractable = interactable;
                closestDistance = distance;
            }
        });
        return closestInteractable;
    }
}
