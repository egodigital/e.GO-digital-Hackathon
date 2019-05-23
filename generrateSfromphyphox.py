import numpy as np
import matplotlib.pyplot as plt
import sys

#loading file
filename = sys.argv[1]

#t Gyro,	abs Gyro,	t IMU,	abs IMU,	t GPS,	v GPS,	z GPS,	lat GPS,	lon GPS,	x IMU,	y IMU,	z IMU
data = np.genfromtxt("{}".format(filename), dtype="f, f, f, f, f, f, f, f, f, f, f, f", skip_header=1, skip_footer=0, autostrip=True, delimiter=";")

t = []
gyro_abs = []
imu_abs = []
imu_x = []
imu_y = []
imu_z = []

gps_t = []
gps_v = []
gps_z = []
gps_lat = []
gps_lon = []

for d in data:
	t.append((d[0]+d[2])/2)
	gyro_abs.append(d[1])
	imu_abs.append(d[3])
	imu_x.append(d[9])
	imu_y.append(d[10])
	imu_z.append(d[11])
	if(not np.isnan(d[4])):
		gps_t.append(d[4])
		gps_v.append(d[5])
		gps_z.append(d[6])
		gps_lat.append(d[7])
		gps_lon.append(d[8])


# Cleaning GPS Data:
i = len(gps_t)-2;
while i > 0:
	if(gps_v[i-1] != 0 and gps_v[i+1] != 0 and gps_v[i] == 0):
		del(gps_t[i])
		del(gps_v[i])
		del(gps_z[i])
		del(gps_lat[i])
		del(gps_lon[i])
	i -= 1


plt.plot(gps_t, gps_v, color="black")
plt.xlabel('time in s')
plt.ylabel('speed in m/s')
plt.title("GPS Speed readout")
plt.show()
plt.close()


# Calculating acceleration from GPS Data:
gps_a = [0]
i = 1;
while i < len(gps_t):
	gps_a.append((gps_v[i]-gps_v[i-1])/(gps_t[i]-gps_t[i-1]))
	i += 1


plt.plot(gps_t, gps_a, color="C0", label="GPS")
plt.plot(t, gyro_abs, color="C1", label="Gyro")
plt.plot(t, imu_x, color="C2", label="IMUx")
plt.plot(t, imu_y, color="C3", label="IMUy")
plt.plot(t, imu_z, color="C4", label="IMUz")
plt.xlabel('time in s')
plt.ylabel('acceleration in m/s^2')
plt.title("GPS, IMU, Gyro acceleration readout")
plt.legend()
plt.grid()
plt.show()
plt.close()