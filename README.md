# elecrtonics

## Integrate Application

**Git clone https://github.com/zoalfikar/electronics.git**

**Cd electronics**

## Setup

### Install Node

**npm i**

### Set electronics.json
go to  *electronics.json*  

set ***mysql.service : "service name"***, service name could be {MYSQL57 , MYSQL80 ,mysql} according to mysql version , to run **net start service ** automatically. 

set ***mysql.user** 

set ***mysql.password** 


run **wmic CPU get ProcessorId** to get Processor ID and regist it by adding this ID to ***customers :[]***

if you want to open development tools set ***devMode:"1"***

### Rewrite Configuration

run **node rewriteConfig** to write and save configuration to encrypted file *electronics.confige.txt*

## Start The Application

**npm run start**

## Usage

click on **"تهيئة"**  or **"Initialization"** button , You can see all the processes in the development tools console .

## Build

**npm run make**
