import numpy as np 
import matplotlib.pyplot as plt
import sys

length = int(sys.argv[1]) # Number of random points
time_range = float(sys.argv[2]) # Bsp: 20 -> 0 bis 20 s
grad_polynom = int(sys.argv[3]) # Grad des Polynoms
output_file = sys.argv[4] # Output file

#scale x-axis:
x_scale_factor = time_range/float(length)
x_scale = []
for i in range(length):
    x_scale.append(x_scale_factor*i)

#Create Polynom
values = np.random.rand(1,length)[0]
params = np.polyfit(x_scale, values, grad_polynom)
def polynom(x, params):
    value = 0
    ln = len(params)
    for i in range(ln):
        value+=params[i]*x**(ln-i-1)
    return value

# Calculate curve
area = np.arange(0, time_range, time_range/float(100))
f = []
value = 0
for x in area:
    value2 = polynom(x, params)
    if value2 > 1 or value2 < 0:
        f.append(value)
    else:
        f.append(value2)
        value = value2

# Plot data
plt.figure()
plt.plot(x_scale, values, 'o')
plt.plot(area, f, c='r')
plt.xlabel("t [s]")
plt.show()

#Write to file
with open(output_file, 'a') as the_file:
    the_file.write('\n')

    #writing y data
    string_y_data = ""
    for value in f:
        string_y_data+=str(value)+" "
    the_file.write(string_y_data+'\n')

    #writing x data
    string_x_data = ""
    for value in x_scale:
        string_x_data+=str(value)+" "
    the_file.write(string_x_data+'\n')