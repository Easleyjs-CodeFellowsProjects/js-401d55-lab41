//Seattle Central College GPS co-ordinates
const CF_LAT = 47.6167265; 
const CF_LON = -122.3241714;


export function calculateBearing(lat, lon, lat2, lon2) {
  const teta1 = toRadians(lat);
  const teta2 = toRadians(lat2);
  const delta1 = toRadians(lat2 - lat);
  const delta2 = toRadians(lon2 - lon);

  //==================Heading Formula Calculation================//

  const y = Math.sin(delta2) * Math.cos(teta2);
  const x = Math.cos(teta1) * Math.sin(teta2) - Math.sin(teta1) * Math.cos(teta2) * Math.cos(delta2);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng); // radians to degrees
  brng = ((brng + 360) % 360);

  //console.log("Heading GPS:", brng);

  return getCardinalDirection( brng );
}

// Helper function to convert degrees to radians
/*
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
*/
// Helper function to convert radians to degrees
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Helper function to determine cardinal direction
function getCardinalDirection(bearing) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];

  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}



//===================== Distance ====================//

export function calculateDistance(lat1, lon1, lat2, lon2, unit = 'metric') {
  const R = unit === 'imperial' ? 3959 : 6371; // Radius of the Earth in either miles or kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in either miles or kilometers
  return distance < 1 
                  ? { 'unit': 'feet', 'distance': milesToFeet( distance ).toFixed(2) }
                  : { 'unit': 'miles', 'distance': distance.toFixed(2) };
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function milesToFeet( distance ) {
  //if (unit === 'imperial') {
  return distance * 5280; // Convert to feet if less than a mile
  //}
  /*
  else {
      return distance < 1 ? distance * 1000 : distance; // Convert to meters if less than a kilometer
  }
  */
}