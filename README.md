COLORWALK
=========
 
Colorwalks are a way to create theoretically continuous sequences of colors (actually often discrete in practice) that transition smoothly and aesthetically.
They can be used to create high-quality gradients, color transitions/animations, or palettes.
 
A color walk is defined by a color volume (such as an rgb cube, hsv cylinder, L\*a\*b\* volume, etc) and a path through that volume/space. 
The path, ideally a continuous function such as a spline or arc, is sampled to create the sequences of colors.
Using a color space, such as L*a*b, with a near-isomorphic mapping of perceptual distance to euclidian distance, will result in a smoother colorwalk.

This is an initial implementation of colorwalk visualization and computation, in three.js and webgl. Color spaces are rendered as voxel volumes (created from image slices). 
Javascript's annoying number and color handling means I will probably rewrite the code in something else soon.

color walk with me