import vsBasic from "shaders/basic.vs"
import fsBasic from "shaders/basic.fs"
import vsMinimal from "shaders/minimal.vs"
import MeshCustomMaterial from "MeshCustomMaterial";

import audio from "mnf/audio";
import {TweenLite} from "gsap";

const elements = [];

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

		//let shaderMaterial = new MeshCustomMaterial( {
		let shaderMaterial = new THREE.RawShaderMaterial( {
			wireframe:true,
			uniforms: {
				color: { type: "c", value: new THREE.Color( 0xFFFFFF ) },
				time:  { type: "f", value: 1 },
				volume: { type: "f", value: 0 },
			},
			vertexShader: vsBasic,
			fragmentShader: fsBasic
		} )

		// create a big central Icosahedron
		let geometry = new THREE.IcosahedronGeometry(100,2)
		//let material = new THREE.MeshToonMaterial( { color: "0xEE0000", wireframe:false } )
		let customMaterial = new MeshCustomMaterial( {
			/*uniforms: {
				time:  { type: "f", value: 1 },
			},*/
			color: 0xFFE163,
			wireframe:false,
			opacity: 0.8,
			transparent: true,
			metalness: 0.5,
			/*map: null,@
			metalness: 1.0,
			roughness: 0,
			opacity: 0.5,
			side: THREE.FrontSide,
			shading: THREE.SmoothShading,
			envMapIntensity: 5,
			premultipliedAlpha: true*/
		}, {
			time:  { type: "f", value: 1 },
			volume:  { type: "f", value: 1 },
		} )
		//let material = new THREE.MeshBasicMaterial( { color: 0xFF00FF, wireframe:false } )

		//this.meshBig = new THREE.Mesh( geometry, material )
		this.meshBig = new THREE.Mesh( geometry, shaderMaterial )
		const scaleBig = 1.3;
		this.meshBig.scale.set( scaleBig, scaleBig, scaleBig )
		this.scene.add( this.meshBig )

		//this.meshSmall = new THREE.Mesh( new THREE.BoxGeometry(10,10,10), material )
		this.meshSmall = new THREE.Mesh( geometry, customMaterial )
		this.meshSmall.scale.set( 1, 1, 1 )
		this.scene.add( this.meshSmall )

		this.theta = 0
		this.phi = 0
		this.radius = 150



		this.groupElements = new THREE.Group();
		this.scene.add(this.groupElements);
		//this.elementMaterial = new THREE.MeshBasicMaterial( { color: 0xCCCCCC, wireframe:false } );
		this.elementMaterial = new THREE.RawShaderMaterial( {
			wireframe:false,
			uniforms: {
				color: { type: "c", value: new THREE.Color( 0xFFFFFF ) },
			},
			vertexShader: vsMinimal,
			fragmentShader: fsBasic
		} );
		const amplitude = 300;
		for (var i = 0; i < 30; i++) {
			elements[i] = new THREE.Mesh( new THREE.OctahedronGeometry( 6, 0 ),
				this.elementMaterial
				//customMaterial
			)
			elements[i].position.x = Math.random()*amplitude - Math.random()*amplitude
			elements[i].position.y = Math.random()*amplitude - Math.random()*amplitude
			elements[i].position.z = Math.random()*amplitude - Math.random()*amplitude
			this.groupElements.add( elements[i] )
		}


		var light = new THREE.PointLight( 0xFFFFFF ); // soft white light
		this.scene.add( light );
		light.position.x=500;

		light = new THREE.PointLight( 0xFFFFFF ); // soft white light
		this.scene.add( light );
		light.position.x=-500;


		light = new THREE.PointLight( 0xFFFFFF ); // soft white light
		this.scene.add( light );
		light.position.y=-500;
		//light.position.z=3000;

		var light3 = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
		this.scene.add( light3 );

		// if you don't want to hear the music, but keep analysing it, set 'shutup' to 'true'!
		audio.start( { live: false, shutup: false, showPreview: false, playlist: ["audio/galvanize.mp3"] } )
		audio.onBeat.add( this.onBeat )

		window.addEventListener( 'resize', this.onResize, false )

		this.animate()
	}

	onBeat = () => {
		this.elementMaterial.uniforms.color.value.r = Math.random()

		let scale = 1 + .025 * audio.volume*10;
		TweenLite.to(this.groupElements.scale, 0.2, { x: scale, y: scale, z: scale, onComplete:()=>{
			TweenLite.to(this.groupElements.scale, 1, { x: 1, y: 1, z: 1});
		} });
	}

	// each frame
	animate = () => {
		requestAnimationFrame( this.animate )

		this.meshSmall.material.uniforms.time.value+=0.1
			this.meshBig.material.uniforms.time.value+=0.05;

		this.meshSmall.material.uniforms.volume.value =audio.volume*10;
			this.meshBig.material.uniforms.volume.value=audio.volume*20;

		this.meshBig.rotation.x += 0.005
		this.meshBig.rotation.y += 0.01
		// play with audio.volume
		let scale = 1 + .025 * audio.volume
		//this.groupElements.scale.set( scale, scale, scale )

		const circleRadius = Math.cos( this.theta ) * Math.sin( this.phi ) * this.radius;
		/*this.meshSmall.position.x = circleRadius
		this.meshSmall.position.y = circleRadius
		this.meshSmall.position.z = Math.cos( this.phi ) * this.radius*/

		this.groupElements.rotation.x += 0.01;
		this.groupElements.rotation.y += 0.001;

		for (var i = 0; i < elements.length; i++) {
				elements[i].rotation.x += 0.005
				elements[i].rotation.y += 0.01
		}
		this.theta += .01
		this.phi += .05

		// play with audio.values[ 2 ], the green bar of the preview
		scale = .1 + .05 * audio.values[ 2 ]
		//this.meshSmall.scale.set( scale, scale, scale )

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
