# Google Earth Engine Script for Rangeland Monitoring

This Google Earth Engine (GEE) script is designed for performing rangeland monitoring within a specified region of interest (ROI) using Sentinel-2 satellite imagery. The script showcases a workflow for image preprocessing, training data creation, feature extraction, model training (Random Forest classifier), and accuracy assessment.

## Features

- **Region of Interest (ROI) Definition**: The script starts by defining a `roi` variable, representing the geographic area of interest for the analysis, and visualizing it on the map.

- **Sentinel-2 Image Collection**: It loads a collection of Sentinel-2 images covering the specified time frame (`2021-12-01` to `2022-04-30`), pre-filters the images to reduce cloud coverage, and computes a median composite to represent the area.

- **Visualization Parameters**: Visualization parameters are defined for true color visualization of the Sentinel-2 data.

- **Training Data Preparation**: The script creates a composite of various land cover types by merging different feature collections (e.g., water, wetlands, cultivated lands, bare lands, grasslands, and shrublands) to serve as training data for the model.

- **Feature Extraction**: Indices such as NDVI, NDBI, MNDWI, and BSI are calculated and added as bands to improve the classification accuracy.

- **Random Forest Classification**: A Random Forest classifier is trained using the prepared features and training data, and then used to classify the composite image into different land cover classes.

- **Accuracy Assessment**: The script performs an accuracy assessment of the classification, including calculating overall accuracy, Kappa coefficient, and generating a confusion matrix.

- **Exporting Results**: Finally, it exports the classified image and accuracy metrics to Google Drive in CSV and GeoTIFF formats.

## Usage

To use this script, you will need to replace the placeholder variables (`afarzones`, `watercov`, `Wetlands`, `cultivatedlands`, `barelands`, `grasslands`, `shrublands`) with actual Earth Engine Feature Collections representing the geographic features of your ROI.

Ensure that you have access to Google Earth Engine and that you're familiar with JavaScript for GEE.

## Visualization

The script includes commands to add layers to the Earth Engine map for visualization purposes, such as the ROI boundary, the Sentinel-2 composite, and the classification results with a custom palette.

## Exporting Data

The script demonstrates how to export the classification results and accuracy metrics to Google Drive, which can then be downloaded for further analysis or reporting.

## Acknowledgment

This project is funded by The Global Challenges Research Fund (GCRF) Agrifood Africa of the United Kingdom. The support from GCRF Agrifood Africa has enabled the development and application of this script for enhancing agricultural and environmental research efforts in Africa.

## Requirements

This script requires a Google Earth Engine account and basic knowledge of JavaScript and Earth Engine's API.

## License

This script is provided "as is", without warranty of any kind, express or implied. Feel free to use and modify it for your research or projects.