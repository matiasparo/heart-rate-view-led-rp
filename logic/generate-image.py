import sys
from PIL import Image, ImageFont, ImageDraw

def colorLed(r,g,b):
    return (int(r), int(g), int(b))

def writeImage(inputString, filename, ledRows, r, g, b):
    font = ImageFont.truetype("/usr/share/fonts/truetype/roboto/Roboto-Bold.ttf", 24)
    width, ignore = font.getsize(inputString)
    im = Image.new("RGB", (32, ledRows), "black")
    draw = ImageDraw.Draw(im)
    draw.text((2, 0), inputString, colorLed(r, g, b), font=font)
    im.save(filename)

if __name__ == '__main__':
    writeImage(sys.argv[1], sys.argv[2], 32, sys.argv[4], sys.argv[5], sys.argv[6])