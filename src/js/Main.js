import vsBasic from "shaders/basic.vs"
import fsBasic from "shaders/basic.fs"

import audio from "mnf/audio"

class Main {

	constructor(){
		// create a new scene & renderer
		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		document.body.appendChild( this.renderer.domElement )

		// create camera
		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 )
		this.camera.position.z = 800

		// create a small Icosahedron with custom material
		let customMaterial = new THREE.RawShaderMaterial( {
			wireframe:true,
			uniforms: {
				color: { type: "c", value: new THREE.Color( 0x00ff00 ) },
				time:  { type: "f", value: 1 },
				volume: { type: "f", value: 0 },
			},
			vertexShader: vsBasic,
			fragmentShader: fsBasic
		} )

		// create a big central Icosahedron
		let geometry = new THREE.IcosahedronGeometry(100,2)
		let material = new THREE.MeshBasicMaterial( { color: 0xFF00FF, wireframe:true } )
		//this.meshBig = new THREE.Mesh( geometry, material )
		this.meshBig = new THREE.Mesh( geometry, customMaterial )
		this.scene.add( this.meshBig )

		this.meshSmall = new THREE.Mesh( geometry, customMaterial )
		this.meshSmall.scale.set( 1, 1, 1 )
		//this.scene.add( this.meshSmall )

		this.theta = 0
		this.phi = 0
		this.radius = 150

		// if you don't want to hear the music, but keep analysing it, set 'shutup' to 'true'!
		audio.start( { live: false, shutup: false, showPreview: true } )
		audio.onBeat.add( this.onBeat )

		window.addEventListener( 'resize', this.onResize, false )

		this.animate()
	}

	onBeat = () => {
		this.meshSmall.material.uniforms.color.value.r = Math.random()
	}

	// each frame
	animate = () => {
		requestAnimationFrame( this.animate )

		this.meshSmall.material.uniforms.time.value+=0.05;
		this.meshSmall.material.uniforms.volume.value=audio.volume*50;

		this.meshBig.rotation.x += 0.005
		this.meshBig.rotation.y += 0.01
		// play with audio.volume
		let scale = 1 + .025 * audio.volume
		this.meshBig.scale.set( scale, scale, scale )

		this.meshSmall.position.x = Math.cos( this.theta ) * Math.sin( this.phi ) * this.radius
		this.meshSmall.position.y = Math.sin( this.theta ) * Math.sin( this.phi ) * this.radius
		this.meshSmall.position.z = Math.cos( this.phi ) * this.radius

		this.theta += .01
		this.phi += .05

		// play with audio.values[ 2 ], the green bar of the preview
		scale = .1 + .05 * audio.values[ 2 ]
		this.meshSmall.scale.set( scale, scale, scale )

		this.renderer.render( this.scene, this.camera )
	}

	// on resize
	onResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( window.innerWidth, window.innerHeight )
	}

}

export default new Main()
