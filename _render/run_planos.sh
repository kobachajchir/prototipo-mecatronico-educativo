#!/bin/bash
cd /d/ProyectoFinal/_render
export TEMP='D:\ProyectoFinal\_render\tmp' TMP='D:\ProyectoFinal\_render\tmp'
B='/c/Program Files/Blender Foundation/Blender 4.5/blender.exe'
: > progreso_planos.txt
for v in top side front rear bottom; do
  "$B" -b --factory-startup -P planos_render.py -- "{\"view\":\"$v\",\"out\":\"D:/ProyectoFinal/planos/v_$v.png\",\"ppm\":6.0}" > plan_$v.txt 2>&1
  "$B" -b --factory-startup -P planos_render.py -- "{\"view\":\"$v\",\"out\":\"D:/ProyectoFinal/planos/id_$v.png\",\"ppm\":6.0,\"ids\":true}" > planid_$v.txt 2>&1
  echo "$v listo" >> progreso_planos.txt
done
echo TODO >> progreso_planos.txt
