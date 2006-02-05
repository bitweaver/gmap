
munticoloured 3D Google markers

Here are 125 transparent png files suitable for use as Google Map markers.
They all use the default shadow, so you can use them with a base icon like this:

      // Create a base icon for all of our markers
      var baseIcon = new GIcon();
       baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
       baseIcon.iconSize = new GSize(20, 34);
       baseIcon.shadowSize = new GSize(37, 34);
       baseIcon.iconAnchor = new GPoint(9, 34);
       baseIcon.infoWindowAnchor = new GPoint(9, 2);
       baseIcon.infoShadowAnchor = new GPoint(18, 25);

      // Create an actual marker
      var icon = new GIcon(baseIcon);
      icon.image = "colour123.png";
      var markerA = new GMarker(point, icon);


Also included is the POVRay source code that I used to generate them,
for people who want to produce their own modified versions.
POVRay is a free raytracing program <www.povray.org>.

-- 
Mike Williams
