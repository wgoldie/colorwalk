COLORWALK
=========

Colorwalks are a new way to create theoretically continuous sequences of colors (actually often discrete in practice) that transition smoothly and aesthetically.
They can be used as a better alternative to standard, linear interpolating gradients to create interesting ,  aesthetic pleasing gradients, color transitions/animations, or palettes.

Open http://willgoldie.me/colorwalk/ to view.
Press 'h' to generate a new HSL-based gradient.
Press 'r' to generate a new RGB-based gradient.
Click and drag to explore the colorwalk.

A color walk is defined by a color volume (such as an rgb cube, hsv cylinder, L\*a\*b volume, etc) and a path through that volume/space.
The path, ideally a continuous function such as a spline or arc, is sampled to create the sequences of colors.
Using a color space that has a near-isomorphic mapping of perceptual distance to euclidian distance, such as L\*a\*b, will result in a smoother colorwalk.

This is an initial implementation of colorwalk visualization and computation, in three.js and webgl. Color spaces are rendered roughly from primitive shapes.
