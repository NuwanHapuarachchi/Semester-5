Handheld RFID Reader
This repository contains the complete design files, firmware, software, and documentation for a Handheld High-Frequency (HF) RFID Reader. This project was developed as a partial fulfillment of the requirements for the module EN 2161: Electronic Design Realization at the Department of Electronic & Telecommunication Engineering, University of Moratuwa.

The device is designed for mobile workflows, enabling fast and reliable identification of 13.56 MHz RFID tags, with data synchronized to a central database via Wi-Fi.

✨ Features
Ergonomic Design: A comfortable, gun-shaped enclosure with an ergonomic handle, designed in SolidWorks and 3D printed for industry-level durability.

HF RFID Capability: Reads HF (13.56 MHz) RFID tags, supporting the ISO 15693 standard.

Wireless Connectivity: Integrated ESP8266 Wi-Fi module for direct communication with a cloud database, offering greater range and flexibility compared to Bluetooth.

Modular PCB Design: Three separate 2-layer PCBs for the Antenna, MCU, and Power circuits to ensure signal integrity and simplify debugging.

Rechargeable Power System: Powered by two 18650 Li-Ion batteries (total capacity ~3600 mAh), with a dedicated charging cradle and a Battery Management System (BMS) for safety and longevity.

User Interface:

LED indicators for power, Wi-Fi status, and read confirmation.

A comprehensive Web Application (Node.js) for system management, data visualization, and device configuration.

A cross-platform Mobile Application (Flutter) for on-the-go data access and monitoring.

Centralized Database: Utilizes Supabase (PostgreSQL) for robust, scalable, and secure data storage with row-level security policies.

🏗️ System Architecture
The system is designed around a central microcontroller (ATmega32U4) that interfaces with the RFID frontend (PN5180) and the Wi-Fi module (ESP8266). Data is sent to a cloud database and can be accessed via web and mobile applications.

(Figure from EDR_Design_Report.pdf)

🛠️ Hardware Design
Key Components
Component

Selected Model

Reason for Selection

RFID Frontend

NXP PN5180

High performance, excellent documentation, and support for ISO 15693.

Microcontroller

Atmel ATmega32U4

Native USB support, sufficient I/O, and strong community support.

Wi-Fi Module

Espressif ESP8266

Direct internet access, high data throughput, and large developer community.

Battery

2x Li-Ion 18650 (3600 mAh)

High capacity for full-shift operation, good availability, and safety.

Antenna Design & Parameters
A custom 2-turn PCB trace antenna was designed for the 13.56 MHz frequency. The design was simulated and optimized for performance.

Parameter

Value

Operating Frequency

13.56 MHz

Target Impedance

20 Ω

Antenna Dimensions

65 mm x 65 mm

Number of Turns (N)

2

Track Width (w)

500 µm

Gap between tracks (g)

500 µm

Simulated Inductance

891 nH

Simulated Capacitance

2.3 pF

Simulated Resistance

1.180 Ω

(Data sourced from EDR_Design_Report.pdf)

Enclosure Design (SolidWorks)
The enclosure and charging cradle were designed in SolidWorks for ergonomics, durability, and ease of assembly. The final models were 3D printed using ABS material.

RFID Reader - Final Design

Charging Cradle - Final Design





(Figure from EDR_Design_Report.pdf)

(Figure from EDR_Design_Report.pdf)

PCB Design (Altium)
The system uses a modular approach with three separate 2-layer PCBs: Antenna, MCU, and Power. This separation minimizes interference and simplifies manufacturing.

Antenna PCB 3D View

MCU PCB 3D View

Power PCB 3D View







(Figure from EDR_Design_Report.pdf)

(Figure from EDR_Design_Report.pdf)

(Figure from EDR_Design_Report.pdf)

💻 Software & Firmware
Firmware
ATmega32U4: Programmed in C++ using Atmel Studio. It handles SPI communication with the PN5180 and UART communication with the ESP8266.

ESP8266: Programmed using the ESP8266 RTOS SDK. It receives data from the ATmega32U4 via UART and transmits it to the Supabase backend over Wi-Fi.

Database
The backend uses Supabase, which provides a PostgreSQL database, authentication, and real-time APIs. The schema is designed to store information about users, readers, tags, and scan events.

(Figure from Software Report.pdf)

Web & Mobile Applications
A web app (Node.js) and a mobile app (Flutter) provide a user-friendly interface to manage the RFID system.

Web App Dashboard

Mobile App Dashboard





(Figure from EDR_Design_Report.pdf)

(Figure from EDR_Design_Report.pdf)

📸 Gallery
3D Printed Final Product

Initial Breadboard Testing





(Figure from EDR_Design_Report.pdf)

(Figure from EDR_Design_Report.pdf)

👨‍💻 Project Team
This project was a collaborative effort by the following team members:

Index No.

Name

220235V

Ilukkumbura I.M.E.I.B.

220212A

Hapuarachchi H.A.D.N.D.

220162T

Fernando C.S.R.

220221B

Hathurusingha H.A.R.

220420J

Nawarathne M.A.A.K.

220700T

Wickramasinghe S.D.

220089B

Cooray M.S.T.

220163X

Fernando D.S.

(Team members list from EDR_Design_Report.pdf)

🙏 Acknowledgments
This project was submitted in partial fulfillment of the requirements for the module EN 2161 Electronic Design Realization at the Department of Electronic & Telecommunication Engineering, University of Moratuwa, Sri Lanka. We are grateful for the guidance from our instructors and the opportunity to work on a comprehensive design project.