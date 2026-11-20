# Documentación inicial del auto robot

## 1 Descripción

El Proyecto Final propone un robot móvil educativo para prácticas de mecatrónica. La plataforma tendrá **dos ruedas motrices y una rueda loca**. Permitirá trabajar con control de motores, seguimiento de línea, odometría y adquisición de datos LiDAR para mapeo 3D. El robot contará con control a bordo y una computadora externa podrá recibir y procesar datos.

La configuración de las ruedas y el rango de altura de los sensores de línea están definidos. Las cotas generales son referencias para el primer modelo CAD. Los componentes identificados como preferidos, candidatos u opcionales conservan el estado del presupuesto.

- [2 Mecánica](#2-mecánica)
- [3 Sensores](#3-sensores)
- [4 Control y accionamiento](#4-control-y-accionamiento)
- [5 Alimentación y cableado](#5-alimentación-y-cableado)
- [6 Computación e interfaz](#6-computación-e-interfaz)
- [7 Orden de modelado y decisiones abiertas](#7-orden-de-modelado-y-decisiones-abiertas)
- [8 Documentos de referencia](#8-documentos-de-referencia)

## 2 Mecánica

### 2.1 Dimensiones iniciales

| Elemento | Cota inicial | Referencia de medición |
|---|---:|---|
| Envolvente del auto | Aprox. 340 × 218 × 216 mm | Largo × ancho × alto. Incluye la pantalla trasera, los bujes de rueda y el LiDAR con su adaptador. |
| Placa inferior | 300 × 180 mm | Contorno en planta con esquinas exteriores de radio 8 mm. |
| Placa superior | 258 × 154 × 4 mm | Chapón plano de acero, con espesor preliminar de 4 mm y esquinas exteriores de radio 8 mm. |
| Altura libre entre placas | 55 mm | Entre las caras interiores de las placas. |
| Pilares laterales | Ø12 × 55 mm | Seis pilares, tres por lado, con paso de Ø5,5 mm para tornillería M5. |
| Despeje de la placa inferior | 85 mm | Desde el suelo hasta la cara inferior. |
| Despeje bajo la cuna de batería | 12 mm | Desde el suelo hasta la cara inferior de la cuna. La batería apoya a 14 mm del suelo. |
| Separación longitudinal de apoyos | 220 mm | Referencia preliminar entre el eje común de las ruedas motrices y el pivote de la rueda loca. |
| Ruedas motrices | Ø85 × 16 mm | Diámetro y ancho de la banda de goma según la referencia aportada. El buje representado sobresale de la banda. |
| Regulación de los sensores de línea | **5 a 20 mm sobre el suelo** | Desde el suelo a la cara activa. Recorrido vertical útil de **15 mm**. |

### 2.2 Placa inferior

Recibe las cargas de los soportes de motor, el anclaje de la rueda loca y la cuna de batería. Debajo de la placa queda la [Yuasa central](#51-batería-yuasa-y-bandejas-inferiores), con una bandeja electrónica de **78 × 176 mm** detrás y otra de **42 × 144 mm** delante. Las bandejas son desmontables y dejan **27 mm** y **23 mm** de altura útil respectivamente. Véanse [2.5 Rodadura](#25-rodadura) y [5 Alimentación y cableado](#5-alimentación-y-cableado).

### 2.3 Pilares laterales pasantes

Las placas se unen con seis pilares pasantes dispuestos en dos filas laterales, a **130 mm entre centros**. En cada lado hay tres pilares, separados **96 mm** entre vecinos. El paso axial de Ø5,5 mm coincide con las perforaciones de ambas placas y admite tornillería M5. El vano central queda libre para acceder a las fijaciones de la [placa superior](#24-placa-superior).

### 2.4 Placa superior

Es un chapón plano, modelado en acero dulce con **4 mm de espesor uniforme**, atornillado a los [pilares laterales](#23-pilares-laterales-pasantes). Lleva una [zona de montaje central](#27-montaje-central-de-accesorios) y sostiene el [LiDAR](#32-lidar) en las ranuras delanteras. La [cámara](#62-cámara) y la [pantalla](#63-pantalla) se fijan a la placa inferior y ocupan el nivel entre placas.

### 2.5 Rodadura

- **Ruedas motrices.** Dos ruedas con banda negra de **Ø85 × 16 mm** y llanta de chapa estampada. El centro del eje está a **42,5 mm** del suelo. El diámetro y el ancho del buje comercial quedan por medir para diseñar el acople que transmite el par desde el eje de cada [Pololu](#41-motores-y-encoders).
- **Rueda loca.** El presupuesto contempla una rueda de goma de Ø50 mm. Para el primer CAD se propone ubicarla centrada en el extremo trasero. Su altura de montaje debe dejar la placa inferior nivelada con las dos ruedas motrices apoyadas. Reservar el espacio que necesita al girar.
- **Soportes de motor.** Dos escuadras suspendidas unen los Pololu a la [placa inferior](#22-placa-inferior). Los agujeros de fijación siguen el patrón de la cara reductora. Los ejes de salida de los motores ocupan el eje de las ruedas.

### 2.6 Soporte frontal de sensores de línea

El [módulo de línea](#31-sensores-de-línea) se monta debajo del frente del chasis, por delante del eje motriz, con los sensores orientados hacia el suelo. Dos **torretas M3 de 40 mm**, copiadas del conjunto `Separadores_Montaje` de AutoFinalRobo2, unen las ranuras del PCB con la corredera. La guía ranurada se fija por debajo de la placa inferior. Tiene **15 mm de recorrido** para ajustar la cara activa entre **5 y 20 mm del piso**. La posición representada en el CAD es de **15 mm**.

### 2.7 Montaje central de accesorios

La placa superior tiene **cuatro ranuras pasantes de 24 × 5,5 mm**, orientadas en el sentido longitudinal y dispuestas en dos filas. Sus centros forman un rectángulo de **64 × 60 mm**. El patrón permite atornillar una base desde arriba o suspender un accesorio en el vano de **55 mm** entre placas.

Hay **dos ranuras curvas pasantes de 5,5 mm de ancho**, una al frente y otra atrás. Comparten el centro del patrón de montaje y tienen un radio de **106 mm**. Cada arco abarca **30°**, para orientar una base con dos fijaciones opuestas hasta **±15°** antes de apretarlas. La placa también tiene cuatro agujeros pasantes de **Ø5,5 mm**, uno cerca de cada esquina, para montaje fijo.

El chapón suma **cuatro ranuras longitudinales laterales de 36 × 5,5 mm**, dos por lado, y **dos ranuras curvas interiores de 5,5 mm de ancho**, una hacia el frente y otra hacia atrás. Los arcos interiores comparten centro con los exteriores, tienen un radio de **50 mm** y abarcan **50°**.

La tornillería y el patrón definitivo dependen de la base del accesorio. Si se incorpora un brazo, su masa, alcance y momentos en la base condicionan el espesor definitivo del chapón y la estabilidad del conjunto sobre sus tres apoyos.

## 3 Sensores

### 3.1 Sensores de línea

El CAD incorpora el **OSOYOO IR de cinco canales, modelo 2019018300**, a partir del STEP `5 Channel IR Tracker.step` de ProyectoRobotica2. El PCB del modelo mide **81 × 27,4 mm**. Las lecturas permiten estimar la posición de la línea respecto del centro del vehículo y generar una corrección de giro en el [control de movimiento](#44-control-de-movimiento). El montaje reutiliza las ranuras del PCB, según [2.6 Soporte frontal](#26-soporte-frontal-de-sensores-de-línea). El conexionado queda por definir.

### 3.2 LiDAR

El **Unitree 4D LiDAR L1 PM** es el sensor elegido para el mapeo 3D del prototipo. Se alimenta con **12 V regulados** y entrega la nube de puntos y los datos de la IMU a la Raspberry Pi mediante **UART TTL**. Queda por confirmar que el kit incluya el adaptador USB–UART. El adaptador se fija a las ranuras delanteras de la [placa superior](#24-placa-superior). Su eje vertical está en **X = 78,03 mm, Y ≈ 0 mm**, sobre la lente de la [Logitech C270](#62-cámara). La posición y orientación del LiDAR en el CAD sirven para relacionar sus datos con la [odometría](#44-control-de-movimiento). Si se monta un brazo, habrá que considerar su envolvente de movimiento en el campo de escaneo.

### 3.3 IMU

La **SparkFun BNO086** es opcional. El conjunto **I-SYST ICM-45686 + AK09940A** figura como alternativa. Si se incorpora una IMU, prever un apoyo rígido con orientación conocida respecto del chasis para usar sus lecturas junto con la [odometría](#44-control-de-movimiento).

### 3.4 Sensado de corriente

Se prevén **dos sensores Hall bidireccionales Pololu #5240 (ACS71240, ±10 A, 3,3 V)**, uno en serie con un conductor de cada motor, entre la salida del [Cytron](#42-driver-de-motores) y el motorreductor. El rango cubre los **5,5 A de bloqueo extrapolados a 12 V** de cada Pololu #4756. Cada salida analógica se lee en un ADC del ESP32-P4. GPIO21 y GPIO22 quedan como candidatos sujetos al pinout final. Se prevé compensar el cero de cada módulo y filtrar el efecto del PWM. La corriente y la velocidad del encoder permiten distinguir un aumento de carga de un bloqueo sostenido. [Sensor Pololu](https://www.pololu.com/product/5240) · [ADC del ESP32-P4](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32p4/schematic-checklist-esp32p4.html)

## 4 Control y accionamiento

### 4.1 Motores y encoders

El presupuesto prefiere dos **Pololu #4756 de 12 V y 76 rpm con encoder**. Contempla como alternativas los Pololu #4755, Transmotec PDS4265 y AOLONG JGB37-520B, este último con menor preferencia. Cada motor acciona una rueda. Los encoders aportan realimentación de velocidad y desplazamiento. La selección final define los anclajes y acoples de [2.5 Rodadura](#25-rodadura).

### 4.2 Driver de motores

El **Cytron MDD10A** figura como driver doble de base. Vincula las órdenes del [microcontrolador](#43-microcontrolador) con la alimentación y el accionamiento de ambos motores. Su montaje debe dejar acceso al cableado de potencia y a los terminales del driver. Véase [5 Alimentación y cableado](#5-alimentación-y-cableado).

### 4.3 Microcontrolador

El **ESP32 DevKit V1 con ESP-WROOM-32** figura como opción preferida. La distribución propuesta le asigna la lectura de encoders y sensores de línea, la generación de órdenes al driver y el intercambio de consignas y telemetría con la [Raspberry Pi](#61-raspberry-pi). El enlace físico y el protocolo entre placas quedan por definir.

### 4.4 Control de movimiento

El robot girará por diferencia de velocidad entre las ruedas motrices. La propuesta contempla un lazo de velocidad por rueda con realimentación de encoder y un PID como punto de partida. El seguimiento de línea generaría las correcciones a partir de los [sensores IR](#31-sensores-de-línea). Para estimar el desplazamiento y el giro se combinarán las lecturas de los encoders con el diámetro efectivo y la separación lateral de las ruedas, cotas que se tomarán de la [rodadura](#25-rodadura).

## 5 Alimentación y cableado

- **Batería.** El CAD usa una [Yuasa NP7-12 de 12 V y 7 Ah](#51-batería-yuasa-y-bandejas-inferiores) como referencia geométrica. La **Probattery BSLA-1270-CPB de 12 V y 7 Ah, con terminal F1**, queda como referencia de montaje fuera del subtotal. La publicación indica una envolvente aproximada de **151 × 65 × 97 mm**. Queda por confirmar el alto con terminales, la orientación admitida y el perfil del cargador antes de adaptar la cuna. Una segunda unidad para llegar a **14 Ah** queda como ampliación y requiere un montaje propio. [Modelo Probattery](https://electroimpulso.com.ar/catalogo/producto/bateria-12v-7ah-probattery-bsla-1270-cpb/)
- **Reguladores.** El presupuesto contempla un convertidor DC-DC de **5 V para la Raspberry Pi** y una etapa de **12 V para el LiDAR** por definir. Dimensionar la distribución a partir de las tensiones y consumos de las piezas elegidas.
- **Protección y corte de tracción.** Ambos quedan por definir. Reservar un punto accesible para el mando de corte y espacio para incorporar la protección y el [sensado de corriente](#34-sensado-de-corriente).
- **Cableado y conectores.** Prever recorridos junto a los [pilares laterales](#23-pilares-laterales-pasantes) para dejar libre el vano central. Separar los recorridos de potencia de motor y señales de sensores donde haya espacio. Reservar espacio para conectar, desconectar y desmontar las placas.
- **Alimentación de banco.** La fuente USB-C PD de 27 W para la Pi y la fuente de 12 V / 20 A figuran como opciones externas de trabajo.

### 5.1 Batería Yuasa y bandejas inferiores

La **Yuasa NP7-12 de 12 V y 7 Ah** mide **151 × 65 × 97,5 mm** con terminales y pesa cerca de **2,2 kg**. Yuasa admite instalarla hasta 90° respecto de la vertical. Se representa con un bloque negro de **97,5 × 151 × 65 mm**, acostado de costado debajo de la placa inferior. [Ficha técnica de Yuasa](https://www.yuasa.co.uk/yuasa/datasheet/index/sku/NP7-12/)

El bloque está centrado transversalmente y su centro está **20 mm por delante del centro de la placa inferior**. Apoya en una cuna con topes longitudinales y superiores. La cara inferior del bloque queda a **14 mm del suelo**, la cuna a **12 mm** y la placa a **85 mm**.

La bandeja trasera lleva los modelos de fabricante de la Raspberry Pi 5 y el Cytron, con separadores ajustados a sus agujeros. Los puertos USB y Ethernet de la Pi y los bornes de potencia del Cytron quedan hacia los lados. La delantera reserva espacio para el ESP32 y la regulación. Quedan por definir el sistema de refrigeración, los enchufes y el recorrido del cableado.

## 6 Computación e interfaz

### 6.1 Raspberry Pi

La **Raspberry Pi 5 de 4 GB** figura como componente base. La distribución propuesta le asigna la adquisición de datos del [LiDAR](#32-lidar) y la [cámara](#62-cámara), la comunicación con el [ESP32](#43-microcontrolador) y la entrega de datos a la computadora externa. Su CAD de fabricante está incorporado en la [bandeja trasera bajo la placa inferior](#22-placa-inferior), con los conectores laterales accesibles y la refrigeración por definir.

### 6.2 Cámara

La **Logitech C270** queda orientada horizontalmente hacia el frente, con la lente a **116,5 mm** del suelo y en las mismas coordenadas **X e Y** que el eje del LiDAR. Se apoya en una base fijada a la placa inferior. La carcasa y el clip son representaciones simplificadas basadas en la envolvente de **72,91 × 31,91 × 66,64 mm** del fabricante. [Manual Logitech C270](https://www.logitech.com/assets/46735/4/hd-webcam-c270.pdf)

Para video 16:9, el campo diagonal de **55°** equivale a aproximadamente **28,6° verticales**. En el CAD, el campo vertical deja unos **9 mm** sobre el borde de la placa inferior y **13 mm** por debajo del borde del chapón superior. Los pilares quedan a los lados del campo horizontal. [Especificación óptica de Logitech](https://www.logitech.com/en-us/shop/p/c270-hd-webcam.960-000694)

### 6.3 Pantalla

La **Waveshare ESP32-P4-WIFI6-Touch-LCD-5** de **126,9 × 70,7 mm** está incorporada mediante el STEP del fabricante. Se monta centrada en el vano entre placas, por detrás del chasis, mirando hacia atrás e inclinada **12° hacia arriba**. Su altura proyectada es de unos **69 mm**, por lo que sobresale unos **7 mm** por arriba y por abajo del vano de **55 mm**. Dos soportes se fijan a la placa inferior. Queda por definir el enlace con el resto del robot. [Recursos mecánicos de Waveshare](https://docs.waveshare.com/ESP32-P4-WIFI6-Touch-LCD-5/Resources-And-Documents)

### 6.4 Computadora externa e interfaz web

La computadora externa recibirá datos para visualización y procesamiento. El proyecto contempla una interfaz web para trabajar con las lecturas y el mapa. Quedan por definir el enlace con el robot, el formato de los datos y la distribución del procesamiento entre la Pi y la computadora.

## 7 Orden de modelado y decisiones abiertas

1. Dibujar el suelo, las dos ruedas motrices, la rueda loca y los planos de las dos placas con las [cotas iniciales](#21-dimensiones-iniciales).
2. Representar motores, batería, placas electrónicas, LiDAR, pantalla y cámara con sus volúmenes y puntos de fijación. Incorporar el [soporte de línea](#26-soporte-frontal-de-sensores-de-línea) con el recorrido completo.
3. Ubicar los soportes de motor y la bandeja de batería respecto de los [pilares laterales](#23-pilares-laterales-pasantes). Reservar los accesos necesarios para el montaje de accesorios y el mantenimiento.
4. Cerrar los contornos, el espesor y los aligeramientos cuando se definan las piezas, las cargas de diseño y el método de fabricación.

## 8 Documentos de referencia

- [Presupuesto de componentes del Proyecto Final](Presupuesto_Componentes_ProyectoFinal.xlsx). Registra los modelos contemplados y el estado de selección de cada uno.
- **A cargo del taller.** Rodadura y fabricación, insumos pendientes de potencia y cableado, y accesorios de montaje (microSD, refrigeración, soportes y adaptador de LiDAR si hace falta). Estas partidas quedan fuera del subtotal de compras.
- [Viabilidad y deseabilidad del proyecto](Presentacion%2020112026/Respuestas_TP_Viabilidad_Deseabilidad.md). Describe el objetivo educativo y las aplicaciones previstas.

### 8.1 Modelos CAD de componentes

| Componente | Archivo o referencia de montaje |
|---|---|
| OSOYOO 2019018300 y torretas M3 × 40 | Geometría de ProyectoRobotica2 incorporada en Fusion. Véase [2.6 Soporte frontal](#26-soporte-frontal-de-sensores-de-línea). |
| Unitree 4D LiDAR L1 PM | STEP de fabricante incorporado sobre un adaptador desmontable que usa tres puntos de las ranuras curvas existentes. Unitree publica un archivo STEP idéntico en los centros de descargas L1 y L2. [Centro de descargas L1](https://www.unitree.com/download/LiDAR/) · [Centro de descargas L2](https://www.unitree.com/download/L2/) |
| Raspberry Pi 5 | STEP oficial de la placa. La refrigeración y el acceso a conectores se dimensionan aparte. [Documentación de Raspberry Pi 5](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#raspberry-pi-5) |
| Pololu #4756 | Dos instancias del STEP oficial 37D para las variantes 100:1, 131:1 y 150:1 con encoder. El motor elegido es el #4756 de 131:1. [Recursos de Pololu](https://www.pololu.com/product/4756/resources) |
| Cytron MDD10A | STEP oficial de la revisión 2.0 incorporado en la bandeja trasera. [Recursos de Cytron](https://www.cytron.io/p-10amp-5v-30v-dc-motor-driver-2-channels) |
| Waveshare ESP32-P4-WIFI6-Touch-LCD-5 | STEP oficial incorporado en el soporte trasero. [Archivos mecánicos de Waveshare](https://github.com/waveshareteam/ESP32-P4-WIFI6-Touch-LCD-5/tree/main/hardware/mechanical) |
| Logitech C270 | Modelo simplificado de carcasa, óptica y clip. [Manual Logitech C270](https://www.logitech.com/assets/46735/4/hd-webcam-c270.pdf) |
| ESP32 DevKit V1, batería LiPo 3S y rueda loca | Pendiente identificar la placa, batería y rueda comerciales concretas para usar sus dimensiones o importar su CAD. |
