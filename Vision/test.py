import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt

im = cv.imread(r'Screenshot (131).png')
im[25:75, 25:75] = [255, 0, 0]  # Add a red square in the center
plt.imshow(im)
plt.show()