// Define a region of interest.  
//**************************************************************************
var roi = afarzones; 
Map.addLayer(roi,{},'afar zones bound',false);   
Map.centerObject(roi,6);

// Load Sentinel 2A image
var image = ee.ImageCollection('COPERNICUS/S2_SR')
.filterDate('2021-12-01', '2022-04-30')
// Pre-filter to get less cloudy granules.
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
.filterBounds(roi)
.median();

var visParamsTrue = {bands: ['B4', 'B3', 'B2'], min: 0, max: 2500, gamma: 1.1};
Map.addLayer(image, visParamsTrue, "Sentinel 2022");
Map.centerObject(roi, 6);

//Create Training Data
var GCPpoints = watercov.merge(Wetlands).merge(cultivatedlands).merge(barelands).merge(grasslands).merge(shrublands);
var label = 'LULC';
var bands = ['B2', 'B3', 'B4', 'B8', 'B11']; // These are bands with 10 meter spatial resolution. 
var input = image.select(bands);

//adding VIS as additional bands to improve classification 
var addIndices = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename(['ndvi']);
  var ndbi = image.normalizedDifference(['B11', 'B8']).rename(['ndbi']);
  var mndwi = image.normalizedDifference(['B3', 'B11']).rename(['mndwi']); 
  var bsi = image.expression(
      '(( X + Y ) - (A + B)) /(( X + Y ) + (A + B)) ', {
        'X': image.select('B11'), //swir1
        'Y': image.select('B4'),  //red
        'A': image.select('B8'), // nir
        'B': image.select('B2'), // blue
  }).rename('bsi');
  return image.addBands(ndvi).addBands(ndbi).addBands(mndwi).addBands(bsi);
};
var composite = addIndices(input);

// Add a random column and split the GCPs into training and validation set
var gcp = GCPpoints.randomColumn();

// 70% training, 30% validation
var trainingGcp = gcp.filter(ee.Filter.lt('random', 0.7));
var validationGcp = gcp.filter(ee.Filter.gte('random', 0.3));
Map.addLayer(validationGcp);

// Overlay the point on the image to get training data.
var training = composite.sampleRegions({
  collection: trainingGcp,
  properties:  [label], 
  scale: 10,
  tileScale: 16
});
print(training);

// Overlay the point on the image to get validation data.
var validation = composite.sampleRegions({
  collection: validationGcp,
  properties:  [label], 
  scale: 10,
  tileScale: 16
});
print(validation);

// Train Random forest classifier (number of trees = 50)) from the training sample.
var rfclassifier = ee.Classifier.smileRandomForest(50)
.train({
  features: training,  
  classProperty: 'LULC',
  inputProperties: composite.bandNames()
});
// Classify the image
var rfclassified = composite.classify(rfclassifier);
print(rfclassified.getInfo());

// Define a palette for the classification. 
var landcoverPalette = [
  '253494', //Water (0)
  '111149', // wetlands (1)
  '006837', //cultivated land (2)
  'FF8000', //bareland (3)
  '000000', //grass land(4)
  '969696', //shrubland (5) 
];

Map.addLayer(rfclassified, {palette: landcoverPalette, min: 1, max: 6}, 'RF_classification');

// Accuracy Assessment
// Get a confusion matrix representing resubstitution accuracy.
var trainAccuracy = rfclassifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());
print('Training Kappa index:', trainAccuracy.kappa());

// Classify the validation data.
var validated = validation.classify(rfclassifier);

// Get a confusion matrix representing expected accuracy.
var testAccuracy = validated.errorMatrix('LULC', 'classification');

print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', testAccuracy.accuracy());
print('Validation Kappa index:', testAccuracy.kappa());
//**************************************************************************
// exported in a CSV file
var fc = ee.FeatureCollection([
  ee.Feature(null, {
    'accuracy': testAccuracy.accuracy(),
    'testkappa':testAccuracy.kappa(), 
    'matrix': testAccuracy.array()
  })
]);

print(fc);

// export error matrix as  csv file 
Export.table.toDrive({
  collection: fc,
  description: 'afar_testaccuracy_rf',
  folder: 'afar_accu_rf',
  fileNamePrefix: 'afar_test_accu',
  fileFormat: 'CSV'
}); 

// exported training accuracy_in a CSV file
var trainingfc = ee.FeatureCollection([
  ee.Feature(null, {
    'accuracy': trainAccuracy.accuracy(),
    'testkappa':trainAccuracy.kappa(), 
    'matrix': trainAccuracy.array()
  })
]);

print(trainingfc);

// export error matrix as  csv file 
Export.table.toDrive({
  collection: trainingfc,
  description: 'train_Accur_rf2022',
  folder: 'accu_rf',
  fileNamePrefix: 'train_accuracy22',
  fileFormat: 'CSV'
});

//Exporting classified image in Geetiff/LULC map of eth.
Export.image.toDrive({
  image: rfclassified, 
  description:  'S2A_rf24124', 
  region: roi,
  folder: 'Afar_rf24124',
  scale:20,
  maxPixels:1e13,
  crs: 'EPSG:32637',  
});  

