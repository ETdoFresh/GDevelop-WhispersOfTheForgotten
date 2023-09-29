import bpy
import numpy as np
from PIL import Image
import array
import io
import ctypes

def main():
    img0 = bpy.data.images['Render Result']
    W,H = img0.size

    # Save image to file
    img0.save_render('c:/tmp/test.png')

    # Open image file using system default application
    import subprocess
    subprocess.Popen('c:/tmp/test.png', shell=True)


def clipboard_copy_image(img0, W, H):
    msvcrt = ctypes.cdll.msvcrt
    kernel32 = ctypes.windll.kernel32
    user32 = ctypes.windll.user32

    output = io.BytesIO()
    im = Image.frombytes('RGB', (W, H), img0) # This line is getting ValueError: tile cannot extend outside image
    im.save(output, 'BMP')
    data = output.getvalue()[14:]
    output.close()

    CF_DIB = 8
    GMEM_MOVEABLE = 0x0002

    global_mem = kernel32.GlobalAlloc(GMEM_MOVEABLE, len(img0))
    global_data = kernel32.GlobalLock(global_mem)
    msvcrt.memcpy(ctypes.c_char_p(global_data), img0, len(img0))
    kernel32.GlobalUnlock(global_mem)
    user32.OpenClipboard(None)
    user32.EmptyClipboard()
    user32.SetClipboardData(CF_DIB, global_mem)
    user32.CloseClipboard()


main()