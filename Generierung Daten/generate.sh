#!/bin/bash

output="test.txt"
datapoints=250
timerange=250

echo "Generiere Daten..."

python3 generateData.py $datapoints $timerange 10 $output
echo "Steering wheel."

python3 generateData.py $datapoints $timerange 10 $output
echo "Acceleration."

python3 generateData.py $datapoints $timerange 10 $output
echo "Distance."

python3 generateData.py $datapoints $timerange 10 $output
echo "Power consumption."

python3 generateData.py $datapoints $timerange 10 $output
echo "Wheel pressure."

echo "done."