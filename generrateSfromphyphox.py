import numpy as np
import matplotlib.pyplot as plt
import sys
import json

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



# Gennerate demo data for Steering wheel, Distance, Power consumption, Wheel pressure

def generraterandomdata(length, time_range, grad_polynom, show=False):
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
	area = np.arange(0, time_range, time_range/float(length))
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
	if(show):
		plt.figure()
		plt.plot(x_scale, values, 'o')
		plt.plot(area, f, c='r')
		plt.xlabel("t [s]")
		plt.show()
	return (f, x_scale)

def ksmooth(data, k):
	if len(data) < 2*k+1:
		print("ERROR")
		return None
	newdata = [None]*len(data)
	i = k+1
	I = np.sum(data[0: 2*k+1])
	for a in range(k+1):
		newdata[a] = (I/(2*k+1))
	while i < len(data)-k:
		I -= data[i-k-1]
		I += data[i+k]
		newdata[i] = (I/(2*k+1))
		i += 1
	for a in range(len(data)-k, len(data)):
		newdata[a] = (I/(2*k+1))
	#s = 0
	#for p in newdata:
	#	if p == None:
	#		s += 1
	#print(s)
	return newdata

# 	Steering wheel Puls level
print(len(gps_t))
ts, x = generraterandomdata(len(gps_t), gps_t[-1], 8)
ts += ksmooth(np.asarray(gps_a)/2, 5)
s = []
i = 0
while i<len(gps_v):
	s.append(ts[i]*gps_v[i])
	i += 1


# 	Distance to front driver in m
d, x = generraterandomdata(len(gps_t), gps_t[-1], 4)
d -= np.mean(d)
d *= 3
d += 4
d = ksmooth(d, 10)

# Power consumption
w, x = generraterandomdata(len(gps_t), gps_t[-1], 4)
w -= np.amin(w)
w *= 5
w += gps_a

# Wheel pressure
tp, x = generraterandomdata(len(gps_t), gps_t[-1], 4)
tp -= np.amin(tp)
#tp *= imu_x * 3
tp += gps_a
p = ksmooth(tp, 10)

tbreakf = [x if x < 0 else 0 for x in gps_a]
tbreakf = ((gps_v-10)**3 if (gps_v-10)>0 else 0)

def gS(gps_v, gps_a, s, d, w, p):
	return gps_v/50 + ((gps_v-50)**8/200 if (gps_v-50)>0 else 0) + 10*np.abs(gps_a) + (s + 100*1/d + w + p)/10

S = []
i = 0
while i < len(gps_t):
	S.append(gS(gps_v[i], gps_a[i], s[i], d[i], w[i], p[i]))
	i += 1
	pass

S = [s if s >= 0 else 0 for s in S]
S = ksmooth(S, 5)



plt.plot(gps_t, S, color="black")
plt.plot(gps_t, gps_a, color="grey")
plt.plot(gps_t, s, color="C0")
plt.xlabel('time in s')
plt.ylabel('Stress')
plt.title("Generrated Stress data for GPS measurement")
plt.grid()
plt.show()
plt.close()

# Generrating json with:
# 	- gps_v
# 	- gps_a
# 	- gps_t
# 	- gps_lon + gps_lat
# 	- S

class MyEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, np.integer):
			return int(obj)
		elif isinstance(obj, np.floating):
			return float(obj)
		elif isinstance(obj, np.ndarray):
			return obj.tolist()
		else:
			return super(MyEncoder, self).default(obj)

js = json.dumps({"v": gps_v, "a": gps_a, "t": gps_t, "lon": gps_lon, "lat": gps_lat, "S": S}, sort_keys=True, cls=MyEncoder)

print(js)
print()
print()
print()
print()
S = (S-np.min(S))
S /= np.max(S)
i = 0
while i < len(gps_t):
	print("[{}, {}, {}], ".format(gps_lat[i], gps_lon[i], S[i]))
	i += 1