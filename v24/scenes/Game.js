import { GDevelopScene } from "./GDevelopScene.js";

export class Game extends GDevelopScene {
    leaderboardId = "ef511a78-fe0a-4e09-ab21-1259d0801a32";

    onSceneLoaded(runtimeScene, eventsFunctionContext) {
        window.runtimeScene = runtimeScene;

        runtimeScene.getVariables().add("State", (new gdjs.Variable()).fromJSObject("NotStarted"))

        runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => { tappyPlane.getBehavior("PlatformerObject").activate(false); })

        runtimeScene._instances.items.HighScoreChanged.forEach(hsc => hsc.hide());

        gdjs.evtTools.camera.showLayer(runtimeScene, "Transition");
        gdjs.evtTools.camera.hideLayer(runtimeScene, "Gameover");

        gdjs.evtTools.runtimeScene.createObjectsFromExternalLayout(runtimeScene, "Gameover", 0, 0);

        gdjs.evtTools.runtimeScene.createObjectsFromExternalLayout(runtimeScene, "SubmitScore", 0, 0);

        runtimeScene._instances.items.CurrentScore.forEach(currentScore => { currentScore.setOutline("0;0;0", 2); });

        runtimeScene._instances.items.BlackRect.forEach(blackRect => {
            blackRect.getBehavior("Tween").addObjectOpacityTween("FadeIn", 0, "linear", 250, false);
        });
    }

    onScenePostEvents(runtimeScene, eventsFunctionContext) {
        this.onClickDuringInstructions(runtimeScene);
        this.onMoving(runtimeScene);
        this.onGamePlaying(runtimeScene);
        this.onGameOver(runtimeScene);
    }

    onClickDuringInstructions(runtimeScene) {
        const stateVariable = runtimeScene.getVariables().get("State");
        if (stateVariable.getValue() != "NotStarted") return;

        const isLeftMouseButtonReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
        const isSpaceKeyReleased = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space");
        if (!isLeftMouseButtonReleased && !isSpaceKeyReleased) return;

        stateVariable.setValue("GamePlaying");

        runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
            tappyPlane.getBehavior("EllipseMovementJS").activate(false);
            tappyPlane.getBehavior("PlatformerObject").activate(true);
        });

        runtimeScene._instances.items.Instructions.forEach(instructions => {
            instructions.hide();
        });
    }

    onMoving(runtimeScene) {
        const stateVariable = runtimeScene.getVariables().get("State");
        if (stateVariable.getValue() != "GamePlaying") return;

        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
        runtimeScene._instances.items.Ground.forEach(ground => {
            ground.setXOffset(ground.getXOffset() + 100 * delta);
        });

        runtimeScene._instances.items.Ceiling.forEach(ceiling => {
            ceiling.setXOffset(ceiling.getXOffset() - 100 * delta);
        });
    }

    isGamePlayingTriggered = false;
    isPlanePassingThroughHole = false;
    onGamePlaying(runtimeScene) {
        const pillars = runtimeScene.getObjects("TopPillar").concat(runtimeScene.getObjects("BottomPillar"));
        pillars.forEach(pillar => { pillar.clearForces(); });

        const stateVariable = runtimeScene.getVariables().get("State");
        const wasGamePlayingTriggered = this.isGamePlayingTriggered;
        this.isGamePlayingTriggered = stateVariable.getValue() == "GamePlaying";
        if (!this.isGamePlayingTriggered) return;

        const isTriggeredOnce = !wasGamePlayingTriggered && this.isGamePlayingTriggered;

        if (isTriggeredOnce) {
            runtimeScene.getTimeManager().addTimer("pipe_spawn");
        }

        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);

        // Plane

        // Rotate plane downward when falling
        runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
            const isFalling = tappyPlane.getBehavior("PlatformerObject").isFalling();
            if (!isFalling) return;
            tappyPlane.rotateTowardAngle(90, 150);
        });

        // Jump to move up
        const isLeftMouseButtonReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
        const isSpaceKeyReleased = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space");
        runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
            if (!isLeftMouseButtonReleased && !isSpaceKeyReleased) return;

            gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_wing.wav", false, 70, 1);
            tappyPlane.getBehavior("PlatformerObject").simulateJumpKey();
            tappyPlane.getBehavior("PlatformerObject").setCanJump();
            tappyPlane.angle = 320;
        });

        // Pipe spawn

        // Create pillars with a hole at a random vertical position
        if (runtimeScene.getTimeManager().getTimer("pipe_spawn").getTime() > 2.5 * 1000) {
            runtimeScene.getTimeManager().addTimer("pipe_spawn");

            let topPillar = runtimeScene.createObject("TopPillar");
            topPillar.setX(450);
            topPillar.setY(gdjs.randomInRange(30, 110));

            let bottomPillar = runtimeScene.createObject("BottomPillar");
            bottomPillar.setX(450);
            bottomPillar.setY(topPillar.getY() + 350);

            topPillar.zOrder = 1;
            bottomPillar.zOrder = 1;
            topPillar.setAnimation(gdjs.random(1));
            bottomPillar.setAnimation(gdjs.random(1));
        }

        // Move pillars horizontally
        pillars.forEach(pillar => {
            pillar.addForce(-100, 0, 1);
        });

        // Scoring

        // Add a point to the player score once the player passes a the hole
        const tappyPlanes = runtimeScene.getObjects("TappyPlane");
        const wasPlanePassingThroughHole = this.isPlanePassingThroughHole;
        this.isPlanePassingThroughHole = false;
        pillars.forEach(pillar => {
            tappyPlanes.forEach(tappyPlane => {
                if (this.isPlanePassingThroughHole) return;
                this.isPlanePassingThroughHole = pillar.getX() < tappyPlane.getCenterXInScene() && pillar.getX() > tappyPlane.getCenterXInScene() - 60;
            });
        });
        const currentScores = runtimeScene.getObjects("CurrentScore");
        if (!wasPlanePassingThroughHole && this.isPlanePassingThroughHole) {
            runtimeScene.getVariables().get("Score").add(1);
            currentScores.forEach(currentScore => {
                currentScore.setString(runtimeScene.getVariables().get("Score").getAsString());
            });
            gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_point.wav", false, 100, 1);


            // Make the score stand out for half a second
            currentScores.forEach(currentScore => {
                new Promise((resolve, reject) => {
                    currentScore.setOutline("0;0;0", 7);
                    setTimeout(() => { resolve() }, 500);
                }).then(() => {
                    currentScore.setOutline("0;0;0", 2);
                });
            });
        }

        // Obstacle

        // Player loses when the plane crashes
        const obstacles = runtimeScene.getObjects("BottomPillar")
            .concat(runtimeScene.getObjects("TopPillar"))
            .concat(runtimeScene.getObjects("Ground"))
            .concat(runtimeScene.getObjects("Ceiling"));
        let isCrashed = false;
        tappyPlanes.forEach(tappyPlane => {
            obstacles.forEach(obstacle => {
                if (isCrashed) return;
                isCrashed = gdjs.RuntimeObject.collisionTest(tappyPlane, obstacle, false);
            });
        });

        if (isCrashed) {
            const stateVariable = runtimeScene.getVariables().get("State");
            stateVariable.setValue("GameOver");
            gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_hit.wav", false, 100, 0.8);
            tappyPlanes.forEach(tappyPlane => { tappyPlane.getBehavior("PlatformerObject").activate(false); })
        }
    }

    isGameOverTriggered = false;
    isPlayerLoggedIn = false;
    onGameOver(runtimeScene) {
        const stateVariable = runtimeScene.getVariables().get("State");
        const wasGameOverTriggered = this.isGameOverTriggered;
        this.isGameOverTriggered = stateVariable.getValue() == "GameOver";
        if (!this.isGameOverTriggered) return;

        const isTriggeredOnce = !wasGameOverTriggered && this.isGameOverTriggered;
        const currentScores = runtimeScene.getObjects("CurrentScore");
        const highScoreChangeds = runtimeScene.getObjects("HighScoreChanged");
        const finalScores = runtimeScene.getObjects("FinalScore");
        const highScores = runtimeScene.getObjects("HighScore");
        const playerNameInputs = runtimeScene.getObjects("PlayerNameInput");
        const score = runtimeScene.getVariables().get("Score");

        if (isTriggeredOnce) {
            var flash = runtimeScene.createObject("Flash");
            flash.setLayer("GUI");
            //flash.getBehavior("Flash").Flash(0.1, runtimeScene);
            new Promise((resolve, reject) => {
                setTimeout(() => { resolve() }, 100);
            }).then(() => {
                flash.deleteFromScene(runtimeScene);
                gdjs.evtTools.camera.showLayer(runtimeScene, "Gameover");
                currentScores.forEach(currentScore => { currentScore.hide(); });
                highScoreChangeds.forEach(highScoreChanged => highScoreChanged.hide());
                finalScores.forEach(finalScore => {
                    finalScore.setString(`Score: ${runtimeScene.getVariables().get("Score").getAsString()}`);
                    finalScore.setOutline("0;0;0", 2);
                });
                highScores.forEach(highScore => {
                    highScore.setOutline("0;0;0", 2);
                });
            });

            // Read the previous best score from the storage
            const highScoreExistsInSave = gdjs.evtTools.storage.elementExistsInJSONFile("save", "high_score");
            const previousBestScore = runtimeScene.getVariables().get("PreviousBestScore");
            if (highScoreExistsInSave) {
                gdjs.evtTools.storage.readNumberFromJSONFile("save", "high_score", runtimeScene, previousBestScore);
                highScores.forEach(highScore => { highScore.setString(`Best: ${previousBestScore.getAsString()}`); });
            }

            // Check if this is a new best score
            const isScoreHigherThanPreviousBestScore = score.getValue() > previousBestScore.getValue();
            if (isScoreHigherThanPreviousBestScore) {
                highScoreChangeds.forEach(highScoreChanged => highScoreChanged.hide(false));
                gdjs.evtTools.storage.writeNumberInJSONFile("save", "high_score", score.getValue());
            }

            gdjs.playerAuthentication.displayAuthenticationBanner(runtimeScene);

            const isPlayerAuthenticated = gdjs.playerAuthentication.isAuthenticated();
            if (isPlayerAuthenticated) {
                playerNameInputs.forEach(playerNameInput => {
                    playerNameInput.setString(gdjs.playerAuthentication.getUsername());
                    playerNameInput.setDisabled(true);
                });
            }
            else if (runtimeScene.getGame().getVariables().get("PlayerName").getAsString() != 0) {
                playerNameInputs.forEach(playerNameInput => {
                    playerNameInput.setString(runtimeScene.getGame().getVariables().get("PlayerName").getAsString());
                });
            }
        }

        const wasPlayerLoggedIn = this.isPlayerLoggedIn;
        this.isPlayerLoggedIn = gdjs.playerAuthentication.isAuthenticated();
        if (!wasPlayerLoggedIn && this.isPlayerLoggedIn) {
            playerNameInputs.forEach(playerNameInput => {
                playerNameInput.setString(gdjs.playerAuthentication.getUsername());
                playerNameInput.setDisabled(true);
            });
            gdjs.playerAuthentication.displayAuthenticationBanner(runtimeScene);
        }

        const restartButtons = runtimeScene.getObjects("RestartButton");
        let isRestartClicked = false;
        restartButtons.forEach(restartButton => {
            if (isRestartClicked) return;
            isRestartClicked = restartButton.IsClicked(runtimeScene);
        });
        if (isRestartClicked) {
            gdjs.playerAuthentication.removeAuthenticationBanner(runtimeScene);
            gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game");
            return;
        }

        const submitButtons = runtimeScene.getObjects("SubmitScoreButton");
        let isSubmitClicked = false;
        submitButtons.forEach(submitButton => {
            if (isSubmitClicked) return;
            isSubmitClicked = submitButton.IsClicked(runtimeScene);
        });
        if (isSubmitClicked) {
            gdjs.playerAuthentication.removeAuthenticationBanner(runtimeScene);
            if (isPlayerLoggedIn) {
                gdjs.evtTools.leaderboards.saveConnectedPlayerScore(runtimeScene, this.leaderboardId, score.getValue());
            }
            else {
                runtimeScene.getGame().getVariables().get("PlayerName").setString(runtimeScene.getObjects("PlayerNameInput")[0].getString());
                gdjs.evtTools.leaderboards.savePlayerScore(runtimeScene, this.leaderboardId, score.getValue(), runtimeScene.getObjects("PlayerNameInput")[0].getString());
            }
            gdjs.evtTools.leaderboards.displayLeaderboard(runtimeScene, this.leaderboardId, true);
            return;
        }

        const hasClosedLeaderboard = gdjs.evtTools.leaderboards.hasPlayerJustClosedLeaderboardView();
        const hasScoreSavedSucceeeded = gdjs.evtTools.leaderboards.hasBeenSaved(this.leaderboardId);
        if (hasClosedLeaderboard && hasScoreSavedSucceeeded) {
            gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game");
        }
    }
}