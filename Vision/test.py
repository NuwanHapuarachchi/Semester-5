import matplotlib.pyplot as plt
import numpy as np

# Create time points for the oscilloscope display
time = np.linspace(0, 10, 800)

# Create the specific jagged pattern matching the image
ppm_values = []

for i, t in enumerate(time):
    if t < 1.5:
        # Initial high spiky section (left peak cluster)
        base = 1100
        spike = np.sin(t * 15) * 80 + np.sin(t * 25) * 40 + np.sin(t * 35) * 25
        # Add extra jaggedness
        noise = np.random.normal(0, 15)
        ppm = base + spike + noise
    elif t < 2.5:
        # Sharp descent
        base = 1100 - (t - 1.5) * 600
        spike = np.sin(t * 20) * 30 + np.sin(t * 40) * 15
        noise = np.random.normal(0, 10)
        ppm = base + spike + noise
    elif t < 4.0:
        # Middle low jagged section
        base = 400 + np.sin((t - 2.5) * 3) * 50
        spike = np.sin(t * 18) * 40 + np.sin(t * 30) * 20
        noise = np.random.normal(0, 12)
        ppm = base + spike + noise
    elif t < 6.0:
        # Deep valley with spikes
        base = 300 + np.sin((t - 4) * 2) * 30
        spike = np.sin(t * 22) * 35 + np.sin(t * 45) * 18
        noise = np.random.normal(0, 8)
        ppm = base + spike + noise
    elif t < 7.5:
        # Sharp rise section
        base = 350 + (t - 6) * 300
        spike = np.sin(t * 25) * 25 + np.sin(t * 40) * 15
        noise = np.random.normal(0, 10)
        ppm = base + spike + noise
    else:
        # Final high jagged section (right peak)
        base = 800 + np.sin((t - 7.5) * 8) * 100
        spike = np.sin(t * 20) * 60 + np.sin(t * 35) * 30
        noise = np.random.normal(0, 15)
        ppm = base + spike + noise
    
    # Ensure values stay within reasonable bounds
    ppm = max(200, min(1200, ppm))
    ppm_values.append(ppm)

# Convert to numpy array
ppm_values = np.array(ppm_values)

# Create the plot with black background like oscilloscope
plt.figure(figsize=(10, 6))
plt.style.use('dark_background')

# Plot the main data line in bright green (exactly like oscilloscope)
plt.plot(time, ppm_values, '#00FF41', linewidth=1.8, alpha=0.9)

# Add horizontal reference lines in white (like the image)
plt.axhline(y=800, color='white', linewidth=1.5, alpha=0.8)
plt.axhline(y=400, color='white', linewidth=1.5, alpha=0.8)

# Remove all labels and ticks for clean oscilloscope look
plt.xticks([])
plt.yticks([])
plt.xlabel('')
plt.ylabel('')

# Set axis limits to match the image closely
plt.ylim(200, 1200)
plt.xlim(0, 10)

# Remove all spines/borders
for spine in plt.gca().spines.values():
    spine.set_visible(False)

# Remove grid
plt.grid(False)

# Make background pure black
plt.gca().set_facecolor('black')
plt.gcf().patch.set_facecolor('black')

# Remove margins for exact oscilloscope appearance
plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
plt.show()