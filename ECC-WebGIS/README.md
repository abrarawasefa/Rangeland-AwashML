# ECC WebGIS Project

## Overview
This project is a Django-based WebGIS application designed to manage and visualize geographical information. It leverages Django's robust framework for the backend and integrates various GIS functionalities for data handling and visualization. The service is up in this domain: http://gotourist.ssgi.gov.et/base

## Features
- Geospatial data management
- Interactive map visualization
- Data analysis tools
- User authentication and authorization

## Prerequisites
- Python 3.x
- Django 3.x

## Installation
- Clone the repository to your local machine.
- Install the required Python packages.

## Configuration
Before running the application, make sure to set the Django settings module:
```
export DJANGO_SETTINGS_MODULE=ECC.settings
```
Note: Adjust the command according to your operating system.

## Running the Application
To start the Django development server, run:
```
python manage.py runserver
```
Access the application at `http://127.0.0.1:8000` in your web browser.

## Development
- Make sure to apply migrations if you modify the database models:
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```
- Create a superuser to access the Django admin site:
  ```
  python manage.py createsuperuser
  ```

## Acknowledgment

This project is funded by The Global Challenges Research Fund (GCRF) Agrifood Africa of the United Kingdom. The support from GCRF Agrifood Africa has enabled the development and application of this script for enhancing agricultural and environmental research efforts in Africa.


## License

This script is provided "as is", without warranty of any kind, express or implied. Feel free to use and modify it for your research or projects.