import os
import bpy
from math import radians
from PIL import Image

fourDirections = ['S', 'W', 'N', 'E']
eightDirections = ['SW', 'W', 'NW', 'N', 'NE', 'E', 'SE', 'S']
sixteenDirections = ['SW', 'SWW', 'W', 'NWW', 'NW', 'N', 'NE', 'NEE', 'E', 'SEE', 'SE', 'S', 'SSW', 'SW', 'S', 'SSE']
rotator = bpy.data.objects['Rotator']

spriteSize = bpy.data.scenes['Scene'].render.resolution_x

basePath = r'c:\tmp\spriteSheets2'
imageName = 'amy'
directions = eightDirections
animations = [
    {'name': 'walk', 'startFrame': 0, 'endFrame': 30, 'nth': 5},
]

for animationIndex in range(len(animations)):
    renderPaths = []
    startFrame = animations[animationIndex]['startFrame']
    endFrame = animations[animationIndex]['endFrame']
    animationName = animations[animationIndex]['name']
    animationLength = endFrame - startFrame

    for i in range(len(directions)):
        rotator.rotation_euler = (0, 0, radians(-360 / len(directions) * i))

        file = os.path.join(basePath, imageName + '_' + animationName + '_' + directions[i])
        renderPaths.append(file)

        k = 0
        for j in range(animationLength):
            if j % animations[animationIndex]['nth'] != 0:
                continue
            bpy.context.scene.frame_current = startFrame + j
            bpy.context.scene.render.filepath = file + str(k)
            bpy.ops.render.render(write_still=True)
            k += 1

rotator.rotation_euler = (0, 0, 0)

# spriteSheet = Image.new('RGBA', (spriteSize * animationLength, spriteSize * len(renderPaths)))
# for i in range(len(renderPaths)):
#     for j in range(animationLength):
#         imagePath = renderPaths[i] + str(j) + '.png'
#         image = Image.open(imagePath)
#         spriteSheet.paste(image, (spriteSize * j, spriteSize * i))
#         os.remove(imagePath)

# spriteSheet.save(basePath + '\\' + animationName + '.png')