#!/bin/bash
cd /d/ProyectoFinal/_render
B='/c/Program Files/Blender Foundation/Blender 4.5/blender.exe'
UI='D:/ProyectoFinal/_cdp/pantalla_nuestro_auto.png'
export TEMP='D:\ProyectoFinal\_render\tmp' TMP='D:\ProyectoFinal\_render\tmp'
R=D:/ProyectoFinal/renders
run() { "$B" -b --factory-startup -P render.py -- "$1" > "log_$2.txt" 2>&1; echo "$2 listo" >> progreso.txt; }
: > progreso.txt
run "{\"mode\":\"iso\",\"out\":\"$R/11_detalle_pantalla_control_manual.png\",\"res\":[2000,1500],\"samples\":128,\"dir\":[-1,0.55,0.32],\"focus\":[-0.176,0.0,0.118],\"dist\":0.30,\"k\":0.035,\"world\":0.22,\"ui\":\"$UI\"}" detalle
run "{\"mode\":\"iso\",\"out\":\"$R/portada.png\",\"res\":[1600,1600],\"samples\":96,\"dir\":[1,1,0.6],\"transparent\":true,\"k\":0.035,\"world\":0.22}" portada
run "{\"mode\":\"iso\",\"out\":\"$R/idea.png\",\"res\":[1900,1330],\"samples\":96,\"dir\":[-1,1,0.7],\"transparent\":true,\"k\":0.035,\"world\":0.22,\"ui\":\"$UI\"}" idea
run "{\"mode\":\"iso\",\"out\":\"$R/funciones.png\",\"res\":[2000,700],\"samples\":96,\"dir\":[0,1,0.1],\"transparent\":true,\"k\":0.035,\"world\":0.22,\"margin\":1.1}" funciones
run "{\"mode\":\"iso\",\"out\":\"$R/materias.png\",\"res\":[1500,1500],\"samples\":96,\"dir\":[1,-1,0.65],\"transparent\":true,\"k\":0.035,\"world\":0.22}" materias
run "{\"mode\":\"iso\",\"out\":\"$R/cierre.png\",\"res\":[1700,1400],\"samples\":96,\"dir\":[0.8,0.25,0.55],\"transparent\":true,\"k\":0.035,\"world\":0.22}" cierre
run "{\"mode\":\"iso\",\"out\":\"$R/chasis.png\",\"res\":[1500,1450],\"samples\":96,\"dir\":[1,1,0.95],\"transparent\":true,\"k\":0.035,\"world\":0.22}" chasis
echo "TODO listo" >> progreso.txt
