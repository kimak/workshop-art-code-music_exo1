precision highp float;

uniform vec3 color;
varying vec3 vposition;

void main() {
	gl_FragColor = vec4( color*vposition, 1.0 );
}
